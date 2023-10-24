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
          <h1>Calendar settings</h1>
          <p>Set up your working hours and sharing preferences</p>
        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__form">

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Working hours</h4>
              <p>Set up your availability during the week.</p>
            </div>
            <div class="dashboard__form__section__input dashboard__form__section__days">

              <div class="dashboard__form__section__days__item">
                <div class="dashboard__form__section__days__item__label">
                  <h5>Sun</h5>
                </div>
                <div class="dashboard__form__section__days__item__hours">
                  <VHours />
                </div>
              </div>

              <div class="dashboard__form__section__days__item">
                <div class="dashboard__form__section__days__item__label">
                  <h5>Mon</h5>
                </div>
                <div class="dashboard__form__section__days__item__hours">
                  <VHours />
                </div>
              </div>

              <div class="dashboard__form__section__days__item">
                <div class="dashboard__form__section__days__item__label">
                  <h5>Tue</h5>
                </div>
                <div class="dashboard__form__section__days__item__hours">
                  <VHours />
                </div>
              </div>

              <div class="dashboard__form__section__days__item">
                <div class="dashboard__form__section__days__item__label">
                  <h5>Wed</h5>
                </div>
                <div class="dashboard__form__section__days__item__hours">
                  <VHours />
                </div>
              </div>

              <div class="dashboard__form__section__days__item">
                <div class="dashboard__form__section__days__item__label">
                  <h5>Thu</h5>
                </div>
                <div class="dashboard__form__section__days__item__hours">
                  <VHours />
                </div>
              </div>

              <div class="dashboard__form__section__days__item">
                <div class="dashboard__form__section__days__item__label">
                  <h5>Fri</h5>
                </div>
                <div class="dashboard__form__section__days__item__hours">
                  <VHours />
                </div>
              </div>

              <div class="dashboard__form__section__days__item">
                <div class="dashboard__form__section__days__item__label">
                  <h5>Sat</h5>
                </div>
                <div class="dashboard__form__section__days__item__hours">
                  <VHours />
                </div>
              </div>
              
            </div>
          </div>

          <div class="dashboard__form__section">
            <div class="dashboard__form__section__label">
              <h4>Share my calendar</h4>
              <p>These are notifications for chats with you.</p>
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
import VHours from '@/components/v-hours/VHours.vue';

export default defineComponent({
  components: {
    VButton,
    VInput,
    VDropdown,
    VHours,
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
