'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

// Return type for useUser() - specific to user auth state
export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  mutate: () => Promise<void>; // Function to manually trigger a re-fetch of the user token
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * It also provides a `mutate` function to force-refresh the user's token.
 * @returns {UserHookResult} Object with user, isUserLoading, userError, and mutate.
 */
export const useUser = (): UserHookResult => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  const mutate = useCallback(async () => {
    try {
      // Force a refresh of the user's ID token.
      // This will also trigger the onIdTokenChanged listener if one were attached,
      // but more importantly, it refreshes the state on the currentUser object.
      await auth.currentUser?.getIdToken(true);
      // After the token is refreshed, we update our local state to match the (potentially updated) currentUser.
      setUser(auth.currentUser);
    } catch (error) {
      console.error("Error manually refreshing user token:", error);
      // We might want to set an error state here as well.
    }
  }, [auth]);

  useEffect(() => {
    // Set initial loading state.
    setIsUserLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsUserLoading(false);
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setUserError(error);
        setIsUserLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading, userError, mutate };
};
