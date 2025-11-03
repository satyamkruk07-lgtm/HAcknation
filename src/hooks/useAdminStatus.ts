'use client';

import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';

/**
 * A hook to efficiently check if the current user has admin privileges.
 * @returns An object containing `isAdmin` (boolean) and `isAdminLoading` (boolean).
 */
export function useAdminStatus() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Memoize the document reference to prevent re-renders.
  // This ref is only created if we have a user ID.
  const adminDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user?.uid]);

  // useDoc will listen to this single document.
  // data will be non-null if the document exists (i.e., user is an admin).
  // isLoading is true while the document is being fetched.
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  // The user is an admin if the admin document exists.
  const isAdmin = !!adminDoc;

  // The overall loading state depends on both the user auth check and the Firestore doc read.
  const isAdminLoading = isUserLoading || isAdminDocLoading;

  return { isAdmin, isAdminLoading };
}
