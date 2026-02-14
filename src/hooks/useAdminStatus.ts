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

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    // Set a secure default: not an admin.
    setIsAdmin(false);
    // Set loading to true. It will be set to false once the check is complete.
    setIsAdminLoading(true);

    // If auth state is still loading, we can't determine admin status yet.
    if (isUserLoading) {
      return; // Wait for user status to be resolved.
    }

    // If there is no user object, or if the user is explicitly anonymous (like a judge),
    // they are definitely not an admin. We can stop here without any database checks.
    if (!user || user.isAnonymous) {
      setIsAdminLoading(false); // The check is complete, they are not an admin.
      return;
    }

    // If we reach here, we have a logged-in, non-anonymous user.
    // Check their email against the hardcoded list of admin emails.
    const hardcodedAdminEmails = ['kalyanikri1111@gmail.com', 'satyamkruk07@gmail.com', 'frgtpeople@gmail.com'];
    if (user.email && hardcodedAdminEmails.includes(user.email)) {
        setIsAdmin(true);
    }
    
    // The check is now complete for all cases.
    setIsAdminLoading(false);

  }, [user, isUserLoading]);

  // The overall loading state is true if either the user state is loading or the admin check is loading.
  return { isAdmin, isAdminLoading };
}
