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
              <VDropdown :title="'1 min'" :items="dropdownDisplayTime" @item-clicked="handleDropdownClick" />
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

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
  import { db } from '@/firebase.js';
  import { debounce } from 'lodash';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { defineComponent, ref, onMounted, watch } from 'vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import TabsSettings from '@/modules/TabsSettings.vue';
  import VToggleSwitch from '@/components/v-toggle-switch/VToggleSwitch.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';

  interface DropdownItem {
    label: string;
    value: string;
  }

  interface NotificationRef {
    showNotification: () => void;
  }

  export default defineComponent({
    components: {
      VButton,
      VInput,
      VDropdown,
      TabsSettings,
      VToggleSwitch,
      VNotification,
    },
    data() {
      return {
        notificationType: 'success',
        notificationHeader: 'Changes saved',
        notificationMessage: 'This account has been successfully edited.',
        initialDataLoaded: false,
        dropdownDisplayTime: [
          { label: '5 seconds',  value: '5000' },
          { label: '6 seconds',  value: '6000' },
          { label: '7 seconds',  value: '7000' },
          { label: '8 seconds',  value: '8000' },
          { label: '9 seconds',  value: '9000' },
          { label: '10 seconds',  value: '10000' },
          { label: '20 seconds', value: '20000'  },
          { label: '30 seconds', value: '30000'  },
          { label: '45 seconds', value: '45000'  },
          { label: '60 seconds', value: '60000'  },
        ],
        toggleChatsPush: false,
        toggleChatsEmail: false,
        toggleNotificationPopUp: false,
        toggleNotificationSound: false,
        notificationDisplayTime: '',
        toggleMuteMeetings: false,
        toggleMuteOutTime: false,
        debouncedUpdateChatsPush: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateChatsEmail: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateNotificationPopUp: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateNotificationSound: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateMuteMeetings: null as ((...args: any[]) => Promise<void> | undefined) | null,
        debouncedUpdateMuteOutTime: null as ((...args: any[]) => Promise<void> | undefined) | null,
      };
    },
    methods: {
      triggerNotification(type: string, header: string, message: string) {
        if (this.initialDataLoaded) {
          this.notificationType = type;
          this.notificationHeader = header;
          this.notificationMessage = message;
          (this.$refs.notificationRef as NotificationRef).showNotification();
        }
      },
      async fetchViewData() {
        try {
          const docRef = doc(db, "settings", "notifications");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            this.toggleChatsPush         = docSnap.data().chats_push;
            this.toggleChatsEmail        = docSnap.data().chats_email;
            this.toggleNotificationPopUp = docSnap.data().type_popup;
            this.toggleNotificationSound = docSnap.data().type_sound;
            this.notificationDisplayTime = docSnap.data().display_time;
            this.toggleMuteMeetings      = docSnap.data().mute_meeting;
            this.toggleMuteOutTime       = docSnap.data().mute_out;
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        } finally {
          setTimeout(() => {
            this.initialDataLoaded = true;
          }, 750);
        }
      },
      async updateChatsPushInFirestore() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            chats_push: this.toggleChatsPush
          });
        } catch (error) {
          console.error("Error updating document:", error);
        }
      },
      async userInitiatedUpdateChatsPush() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            chats_push: this.toggleChatsPush
          });
          this.triggerNotification('success', 'Changes saved', 'Chat push settings updated successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async updateChatsEmailInFirestore() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            chats_email: this.toggleChatsEmail
          });
        } catch (error) {
          console.error("Error updating document:", error);
        }
      },
      async userInitiatedUpdateChatsEmail() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            chats_email: this.toggleChatsEmail
          });
          this.triggerNotification('success', 'Changes saved', 'Chat e-mail settings updated successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async updateNotificationPopUpInFirestore() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            type_popup: this.toggleNotificationPopUp
          });
        } catch (error) {
          console.error("Error updating document:", error);
        }
      },
      async userInitiatedUpdateNotificationPopUp() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            type_popup: this.toggleNotificationPopUp
          });
          this.triggerNotification('success', 'Changes saved', 'Settings for notifications in pop-up updated successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      async updateNotificationSoundInFirestore() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            type_sound: this.toggleNotificationSound
          });
        } catch (error) {
          console.error("Error updating document:", error);
        }
      },
      async userInitiatedUpdateNotificationSound() {
        try {
          const docRef = doc(db, "settings", "notifications");
          await updateDoc(docRef, {
            type_sound: this.toggleNotificationSound
          });
          this.triggerNotification('success', 'Changes saved', 'Settings for notifications sound updated successfully.');
        } catch (error) {
          console.error("Error updating document:", error);
          this.triggerNotification('error', 'Error!', 'Something went wrong.');
        }
      },
      handleDropdownClick(item: DropdownItem) {
      },
    },
    watch: {
      toggleChatsPush(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateChatsPush) {
          this.debouncedUpdateChatsPush()?.catch(e => console.error(e));
        }
      },
      toggleChatsEmail(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateChatsEmail) {
          this.debouncedUpdateChatsEmail()?.catch(e => console.error(e));
        }
      },
      toggleNotificationPopUp(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateNotificationPopUp) {
          this.debouncedUpdateNotificationPopUp()?.catch(e => console.error(e));
        }
      },
      toggleNotificationSound(newVal, oldVal) {
        if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateNotificationSound) {
          this.debouncedUpdateNotificationSound()?.catch(e => console.error(e));
        }
      },
    },
    mounted() {
      this.fetchViewData();
      this.debouncedUpdateChatsPush = debounce(this.userInitiatedUpdateChatsPush, 600);
      this.debouncedUpdateChatsEmail = debounce(this.userInitiatedUpdateChatsEmail, 600);
      this.debouncedUpdateNotificationPopUp = debounce(this.userInitiatedUpdateNotificationPopUp, 600);
      this.debouncedUpdateNotificationSound = debounce(this.userInitiatedUpdateNotificationSound, 600);
    }
  });
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
