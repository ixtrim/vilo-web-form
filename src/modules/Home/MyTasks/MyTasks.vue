<template>
  <div class="my-tasks">
    <div class="row">
      <div class="col-lg-8">
        <h3>My Tasks</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/case-boards" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 align-center">
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import VTimestamp from '@/components/v-timestamp/VTimestamp.vue';
import VButton from '@/components/v-button/VButton.vue';

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VButton,
    VTimestamp
  },
});
</script>

<style>
  @import url(./MyTasks.scss);
</style>