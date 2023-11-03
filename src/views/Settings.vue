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
              <p>Choose the name or your organisation which will be displayed throug the app.</p>
            </div>
            <div class="dashboard__form__section__input">
              <VInput 
                label="Application Name" 
                placeholder="Vilo" 
                v-model="text"
              />
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

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VInput from '@/components/v-input/VInput.vue';
import VButton from '@/components/v-button/VButton.vue';
import TabsSettings from '@/modules/TabsSettings.vue';
import VTextInputGroup from '@/components/v-text-input-group/VTextInputGroup.vue';

export default defineComponent({
  components: {
    VButton,
    VInput,
    VDropdown,
    TabsSettings,
    VTextInputGroup,
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
