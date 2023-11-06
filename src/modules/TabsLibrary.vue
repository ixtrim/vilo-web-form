<template>
  <nav class="tabs-menu" aria-label="Settings Navigation">
    <ul role="list">
      <li v-for="link in links" :key="link.name">
        <v-link 
          :to="link.to" 
          isRouteLink 
          styled="secondary" 
          :block="true"
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
  { name: 'Documents', to: '/library', },
  { name: 'Templates', to: '/library-templates', },
];
</script>

<style>
  @import url(./styles/tabs-nav.scss);
</style>