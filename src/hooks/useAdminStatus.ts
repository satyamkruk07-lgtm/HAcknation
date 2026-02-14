'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * A hook to efficiently check if the current user has admin privileges.
 * This version uses a one-time `getDoc` call to check the 'roles_admin' collection.
 * @returns An object containing `isAdmin` (boolean) and `isAdminLoading` (boolean).
 */
export function useAdminStatus() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore(); // Get the firestore instance

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    // Secure default: not an admin.
    setIsAdmin(false);
    // Start loading. Will be set to false when check completes.
    setIsAdminLoading(true);

    if (isUserLoading || !firestore) {
      if (!isUserLoading) {
        setIsAdminLoading(false);
      }
      return; // Wait for user status or firestore to resolve.
    }

    // No user or anonymous user cannot be an admin.
    if (!user || user.isAnonymous) {
      setIsAdminLoading(false);
      return;
    }

    // Valid user, check the roles_admin collection in Firestore.
    const checkAdminStatus = async () => {
      try {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        const docSnap = await getDoc(adminRoleRef);
        
        if (docSnap.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        // On error, default to not being an admin for security.
        setIsAdmin(false);
      } finally {
        // The check is complete.
        setIsAdminLoading(false);
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore]);

  return { isAdmin, isAdminLoading };
}
