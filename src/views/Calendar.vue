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
      <div class="col-lg-12" v-if="isSignedIn">
        <p>Calendar integration successful. You can now manage your meetings and events.</p>
      </div>
      <div class="col-lg-12" v-else>
        <p>Your e-mail account needs to be integrated with Google Calendar.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VButton from '@/components/v-button/VButton.vue';

const CLIENT_ID = '25628282085-eam0js4alo06mr3vb10nifeo2nfd1pts.apps.googleusercontent.com';
const API_KEY = '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';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const isSignedIn = ref(false);

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

onMounted(() => {
  handleClientLoad();
});
</script>

<style>
@import url(./styles/dashboard.scss);
</style>
