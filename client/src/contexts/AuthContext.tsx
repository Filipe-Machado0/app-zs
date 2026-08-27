import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { api } from '../api/client';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isBasic: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  hasPurchased: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updatePreferences: (prefs: UserProfile['preferences']) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (uid?: string, email?: string) => {
    try {
      const res = await api.getProfile();
      if (res.profile) {
        setProfile(res.profile);
      } else if (uid && email) {
        const synced = await api.syncProfile({ uid, email });
        setProfile(synced.profile);
      }
    } catch (err: any) {
      console.warn('Erro ao carregar perfil do backend:', err.message);
    }
  };

  useEffect(() => {
    // 1. Detectar parâmetros de Magic Link do Resend/Checkout (?email=...&plano=...&nome=...)
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlEmail = searchParams.get('email');
      const urlPlano = searchParams.get('plano') || searchParams.get('plan') || searchParams.get('tier');
      const urlNome = searchParams.get('nome') || searchParams.get('name');

      if (urlEmail || urlPlano) {
        let assignedRole: UserRole = 'premium';
        if (urlPlano) {
          const p = urlPlano.toLowerCase();
          if (p === 'basico' || p === 'basic' || p === 'ebook' || p === 'padrao') {
            assignedRole = 'basic';
          } else if (p === 'premium' || p === 'vip' || p === 'vitalicio' || p === 'pro') {
            assignedRole = 'premium';
          } else if (p === 'admin') {
            assignedRole = 'admin';
          }
        }

        const effectiveEmail = urlEmail || 'compradora@exemplo.com';
        const effectiveName = urlNome || effectiveEmail.split('@')[0];
        const magicUid = `user-${Date.now()}`;

        localStorage.setItem('demo_user_uid', magicUid);
        localStorage.setItem('demo_user_role', assignedRole);
        localStorage.setItem('user_email', effectiveEmail);
        localStorage.setItem('user_display_name', effectiveName);

        const magicProfile: UserProfile = {
          uid: magicUid,
          email: effectiveEmail,
          displayName: effectiveName,
          role: assignedRole,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          preferences: {
            acceptedFoods: ['Batata', 'Banana', 'Pão', 'Arroz'],
            challengingMeals: ['jantar'],
            preferredTextures: ['crocante', 'macio'],
            avoidedTextures: ['cremoso'],
            cookingTimeMinutes: 20,
          },
        };

        setProfile(magicProfile);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Erro ao processar Magic Link:', e);
    }

    // 2. Verificar se já existe sessão salva no localStorage
    const demoUid = localStorage.getItem('demo_user_uid');
    const demoRole = (localStorage.getItem('demo_user_role') as UserRole) || null;
    const storedEmail = localStorage.getItem('user_email');
    const storedName = localStorage.getItem('user_display_name');

    if (!isFirebaseConfigured || demoRole || storedEmail) {
      const effectiveRole = demoRole || 'premium';
      const mockProfile: UserProfile = {
        uid: demoUid || 'demo-user-123',
        email: storedEmail || 'responsavel@exemplo.com',
        displayName: storedName || 'Responsável',
        role: effectiveRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          acceptedFoods: ['Batata', 'Banana', 'Pão', 'Arroz'],
          challengingMeals: ['jantar'],
          preferredTextures: ['crocante', 'macio'],
          avoidedTextures: ['cremoso'],
          cookingTimeMinutes: 20,
        },
      };
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid, currentUser.email || '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        // Mock login
        let assignedRole: UserRole = 'premium';
        if (email.includes('admin')) assignedRole = 'admin';
        else if (email.includes('basico')) assignedRole = 'basic';
        else if (email.includes('novo') || email.includes('pendente')) assignedRole = 'none';

        const mockUid = `demo-${Date.now()}`;
        localStorage.setItem('demo_user_uid', mockUid);
        localStorage.setItem('demo_user_role', assignedRole);

        const p: UserProfile = {
          uid: mockUid,
          email,
          displayName: email.split('@')[0],
          role: assignedRole,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProfile(p);
        setLoading(false);
        return;
      }

      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await fetchProfile(cred.user.uid, cred.user.email || '');
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        const mockUid = `demo-${Date.now()}`;
        localStorage.setItem('demo_user_uid', mockUid);
        localStorage.setItem('demo_user_role', 'none'); // New registrations start without purchase

        const p: UserProfile = {
          uid: mockUid,
          email,
          displayName: name,
          role: 'none', // Aguarda liberação
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProfile(p);
        setLoading(false);
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const synced = await api.syncProfile({
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: name,
      });
      setProfile(synced.profile);
    } catch (err: any) {
      setError(err.message || 'Falha ao criar conta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('demo_user_uid');
    localStorage.removeItem('demo_user_role');
    setProfile(null);
    setUser(null);
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseConfigured) {
      return; // Simulated success
    }
    await sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid, user.email || '');
    }
  };

  const updatePreferences = async (preferences: UserProfile['preferences']) => {
    try {
      const res = await api.updatePreferences(preferences);
      setProfile(res.profile);
    } catch (err) {
      console.error('Erro ao atualizar preferências:', err);
    }
  };

  const switchDemoRole = (newRole: UserRole) => {
    localStorage.setItem('demo_user_role', newRole);
    if (profile) {
      setProfile({ ...profile, role: newRole });
    }
  };

  const role: UserRole = profile?.role || 'none';
  const isBasic = role === 'basic';
  const isPremium = role === 'premium' || role === 'admin';
  const isAdmin = role === 'admin';
  const hasPurchased = isBasic || isPremium;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isBasic,
        isPremium,
        isAdmin,
        hasPurchased,
        loading,
        error,
        login,
        register,
        logout,
        resetPassword,
        refreshProfile,
        updatePreferences,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
