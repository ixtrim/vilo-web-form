<template>
  <div class="user-account">

    <div class="user-account__avatar">
      <img :src="user.avatar" alt="User avatar" />
    </div>

    <div class="user-account__info">
      <span class="user-account__info__name">{{ user.full_name }}</span>
      <span class="user-account__info__email">{{ user.email }}</span>
    </div>

    <div class="user-account__arrow">
      <VLink 
        to="/sign-in" 
        isRouteLink 
        styled="secondary" 
        icon="left" 
        icon-style="logout" 
        :block="true"
        @click.prevent="handleLogout"
      ></VLink>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import VLink from '@/components/v-link/VLink.vue';
import { useRouter } from 'vue-router';

// Initialize Firestore
const db = getFirestore();
const auth = getAuth();
const router = useRouter();

const user = ref({
  full_name: 'Loading...',
  email: 'Loading...',
  avatar: 'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/vilo_app%2Favatar.png?alt=media&token=05cebcce-137e-42f2-bd6d-7d8b1ad76b67'
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/sign-in');
  } catch (error) {
    console.error("Logout Failed", error);
  }
};

onMounted(async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (currentUser) {
    user.value.email = currentUser.email || 'No email found';
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      user.value.full_name = userData.full_name || 'No name found';
      user.value.avatar = userData.avatar || 'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/vilo_app%2Favatar.png?alt=media&token=05cebcce-137e-42f2-bd6d-7d8b1ad76b67';
    }
  }
});
</script>
