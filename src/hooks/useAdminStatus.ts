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
    const checkAdmin = async () => {
      // If user is loading, not logged in, or is anonymous, they are not an admin.
      // This is the primary guard.
      if (isUserLoading || !user || user.isAnonymous) {
        setIsAdmin(false);
        setIsAdminLoading(false); // We have a definitive answer.
        return;
      }

      // If we reach here, we have a signed-in, non-anonymous user.
      // Start the loading state for the database check.
      setIsAdminLoading(true);

      // Temporary hardcoded check for immediate access
      if (user.email === 'kalyanikri1111@gmail.com' || user.email === 'satyamkruk07@gmail.com' || user.email === 'frgtpeople@gmail.com') {
          setIsAdmin(true);
          setIsAdminLoading(false);
          return;
      }

      // Check Firestore for admin role if firestore instance is available.
      if (firestore) {
        const adminDocRef = doc(firestore, 'roles_admin', user.uid);
        try {
          const adminDocSnap = await getDoc(adminDocRef);
          setIsAdmin(adminDocSnap.exists());
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false); // Assume not admin on error.
        } finally {
          setIsAdminLoading(false); // DB check is complete.
        }
      } else {
        // If firestore is not available for some reason, can't be admin.
        setIsAdmin(false);
        setIsAdminLoading(false);
      }
    };

    checkAdmin();

  }, [user, isUserLoading, firestore]);

  // The overall loading state combines user loading and the specific admin check loading.
  return { isAdmin, isAdminLoading: isUserLoading || isAdminLoading };
}
