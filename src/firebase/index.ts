'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Global cache for Firebase services to ensure a single instance (Singleton pattern)
interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

let firebaseServices: FirebaseServices | null = null;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): FirebaseServices {
  if (typeof window !== 'undefined' && firebaseServices) {
    // On the client, if already initialized, return the cached instance.
    return firebaseServices;
  }

  if (getApps().length === 0) {
    // If no apps are initialized, initialize a new one.
    // This runs once on the server, and once on the client.
    const app = initializeApp(firebaseConfig);
    firebaseServices = getSdks(app);
  } else {
    // If apps are already present (e.g., due to HMR), get the default app.
    const app = getApp();
    firebaseServices = getSdks(app);
  }
  
  return firebaseServices;
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';