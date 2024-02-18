// src/stores/userStore.ts
import { ref, readonly, onMounted } from 'vue';
import { db, auth } from '@/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import type { UserData } from '@/types';

const user = ref<UserData | null>(null);

async function fetchUser() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    // Fetch additional user data from Firestore
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      // Combine auth and Firestore data
      user.value = {
        id: currentUser.uid,
        email: currentUser.email,
        ...userDoc.data(), // Spread operator to include Firestore data
      };
    } else {
      // Handle the case where the Firestore document does not exist
      user.value = {
        id: currentUser.uid,
        email: currentUser.email,
      };
    }
  } else {
    // Handle the case where there is no current user
    user.value = null;
  }
}

export function useUserStore() {
  return {
    user: readonly(user),
    fetchUser,
  };
}
