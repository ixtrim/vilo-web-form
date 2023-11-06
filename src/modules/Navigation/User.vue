<template>
  <div class="user-account">

    <div class="user-account__avatar">
      <img src="https://picsum.photos/40" alt="User avatar" />
    </div>

    <div class="user-account__info">
      <span class="user-account__info__name">Olivia Rhye</span>
      <span class="user-account__info__email">olivia@untitledui.com</span>
    </div>

    <div class="user-account__arrow">
      <VLink 
        to="/settings" 
        isRouteLink 
        styled="secondary" 
        icon="left" 
        icon-style="logout" 
        :block="true"
        :class="{ active: classActive }"
      ></VLink>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import VLink from '@/components/v-link/VLink.vue';

  // Define a reactive property
  const classActive = ref(false);
</script>