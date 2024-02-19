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
        </VLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import VLink from '@/components/v-link/VLink.vue';
import { useUserStore } from '@/stores/userStore';

const { user } = useUserStore();

const isClient = computed(() => {
  return [3, 4].includes(user.value?.role ?? 0);
});

const chatBadgeNumber = ref(20);
onMounted(async () => {
  try {
    //const response = await axios.get('/api/chat/notifications');
    //chatBadgeNumber.value = response.data.unreadMessages; 
  } catch (error) {
    //console.error('Failed to fetch chat notifications:', error);
  }
});

const links = computed(() => {
  if (isClient.value) {
    return [
      { name: 'Invoices', to: '/invoices', icon: 'left', iconStyle: 'invoices' },
    ];
  } else {
    return [
      { name: 'Home', to: '/dashboard', icon: 'left', iconStyle: 'home' },
      { name: 'Clients', to: '/clients-management', icon: 'left', iconStyle: 'clients' },
    ];
  }
});
</script>
