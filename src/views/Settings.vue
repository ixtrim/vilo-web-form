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
              <VDropdown :title="appTimezone" :items="dropdownTimezone" @item-clicked="changeTimezone" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Date format</h4>
              <p>Choose the timezone for your team.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VDropdown :title="appTimeFormat" :items="dropdownTimeFormat" @item-clicked="changeTimeFormat" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Services</h4>
              <p>Add types of services your company provides</p>
            </div>
            <div class="dashboard__form__section__input">
              <VTextInputGroup :inputs="appServices" @update-inputs="appServices = $event" @input-blur="handleServicesUpdate" />
            </div>
          </div>


        </div>
      </div>
    </div>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader"
      :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script>
import { db } from '@/firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { debounce } from 'lodash';
import { ref, onMounted, computed } from 'vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VInput from '@/components/v-input/VInput.vue';
import TabsSettings from '@/modules/TabsSettings.vue';
import VTextInputGroup from '@/components/v-text-input-group/VTextInputGroup.vue';
import VNotification from '@/components/v-notification/VNotification.vue';

export default {
  components: {
    VInput,
    VDropdown,
    TabsSettings,
    VTextInputGroup,
    VNotification,
  },
  setup() {
    const appName = ref('');
    const appTimezone = ref('');
    const appTimeFormat = ref('');
    const appServices = ref([]);
    const initialDataLoaded = ref(false);
    const notificationType = ref('success');
    const notificationHeader = ref('Changes saved');
    const notificationMessage = ref('This account has been successfully edited.');


    const dropdownTimezone = [
      { label: 'GMT -12', value: 'GMT-12' },
      // Rest of the timezone items
    ];

    const dropdownTimeFormat = [
      { label: 'mm/dd/yyyy', value: 'mm/dd/yyyy' },
      // Rest of the time format items
    ];

    const triggerNotification = async (type, header, message) => {
      if (initialDataLoaded.value) {
        notificationType.value = type;
        notificationHeader.value = header;
        notificationMessage.value = message;
        $refs.notificationRef.showNotification();
      }
    };

    const changeTimezone = async (item) => {
      appTimezone.value = item.value;
      if (debouncedUpdateTimezone.value) {
        try {
          await debouncedUpdateTimezone.value();
        } catch (e) {
          console.error(e);
        }
      }
    };

    const userInitiatedUpdateTimezone = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        await updateDoc(docRef, {
          app_timezone: appTimezone.value
        });
        triggerNotification('success', 'Changes saved', 'Timezone was changed successfully.');
      } catch (error) {
        console.error("Error updating document:", error);
        triggerNotification('error', 'Error!', 'Something went wrong.');
      }
    };

    

    const fetchViewData = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data())
          appName.value = docSnap.data().app_name;
          appTimezone.value = docSnap.data().app_timezone || 'Select Timezone';
          appTimeFormat.value = docSnap.data().app_timeformat || 'Select Date format';
          appServices.value = (docSnap.data().app_services).map(service => ({ value: service }));

          setTimeout(() => {
            initialDataLoaded.value = true;
            console.log(docSnap.data());
            console.log('timeout passed');
          }, 750);


        } else {
          console.log("No such document!");
          triggerNotification('error', 'Error!', 'Error while connecting with database.');
        }
      } catch (error) {
        console.log("Error getting document:", error);
        triggerNotification('error', 'Error!', 'Error while connecting with database.');
      }
    };

    const userInitiatedUpdateAppName = computed( async() => {
      try {
        const docRef = doc(db, "settings", "general");
        await updateDoc(docRef, {
          app_name: appName.value
        });
        triggerNotification('success', 'Changes saved', 'Application name was changed successfully.');
      } catch (error) {
        console.error("Error updating document:", error);
        triggerNotification('error', 'Error!', 'Something went wrong.');
      }
    });

    const userInitiatedUpdateTimeFormat = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        await updateDoc(docRef, {
          app_timeformat: appTimeFormat.value
        });
        triggerNotification('success', 'Changes saved', 'Date format was changed successfully.');
      } catch (error) {
        console.error("Error updating document:", error);
        triggerNotification('error', 'Error!', 'Something went wrong.');
      }
    };

    const userInitiatedUpdateAppServices = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        await updateDoc(docRef, {
          app_services: appServices.value.map(service => service.value)
        });
        triggerNotification('success', 'Changes saved', 'Services were updated successfully.');
      } catch (error) {
        console.error("Error updating document:", error);
        triggerNotification('error', 'Error!', 'Something went wrong.');
      }
    };

    const handleServicesUpdate = () => {
      if (initialDataLoaded.value && debouncedUpdateAppServices.value) {
        debouncedUpdateAppServices.value();
      }
    };

    onMounted(fetchViewData);

    // Define other methods similarly
    // const debouncedUpdateAppName = debounce(userInitiatedUpdateAppName, 1000);
    const debouncedUpdateTimezone = debounce(userInitiatedUpdateTimezone, 600);
    const debouncedUpdateTimeFormat = debounce(userInitiatedUpdateTimeFormat, 600);
    const debouncedUpdateAppServices = debounce(userInitiatedUpdateAppServices, 1200);

    return {
      appName,
      appTimezone,
      appTimeFormat,
      appServices,
      initialDataLoaded,
      notificationType,
      notificationHeader,
      notificationMessage,
      dropdownTimezone,
      dropdownTimeFormat,
      triggerNotification,
      changeTimezone,
      userInitiatedUpdateTimezone,
      debouncedUpdateTimezone,
      // userInitiatedUpdateAppName,
      // debouncedUpdateAppName,
      userInitiatedUpdateTimeFormat,
      debouncedUpdateTimeFormat,
      userInitiatedUpdateAppServices,
      debouncedUpdateAppServices,
      handleServicesUpdate,
    };
  }
};
</script>
<style>
@import url(./styles/settings.scss);
@import url(./styles/dashboard.scss);
</style>