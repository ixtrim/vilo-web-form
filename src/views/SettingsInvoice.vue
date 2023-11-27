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
          <h1>Invoice settings</h1>
          <p>Customise your invoice capabilities.</p>
        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__form">

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Customise Tax labels</h4>
              <p>Choose the Tax label which will be displayed in your client invoices.</p>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width-xs">
              <VInput label="Tax label" placeholder="Sales Tax" v-model="taxLabel" />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Client Reference Number Format</h4>
              <p>Drag & Drop the fields to configure the client reference number formatting.</p>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width-sm">
              <VTextInputDraggableGroup />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>File Reference Number Format</h4>
              <p>Drag & Drop the fields to configure the file reference number formatting.</p>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width-sm">
              <VTextInputDraggableGroup />
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
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { debounce } from 'lodash';
  import { defineComponent, ref, onMounted } from 'vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import TabsSettings from '@/modules/TabsSettings.vue';
  import VTextInputDraggableGroup from '@/components/v-text-input-draggable-group/VTextInputDraggableGroup.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';

  interface NotificationRef {
    showNotification: () => void;
  }

export default defineComponent({
  components: {
    VButton,
    VInput,
    VDropdown,
    VTextInputDraggableGroup,
    TabsSettings,
    VNotification,
  },
  data() {
    return {
      initialDataLoaded: false,
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      taxLabel: '',
      debouncedUpdateTaxLabel: null as ((...args: any[]) => Promise<void> | undefined) | null,
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
        const docRef = doc(db, "settings", "invoice");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.taxLabel = docSnap.data().tax_label;
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
    async userInitiatedUpdateTaxLabel() {
      try {
        const docRef = doc(db, "settings", "invoice");
        await updateDoc(docRef, {
          tax_label: this.taxLabel
        });
        this.triggerNotification('success', 'Changes saved', 'Tax label was changed successfully.');
      } catch (error) {
        console.error("Error updating document:", error);
        this.triggerNotification('error', 'Error!', 'Something went wrong.');
      }
    },
    handleButtonClick() {
      this.triggerNotification('error', 'Error!', 'Something went wrong.');
    },
  },
  mounted() {
    this.fetchViewData();
    this.debouncedUpdateTaxLabel = debounce(this.userInitiatedUpdateTaxLabel, 1000);
  },
  watch: {
    taxLabel(newVal, oldVal) {
      if (this.initialDataLoaded && newVal !== oldVal && this.debouncedUpdateTaxLabel) {
        this.debouncedUpdateTaxLabel()?.catch(e => console.error(e));
      }
    },
  }
});
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
