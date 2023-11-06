<template>
  <div class="container-fluid">
    
    <div class="row">
      <div class="col-lg-12">
        <TabsSettings />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__heading">
          <h1>Notification settings</h1>
          <p>We may still send you important notifications about your account outside of your notification settings.</p>
        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__form">

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Chats</h4>
              <p>These are notifications for chats with you.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VToggleSwitch v-model="toggleChatsPush" :trueLabel="'Push'" :falseLabel="'Push'" />
              <VToggleSwitch v-model="toggleChatsEmail" :trueLabel="'Email'" :falseLabel="'Email'" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Notification type</h4>
              <p>Choose the type of how you want to see your notifications.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VToggleSwitch v-model="toggleNotificationPopUp" :trueLabel="'Pop-up'" :falseLabel="'Pop-up'" />
              <VToggleSwitch v-model="toggleNotificationSound" :trueLabel="'Sound'" :falseLabel="'Sound'" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>How long to display notification</h4>
              <p>Choose the time range of how long you will be able to see notification.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VDropdown :title="'1 min'" :items="dropdownNotificationDuration" @item-clicked="handleDropdownClick" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Mute</h4>
              <p>Choose when you want to mute all the notifications.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VToggleSwitch v-model="toggleMuteMeetings" :trueLabel="'During meetings'" :falseLabel="'During meetings'" />
              <VToggleSwitch v-model="toggleMuteOutTime" :trueLabel="'Out of working hours'" :falseLabel="'Out of working hours'" />
            </div>
          </div>
          

        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VInput from '@/components/v-input/VInput.vue';
import VButton from '@/components/v-button/VButton.vue';
import TabsSettings from '@/modules/TabsSettings.vue';
import VToggleSwitch from '@/components/v-toggle-switch/VToggleSwitch.vue';

type DropdownItem = {
  label: string;
};

export default defineComponent({
  components: {
    VButton,
    VInput,
    VDropdown,
    TabsSettings,
    VToggleSwitch,
  },
  data() {
    return {
      dropdownNotificationDuration: [
        { label: '1min' },
        { label: '2min' },
        { label: '3min' },
        { label: '5min' },
      ],
      toggleChatsPush: true,
      toggleChatsEmail: false,
      toggleNotificationPopUp: false,
      toggleNotificationSound: false,
      toggleMuteMeetings: false,
      toggleMuteOutTime: false,
    };
  },
  methods: {
    handleDropdownClick(item: DropdownItem) {
      console.log('Dropdown item clicked:', item.label);
    },
  },
});
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
