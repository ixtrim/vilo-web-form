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
          <h1>Global settings</h1>
          <p>Your organisation configuration settings.</p>
        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__form">

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Application name</h4>
              <p>Choose the name or your organization which will be displayed through the app.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VInput label="Application Name" placeholder="Vilo" v-model="appName" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Timezone</h4>
              <p>Choose the timezone for your team.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VDropdown :title="'GMT +1'" :items="dropdownTimezone" @item-clicked="handleDropdownClick" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Date format</h4>
              <p>Choose the timezone for your team.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VDropdown :title="'dd/mm/yyyy'" :items="dropdownDateFormat" @item-clicked="handleDropdownClick" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Services</h4>
              <p>Add types of services your company provides</p>
            </div>
            <div class="dashboard__form__section__input">
              <VTextInputGroup />
            </div>
          </div>


        </div>
      </div>
    </div>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader"
      :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
  import { db } from '@/firebase.js';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { debounce } from 'lodash';
  import { defineComponent, ref, onMounted } from 'vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import TabsSettings from '@/modules/TabsSettings.vue';
  import VTextInputGroup from '@/components/v-text-input-group/VTextInputGroup.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';

  interface DropdownItem {
    label: string;
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
    VTextInputGroup,
    VNotification,
  },
  data() {
    return {
      appName: '',
      appTimezone: '',
      appTimeformat: '',
      appServices: '',
      debouncedUpdateAppName: null as ((...args: any[]) => Promise<void> | undefined) | null,
      initialDataLoaded: false,
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      dropdownTimezone: [
        { label: 'GMT -12', value: 'GMT-12' },
        { label: 'GMT -11', value: 'GMT-11' },
        { label: 'GMT -10', value: 'GMT-10' },
        { label: 'GMT -9', value: 'GMT-9' },
        { label: 'GMT -8', value: 'GMT-8' },
        { label: 'GMT -7', value: 'GMT-7' },
        { label: 'GMT -6', value: 'GMT-6' },
        { label: 'GMT -5', value: 'GMT-5' },
        { label: 'GMT -4', value: 'GMT-4' },
        { label: 'GMT -3', value: 'GMT-3' },
        { label: 'GMT -2', value: 'GMT-2' },
        { label: 'GMT -1', value: 'GMT-1' },
        { label: 'GMT', value: 'GMT' },
        { label: 'GMT +1', value: 'GMT+1' },
        { label: 'GMT +2', value: 'GMT+2' },
        { label: 'GMT +3', value: 'GMT+3' },
        { label: 'GMT +4', value: 'GMT+4' },
        { label: 'GMT +5', value: 'GMT+5' },
        { label: 'GMT +5:30', value: 'GMT+5:30' },
        { label: 'GMT +5:45', value: 'GMT+5:45' },
        { label: 'GMT +6', value: 'GMT+6' },
        { label: 'GMT +6:30', value: 'GMT+6:30' },
        { label: 'GMT +7', value: 'GMT+7' },
        { label: 'GMT +8', value: 'GMT+8' },
        { label: 'GMT +9', value: 'GMT+9' },
        { label: 'GMT +9:30', value: 'GMT+9:30' },
        { label: 'GMT +10', value: 'GMT+10' },
        { label: 'GMT +10:30', value: 'GMT+10:30' },
        { label: 'GMT +11', value: 'GMT+11' },
        { label: 'GMT +12', value: 'GMT+12' },
        { label: 'GMT +12:45', value: 'GMT+12:45' },
        { label: 'GMT +13', value: 'GMT+13' },
        { label: 'GMT +14', value: 'GMT+14' }
      ],
      dropdownDateFormat: [
        { label: 'mm/dd/yyyy', value: 'MM/DD/YYYY' },
        { label: 'mm.dd.yyyy', value: 'MM.DD.YYYY' },
        { label: 'dd/mm/yyyy', value: 'DD/MM/YYYY' },
        { label: 'dd.mm.yyyy', value: 'DD.MM.YYYY' },
        { label: 'yyyy/mm/dd', value: 'YYYY/MM/DD' },
        { label: 'yyyy.mm.dd', value: 'YYYY.MM.DD' },
        { label: 'yyyy-mm-dd', value: 'YYYY-MM-DD' },
        { label: 'dd-mm-yyyy', value: 'DD-MM-YYYY' },
        { label: 'mm-dd-yyyy', value: 'MM-DD-YYYY' },
        { label: 'dd-MMM-yyyy', value: 'DD-MMM-YYYY' },
        { label: 'MMM dd, yyyy', value: 'MMM DD, YYYY' },
        { label: 'yyyy, MMM dd', value: 'YYYY, MMM DD' },
        { label: 'dd MMMM yyyy', value: 'DD MMMM YYYY' },
        { label: 'MMMM dd, yyyy', value: 'MMMM DD, YYYY' },
        { label: 'yyyy, MMMM dd', value: 'YYYY, MMMM DD' }
      ]
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
    handleButtonClick() {
      // Button click handler
    },
    handleDropdownClick(item: DropdownItem) {
      console.log(item);
    },
    async fetchSettings() {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.appName = docSnap.data().app_name;
        } else {
          console.log("No such document!");
          this.triggerNotification('error', 'Error!', 'Error while connecting with database.');
        }
      } catch (error) {
        console.log("Error getting document:", error);
        this.triggerNotification('error', 'Error!', 'Error while connecting with database.');
      } finally {
        setTimeout(() => {
          this.initialDataLoaded = true;
        }, 750);
      }
    },
    async userInitiatedUpdateAppName() {
      try {
        const docRef = doc(db, "settings", "general");
        await updateDoc(docRef, {
          app_name: this.appName
        });
        this.triggerNotification('success', 'Changes saved', 'Application name was changed successfully.');
      } catch (error) {
        console.error("Error updating document:", error);
        this.triggerNotification('error', 'Error!', 'Something went wrong.');
      }
    }
  },
  mounted() {
    this.fetchSettings();
    this.debouncedUpdateAppName = debounce(this.userInitiatedUpdateAppName, 1000);
  },
  watch: {
    appName(newVal, oldVal) {
      if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateAppName) {
        this.debouncedUpdateAppName()?.catch(e => console.error(e));
      }
    }
  }
});
</script>

<style>
@import url(./styles/settings.scss);
@import url(./styles/dashboard.scss);
</style>
