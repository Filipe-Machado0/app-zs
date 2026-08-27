import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/common/Layout';

// Public Pages
import { LandingPlans } from './pages/public/LandingPlans';
import { WaitingAccess } from './pages/public/WaitingAccess';
import { Terms } from './pages/public/Terms';
import { Privacy } from './pages/public/Privacy';
import { Refund } from './pages/public/Refund';
import { Contact } from './pages/public/Contact';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// App Pages
import { Home } from './pages/app/Home';
import { Onboarding } from './pages/app/Onboarding';
import { Recipes } from './pages/app/Recipes';
import { RecipeDetail } from './pages/app/RecipeDetail';
import { Planner } from './pages/app/Planner';
import { Shopping } from './pages/app/Shopping';
import { Materials } from './pages/app/Materials';
import { Support } from './pages/app/Support';
import { Profile } from './pages/app/Profile';

// Admin Page
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Route Guard for Protected App Area
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, hasPurchased, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center text-xs font-bold text-forest-800">
        Carregando...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // If user has role 'none' (not purchased / pending), redirect to waiting page
  if (role === 'none') {
    return <Navigate to="/aguardando-liberacao" replace />;
  }

  return <>{children}</>;
};

// Route Guard for Admin
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9EE] flex items-center justify-center text-xs font-bold text-forest-800">
        Carregando...
      </div>
    );
  }

  if (!profile || !isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/planos" element={<LandingPlans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/recuperar-senha" element={<ForgotPassword />} />
          <Route path="/aguardando-liberacao" element={<WaitingAccess />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/reembolso" element={<Refund />} />
          <Route path="/contato" element={<Contact />} />

          {/* Onboarding */}
          <Route
            path="/app/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Protected Member Area under Layout */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="receitas" element={<Recipes />} />
            <Route path="receitas/:id" element={<RecipeDetail />} />
            <Route path="planejar" element={<Planner />} />
            <Route path="compras" element={<Shopping />} />
            <Route path="materiais" element={<Materials />} />
            <Route path="ebook" element={<Materials />} />
            <Route path="ajuda" element={<Support />} />
            <Route path="perfil" element={<Profile />} />
          </Route>

          {/* Admin Area */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
