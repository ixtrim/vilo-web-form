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
          <v-badge v-if="link.name === 'Team'" variant="primary">{{ pendingUsersCount }}</v-badge>
        </v-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.js';
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

const pendingUsersCount = ref(0);

onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(doc => doc.data());
    pendingUsersCount.value = users.filter(user => user.status === 1).length; // Assuming status 1 is for 'Pending'
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});
</script>

<style>
  @import url(./styles/tabs-nav.scss);
</style>