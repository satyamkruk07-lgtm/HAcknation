'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * A hook to efficiently check if the current user has admin privileges.
 * This version uses a one-time `getDoc` call to avoid race conditions.
 * @returns An object containing `isAdmin` (boolean) and `isAdminLoading` (boolean).
 */
export function useAdminStatus() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    // Don't do anything until the main user loading is complete.
    if (isUserLoading) {
      return;
    }

    // If there is no user, they are definitely not an admin.
    if (!user) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return;
    }

    // --- TEMPORARY OVERRIDE ---
    // Hardcode kalyanikri1111@gmail.com as an admin.
    if (user.email === 'kalyanikri1111@gmail.com') {
        setIsAdmin(true);
        setIsAdminLoading(false);
        return;
    }
    
    // If we have a user, check their admin status.
    const checkAdminStatus = async () => {
      if (!firestore) {
          setIsAdmin(false);
          setIsAdminLoading(false);
          return;
      }
      const adminDocRef = doc(firestore, 'roles_admin', user.uid);
      try {
        const adminDocSnap = await getDoc(adminDocRef);
        // The user is an admin if the document exists.
        setIsAdmin(adminDocSnap.exists());
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    };

    checkAdminStatus();
    
  }, [user, isUserLoading, firestore]);


  return { isAdmin, isAdminLoading: isUserLoading || isAdminLoading };
}
