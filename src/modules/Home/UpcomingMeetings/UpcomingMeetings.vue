<template>
  <div class="upcoming-meetings">
    <div class="row">
      <div class="col-lg-8">
        <h3>Upcoming Meetings</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/calendar" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">

        
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VLink from '@/components/v-link/VLink.vue';


export default defineComponent({
  components: {
    VLink,
  },
});
</script>

<style>
  @import url(./UpcomingMeetings.scss);
</style>