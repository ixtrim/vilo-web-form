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

        <div class="upcoming-meetings__item upcoming-meetings__item--blue">
          <div class="upcoming-meetings__item__details">
            <h4>Vilo Task Planning</h4>
            <div class="upcoming-meetings__item__details__members">
              <img src="@/assets/temporary/meeting_members-1.png" alt="" />
            </div>
          </div>
          <div class="upcoming-meetings__item__date">
            <p>Today, 10:15 - 10:45</p>
          </div>
        </div>

        <div class="upcoming-meetings__item upcoming-meetings__item--green">
          <div class="upcoming-meetings__item__details">
            <h4>Consultation with Jane Kovalsky</h4>
            <div class="upcoming-meetings__item__details__members">
              <img src="@/assets/temporary/meeting_members-2.png" alt="" />
            </div>
          </div>
          <div class="upcoming-meetings__item__date">
            <p>Today, 10:15 - 10:45</p>
          </div>
        </div>
        
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