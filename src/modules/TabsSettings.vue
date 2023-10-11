<template>
  <nav class="tabs-menu" aria-label="Settings Navigation">
    <ul role="list">
      <li v-for="link in links" :key="link.name">
        <v-link 
          :to="link.to" 
          isRouteLink 
          styled="secondary" 
          block=true
        >
          <span>{{ link.name }}</span>
          <v-badge v-if="link.name === 'Team'" variant="primary">4</v-badge>
        </v-link>
      </li>
      <li>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';

const links = [
  { name: 'Global Settings', to: '/settings', },
  { name: 'Team', to: '/settings-team', },
  { name: 'Notifications', to: '/settings-notifications', },
  { name: 'Invoice', to: '/settings-invoice', },
  { name: 'Calendar', to: '/settings-calendar', },
  { name: 'Billing', to: '/settings-billing', },
];
</script>

<style>
  @import url(./styles/tabs-nav.scss);
</style>