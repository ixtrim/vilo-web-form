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
              <p>Choose the Tax label which will displayed in your client invoices.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VInput 
                label="" 
                placeholder="Sales Tax" 
                v-model="text"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Client Reference Number Format</h4>
              <p>Drag & Drop the fields to configure the client reference number formatting.</p>
            </div>
            <div class="dashboard__form__section__input">
              
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>File Reference Number Format</h4>
              <p>Drag & Drop the fields to configure the file reference number formatting.</p>
            </div>
            <div class="dashboard__form__section__input">
              
            </div>
          </div>
          
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VInput from '@/components/v-input/VInput.vue';
import VButton from '@/components/v-button/VButton.vue';
import TabsSettings from '@/modules/TabsSettings.vue';

export default defineComponent({
  components: {
    VButton,
    VInput,
    VDropdown,
    TabsSettings,
  },
  data() {
    return {
      dropdownTimezone: [
        { label: 'GMT +1' },
        { label: 'GMT +2' },
        { label: 'GMT +3' },
      ],
      dropdownDateFormat: [
        { label: 'mm/dd/yyyy' },
        { label: 'mm.dd.yyyy' },
      ]
    };
  },
  methods: {
    handleButtonClick() {
      
    },
  },
});
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
