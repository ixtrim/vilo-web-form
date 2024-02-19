// src/stores/userStore.ts
import { ref, readonly } from 'vue';
import { db, auth } from '@/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { UserData } from '@/types';

const user = ref<UserData | null>(null);

// Listen for auth state changes
onAuthStateChanged(auth, async (currentUser) => {
  if (currentUser) {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      user.value = {
        id: currentUser.uid,
        email: currentUser.email ?? '',
        role: userDoc.data().role,
        ...userDoc.data(),
      };
    } else {
      user.value = {
        id: currentUser.uid,
        email: currentUser.email ?? '',
        role: undefined,
      };
    }
  } else {
    user.value = null;
  }
});

// New method to fetch the user role if needed
async function fetchUserRoleIfNeeded() {
  // Check if the user is already loaded and has a role
  if (user.value && user.value.role !== undefined) return;

  const currentUser = auth.currentUser;
  if (currentUser) {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().role !== undefined) {
      // Update the user ref with the role if it's not already set
      user.value = { ...user.value, role: userDoc.data().role };
    }
  }
}

export function useUserStore() {
  return {
    user: readonly(user),
    fetchUserRoleIfNeeded, // Expose the new method
  };
}
