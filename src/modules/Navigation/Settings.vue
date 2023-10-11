<template>
  <div class="settings-button">
    <VLink 
      to="/settings" 
      isRouteLink 
      styled="secondary" 
      icon="left" 
      icon-style="settings" 
      block=true
      :class="{ active: classActive }"
    >
      <span>Settings</span>
    </VLink>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import VLink from '@/components/v-link/VLink.vue';

export default {
  components: {
    VLink
  },
  setup() {
    const route = useRoute();

    const classActive = computed(() => {
      const settingsPaths = [
        '/settings',
        '/settings-team',
        '/settings-notifications',
        '/settings-invoice',
        '/settings-calendar',
        '/settings-billing',
      ];
      return settingsPaths.includes(route.path);
    });

    return {
      classActive
    };
  }
};
</script>