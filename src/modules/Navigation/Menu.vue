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
          <VBadge v-if="link.badge && link.name === 'Chat'" :variant="'danger'">{{ link.badge }}</VBadge>
        </VLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';

const chatBadgeNumber = ref(20);
onMounted(async () => {
  try {
    //const response = await axios.get('/api/chat/notifications');
    //chatBadgeNumber.value = response.data.unreadMessages; 
  } catch (error) {
    //console.error('Failed to fetch chat notifications:', error);
  }
});

const links = [
  { name: 'Home', to: '/dashboard', icon: 'left', iconStyle: 'home' },
  { name: 'Cases', to: '/case-boards', icon: 'left', iconStyle: 'boards' },
  { name: 'Clients', to: '/clients-management', icon: 'left', iconStyle: 'clients' },
  { name: 'Library', to: '/library', icon: 'left', iconStyle: 'library' },
  { name: 'Invoices', to: '/invoices', icon: 'left', iconStyle: 'invoices' },
  { name: 'Calendar', to: '/calendar', icon: 'left', iconStyle: 'calendar' },
  { name: 'Chat', to: '/chat', icon: 'left', iconStyle: 'chat', badge: chatBadgeNumber },
];
</script>
