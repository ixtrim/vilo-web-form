<template>
  <nav class="main-menu" aria-label="Main Navigation">
    <ul role="list">
      <li v-for="link in links" :key="link.name">
        <VLink 
          :to="link.to" 
          isRouteLink 
          styled="secondary" 
          :icon="link.icon" 
          :icon-style="link.iconStyle" 
          :block="true"
        >
          <span>{{ link.name }}</span>
          <VBadge v-if="link.badge && link.name === 'Chat' && link.badge.value !== 0" :variant="'danger'">{{ link.badge.value }}</VBadge>
        </VLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.js';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import { useUserStore } from '@/stores/userStore';

const { user } = useUserStore();

const isClient = computed(() => {
  return [3, 4].includes(user.value?.role ?? 0);
});

const isGeneral = computed(() => {
  return [1].includes(user.value?.role ?? 0);
});

const chatBadgeNumber = ref<number>(0);

// Explicitly type unsubscribe as a function or null
let unsubscribe: (() => void) | null = null;

// Type the parameter currentUserId as string
const fetchUnreadChatCount = (currentUserId: string) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where(`viewed_status.${currentUserId}`, "==", false));

  unsubscribe = onSnapshot(q, (querySnapshot) => {
    chatBadgeNumber.value = querySnapshot.docs.length;
  }, (error) => {
    console.error('Failed to fetch unread chat count:', error);
  });
};

onMounted(() => {
  if (user.value?.id) {
    fetchUnreadChatCount(user.value.id);
  }
});

// Clean up the listener when the component unmounts
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// Reactively fetch unread chat count if the user changes
watch(() => user.value?.id, (newId, oldId) => {
  if (unsubscribe && oldId) {
    unsubscribe();
  }
  if (newId) {
    fetchUnreadChatCount(newId);
  }
});

const links = computed(() => {
  // Links for clients
  if (isClient.value) {
    return [
      { name: 'Invoices', to: '/invoices', icon: 'left', iconStyle: 'invoices' },
      // Add any other links specific to clients
    ];
  }
  // Links for general users
  else if (isGeneral.value) {
    return [
      { name: 'Home', to: '/dashboard', icon: 'left', iconStyle: 'home' },
      { name: 'Cases', to: '/case-boards', icon: 'left', iconStyle: 'boards' },
      { name: 'Clients', to: '/clients-management', icon: 'left', iconStyle: 'clients' },
      { name: 'Library', to: '/library', icon: 'left', iconStyle: 'library' },
      { name: 'Calendar', to: '/calendar', icon: 'left', iconStyle: 'calendar' },
      { name: 'Chat', to: '/chat', icon: 'left', iconStyle: 'chat', badge: chatBadgeNumber },
    ];
  }
  // Links for other roles (e.g., Admins)
  else {
    return [
      { name: 'Home', to: '/dashboard', icon: 'left', iconStyle: 'home' },
      { name: 'Cases', to: '/case-boards', icon: 'left', iconStyle: 'boards' },
      { name: 'Clients', to: '/clients-management', icon: 'left', iconStyle: 'clients' },
      { name: 'Library', to: '/library', icon: 'left', iconStyle: 'library' },
      { name: 'Invoices', to: '/invoices', icon: 'left', iconStyle: 'invoices' },
      { name: 'Calendar', to: '/calendar', icon: 'left', iconStyle: 'calendar' },
      { name: 'Chat', to: '/chat', icon: 'left', iconStyle: 'chat', badge: chatBadgeNumber },
      // Add any other links that should be available to all other roles
    ];
  }
});


</script>