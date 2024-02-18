// src/stores/userStore.ts
import { ref, readonly, onMounted } from 'vue';
import { db, auth } from '@/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import type { UserData } from '@/types';

const user = ref<UserData | null>(null);

async function fetchUser() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      user.value = {
        id: currentUser.uid,
        email: currentUser.email ?? '',
        ...userDoc.data(),
      };
    } else {
      user.value = {
        id: currentUser.uid,
        email: currentUser.email ?? '',
      };
    }
  } else {
    user.value = null;
  }
}

export function useUserStore() {
  return {
    user: readonly(user),
    fetchUser,
  };
}
