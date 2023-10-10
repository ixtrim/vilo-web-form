<template>
  <nav class="tabs-menu" aria-label="Settings Navigation">
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
    { name: 'Global Settings', to: '/settings', },
    { name: 'Team', to: '/settings-team', },
    { name: 'Notifications', to: '/settings-notifications', },
    { name: 'Invoice', to: '/settings-invoice', },
    { name: 'Calendar', to: '/settings-calendar', },
    { name: 'Billing', to: '/settings-billing', },
  ];
</script>