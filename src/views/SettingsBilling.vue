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
          <h1>Billing</h1>
          <p>Update your billing details and address.</p>
        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__form">

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Account Details</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="Account number" 
                placeholder="12-1234-123456-12" 
                v-model="text"
              />
              <VInput 
                label="Bank Name" 
                placeholder="ABC Bank limited" 
                v-model="text"
              />
              <VInput 
                label="SWIFT/IBAN" 
                placeholder="NZ0201230012" 
                v-model="text"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label dashboard__form__section__input--width">
              <h4>Email address</h4>
              <p>Invoices will be sent to this email address.</p>
            </div>
            <div class="dashboard__form__section__input">
              
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Account Details</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="" 
                placeholder="100 Smith Street" 
                v-model="text"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>City</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              <VInput 
                label="" 
                placeholder="Collingwood" 
                v-model="text"
              />
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>State / Province</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Country</h4>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__input--width">
              
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
      dropdownItems: [
        { label: 'Internal user' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
        { label: 'Admin' },
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
