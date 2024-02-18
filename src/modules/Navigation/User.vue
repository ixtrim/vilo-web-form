<template>
  <div class="user-account">

    <div class="user-account__avatar">
      <img :src="userInfo.avatar" alt="User avatar" />
    </div>

    <div class="user-account__info">
      <span class="user-account__info__name">{{ userInfo.full_name }}</span>
      <span class="user-account__info__email">{{ userInfo.email }}</span>
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
import { computed, ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useUserStore } from '@/stores/userStore';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import VLink from '@/components/v-link/VLink.vue';
import { useRouter } from 'vue-router';

const auth = getAuth();
const { user, fetchUser } = useUserStore();
const router = useRouter();

const userInfo = computed(() => {
  return {
    full_name: user.value?.full_name ?? 'No name found',
    email: user.value?.email ?? 'No email found',
    avatar: user.value?.avatar ?? 'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/vilo_app%2Favatar.png?alt=media&token=05cebcce-137e-42f2-bd6d-7d8b1ad76b67'
  };
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/sign-in');
  } catch (error) {
    console.error("Logout Failed", error);
  }
};
</script>
