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
          block=true
        >
          <span>{{ link.name }}</span>
        </VLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
  import VLink from '@/components/v-link/VLink.vue';

  const links = [
    { name: 'Home', to: '/', icon: 'left', iconStyle: 'home' },
    { name: 'Boards', to: '/case-boards', icon: 'left', iconStyle: 'boards' },
    { name: 'Clients', to: '/clients-management', icon: 'left', iconStyle: 'clients' },
    { name: 'Library', to: '/library', icon: 'left', iconStyle: 'library' },
    { name: 'Invoices', to: '/invoices', icon: 'left', iconStyle: 'invoices' },
    { name: 'Calendar', to: '/calendar', icon: 'left', iconStyle: 'calendar' },
    { name: 'Chat', to: '/chat', icon: 'left', iconStyle: 'chat' },
  ];
</script>