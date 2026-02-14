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
      // If user is loading or not logged in, they can't be an admin.
      if (isUserLoading || !user) {
        setIsAdmin(false);
        setIsAdminLoading(false);
        return;
      }

      // We have a user. Now check if their email matches the hardcoded list.
      // This is the primary and fastest check.
      const hardcodedAdminEmails = ['kalyanikri1111@gmail.com', 'satyamkruk07@gmail.com', 'frgtpeople@gmail.com'];
      if (user.email && hardcodedAdminEmails.includes(user.email)) {
          setIsAdmin(true);
          setIsAdminLoading(false);
          return; // Found admin, no need to check Firestore.
      }
      
      // If the user is anonymous, they are definitely not an admin.
      // Also, if their email wasn't in the list, we stop here.
      // This prevents the Firestore read for all non-admin users.
      setIsAdmin(false);
      setIsAdminLoading(false);

    };

    checkAdmin();

  }, [user, isUserLoading, firestore]);

  // The overall loading state combines user loading and the specific admin check loading.
  return { isAdmin, isAdminLoading: isUserLoading || isAdminLoading };
}
