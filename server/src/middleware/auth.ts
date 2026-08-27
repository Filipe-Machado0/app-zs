import { Request, Response, NextFunction } from 'express';
import { firebaseAdminApp, isFirebaseConnected } from '../config/firebase.js';
import { dbStore } from '../services/dbStore.js';
import { UserProfile, UserRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const devUserId = req.headers['x-user-id'] as string;
  const devUserEmail = req.headers['x-user-email'] as string;
  const devUserRole = req.headers['x-user-role'] as UserRole;

  // 1. Verificação via Firebase Admin SDK
  if (authHeader && authHeader.startsWith('Bearer ') && isFirebaseConnected && firebaseAdminApp) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decoded = await firebaseAdminApp.auth().verifyIdToken(token);
      let profile = await dbStore.getUser(decoded.uid);
      if (!profile) {
        profile = await dbStore.syncUser({
          uid: decoded.uid,
          email: decoded.email || 'usuario@exemplo.com',
          displayName: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'Responsável'),
        });
      }
      req.user = profile;
      return next();
    } catch (err) {
      console.warn('Falha na validação do token Firebase:', err);
    }
  }

  // 2. Fallback Seguro para Desenvolvimento / Testes Locais
  if (devUserId) {
    let profile = await dbStore.getUser(devUserId);
    if (!profile) {
      profile = await dbStore.syncUser({
        uid: devUserId,
        email: devUserEmail || `${devUserId}@exemplo.com`,
        displayName: devUserId === 'admin-demo-uid' ? 'Administrador' : 'Responsável',
        role: devUserRole || 'none',
      });
    }
    req.user = profile;
    return next();
  }

  res.status(401).json({
    error: 'Acesso não autorizado',
    message: 'Faça login para continuar. Sua sessão pode ter expirado.',
  });
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    if (req.user.role === 'admin') {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    res.status(403).json({
      error: 'Recurso bloqueado',
      message: 'Seu plano atual não possui acesso a este recurso.',
      currentRole: req.user.role,
      requiredRoles: allowedRoles,
    });
  };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Acesso restrito ao administrador',
      message: 'Você não tem privilégios para executar esta operação.',
    });
    return;
  }
  next();
}
