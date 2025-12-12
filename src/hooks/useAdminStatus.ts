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
    // We want this effect to re-run whenever the user object itself changes.
    // This will trigger a re-check upon login/logout.
    
    // Set loading to true at the start of the check.
    setIsAdminLoading(true);

    // If the main user check is still loading, or if there's no user,
    // we can determine the admin status without a DB call.
    if (isUserLoading || !user) {
      setIsAdmin(false);
      setIsAdminLoading(false);
      return;
    }

    // Temporary hardcoded check for immediate access
    if (user.email === 'kalyanikri1111@gmail.com' || user.email === 'satyamkruk07@gmail.com' || user.email === 'frgtpeople@gmail.com') {
        setIsAdmin(true);
        setIsAdminLoading(false);
        return;
    }


    // If we have a user, check their admin status from Firestore.
    const checkAdminStatus = async () => {
      if (!firestore) {
          console.error("Firestore not available for admin check.");
          setIsAdmin(false);
          setIsAdminLoading(false);
          return;
      }
      // Use the UID from the (now guaranteed to exist) user object.
      const adminDocRef = doc(firestore, 'roles_admin', user.uid);
      try {
        const adminDocSnap = await getDoc(adminDocRef);
        // The user is an admin if the document exists.
        setIsAdmin(adminDocSnap.exists());
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        // The check is complete, so we're no longer loading.
        setIsAdminLoading(false);
      }
    };

    checkAdminStatus();
    
    // This effect depends on the user object. If it changes (e.g., from null to a user object on login),
    // the effect will re-run and re-check the admin status.
  }, [user, isUserLoading, firestore]);


  // The overall loading state is true if either the user is loading OR the admin check is loading.
  return { isAdmin, isAdminLoading: isUserLoading || isAdminLoading };
}
