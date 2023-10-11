<template>
  <div class="container-fluid">
    
    <div class="row">
      <div class="col-lg-12">
        <TabsSettings />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-9">
        <div class="dashboard__heading">
          <h1>Team management</h1>
          <p>Manage your team members and their account permissions here.</p>
        </div>
      </div>
      <div class="col-lg-3">
        <ul class="settings__team-actions">
          <li>

          </li>
          <li>
            <v-button :block="true" size="md" icon="left" icon-style="plus" @click="handleButtonClick" text="Add user"></v-button>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import TabsSettings from '@/modules/TabsSettings.vue';
import VButton from '@/components/v-button/VButton.vue';
import VInput from '@/components/v-input/VInput.vue';
import VLink from '@/components/v-link/VLink.vue';

const handleButtonClick = () => {
  // Handle button click logic here
};
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
