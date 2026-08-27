import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseAdminApp: admin.app.App | null = null;
let firestoreDb: admin.firestore.Firestore | null = null;
let isFirebaseConnected = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined;

  if (projectId && clientEmail && privateKey) {
    firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    });
    firestoreDb = firebaseAdminApp.firestore();
    isFirebaseConnected = true;
    console.log('✅ Firebase Admin SDK conectado com sucesso.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    firebaseAdminApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    firestoreDb = firebaseAdminApp.firestore();
    isFirebaseConnected = true;
    console.log('✅ Firebase Admin SDK conectado via GOOGLE_APPLICATION_CREDENTIALS.');
  } else {
    console.log('ℹ️ Firebase Admin SDK operando em modo Local/Sandbox (credenciais não fornecidas em .env).');
  }
} catch (error) {
  console.warn('⚠️ Não foi possível inicializar o Firebase Admin SDK (modo fallback ativo):', error);
}

export { firebaseAdminApp, firestoreDb, isFirebaseConnected };
