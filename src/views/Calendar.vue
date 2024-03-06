<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__heading">
          <h1>Calendar</h1>
          <p>Create and manage your meetings and events.</p>
        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12" v-if="!isSignedIn">
        <FullCalendar :options="calendarOptions" />
      </div>
      <div class="empty-list" style="display: none;">
        <div class="empty-list__wrapper">
          <v-iconbox class="v-google" />
          <h4>Sign In into your Google Calendar</h4>
          <VButton
            v-if="!isSignedIn"
            :block="true"
            size="md"
            icon="left"
            icon-style="add-white"
            @click="signIn"
            text="Sign In Now"
          ></VButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import VButton from '@/components/v-button/VButton.vue';
import VIconbox from '@/components/v-iconbox/VIconbox.vue';

// Your Google Calendar API key
const API_KEY = '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';
// The ID of the Google Calendar you want to display events from
const googleCalendarId = 'cd748c89bfce6d2ca5a6d3f7e6aae99d5fb4eb9aac144fc1b71f5651aa21f268@group.calendar.google.com';

const calendarOptions = ref({
  plugins: [dayGridPlugin, googleCalendarPlugin],
  initialView: 'dayGridMonth',
  googleCalendarApiKey: API_KEY,
  events: {
    googleCalendarId: googleCalendarId,
    googleCalendarApiKey: API_KEY
  }
});

const calendarPlugins = ref([dayGridPlugin, googleCalendarPlugin]);

</script>

<style>
@import url(./styles/dashboard.scss);
@import url(./styles/calendar.scss);
</style>
