<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading">
          <h1>Calendar</h1>
          <p>Create and manage your meetings and events.</p>
        </div>
      </div>
      <div class="col-lg-2">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" @click="signIn" text="Sign In"></VButton>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <FullCalendar
          :plugins="calendarPlugins"
          :initialView="'dayGridMonth'"
          :headerToolbar="{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }"
          :events="calendarEvents"
        />
        <p>Your e-mail account need to be integrated with Google Calendar.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import VButton from '@/components/v-button/VButton.vue';

const CLIENT_ID = '25628282085-eam0js4alo06mr3vb10nifeo2nfd1pts.apps.googleusercontent.com';
const API_KEY = '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';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const isSignedIn = ref(false);

const calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
const calendarEvents = ref([]);

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(() => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, (error) => {
    console.error(JSON.stringify(error, null, 2));
  });
}

function updateSigninStatus(isSignedInStatus) {
  isSignedIn.value = isSignedInStatus;
}

function signIn() {
  gapi.auth2.getAuthInstance().signIn();
}

// Convert Google Calendar events to FullCalendar event format
function convertEvents(googleEvents) {
  return googleEvents.map(event => ({
    title: event.summary,
    start: event.start.dateTime || event.start.date, // Use dateTime for timed events and date for all-day events
    end: event.end.dateTime || event.end.date,
    url: event.htmlLink, // Link to the Google Calendar event
  }));
}

async function fetchGoogleCalendarEvents() {
  // This is a placeholder function. You need to replace it with actual API calls to fetch events.
  // Below is a mock response structure. Replace it with actual response handling from Google Calendar API.
  return [
    {
      summary: 'Event 1',
      start: { dateTime: '2024-03-10T10:00:00' },
      end: { dateTime: '2024-03-10T12:00:00' },
      htmlLink: 'https://www.google.com/calendar/event?eid=event_id'
    },
    // Add more events as needed
  ];
}


onMounted(async () => {
  // Initialize Google API and fetch events
  await initClient(); // Make sure this function is defined and correctly initializes the Google API
  const googleEvents = await fetchGoogleCalendarEvents(); // Fetch events from Google Calendar
  calendarEvents.value = convertEvents(googleEvents);
});

onMounted(() => {
  handleClientLoad();
});
</script>

<style>
@import url(./styles/dashboard.scss);
</style>
