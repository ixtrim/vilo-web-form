// Import Vue composition API functions
import { ref, readonly } from 'vue';
// Use the already initialized `db` and `auth` from your firebase.js file
import { db, auth } from '@/firebase.js'; // Ensure the path is correct
import { doc, getDoc } from 'firebase/firestore';
import type { UserData } from '@/types'; // Adjust the path as necessary if you're using TypeScript for types

const user = ref<UserData | null>(null);

// Function to fetch user data from Firestore
async function fetchUser() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      user.value = userDoc.data();
    } else {
      // Handle the case where the user document does not exist
      user.value = null;
    }
  } else {
    // Handle the case where there is no current user
    user.value = null;
  }
}

// Export a function to use the user store
export function useUserStore() {
  return {
    user: readonly(user), // Provide the user data as a readonly ref
    fetchUser, // Allow components to trigger fetching user data
  };
}
