<template>
  <div class="v-hours">

    <div v-if="hours.length === 0" class="v-hours__empty">
      <span>Unavailable</span>
      <button @click="addHour" class="v-hours__btn-add"></button>
    </div>

    <div v-for="(hour, index) in hours" :key="index" class="v-hours__row">
      <div class="v-hours__row__inputs">
        <div class="v-hours__row__inputs__select">
          <VDropdown :title="'00 am'" :items="dropdownHours" v-model="hour.from" @item-clicked="handleDropdownClick" />
        </div>

        <span>-</span>

        <div class="v-hours__row__inputs__select">
          <VDropdown :title="'00 am'" :items="dropdownHours" v-model="hour.to" @item-clicked="handleDropdownClick" />
        </div>
      </div>

      <div class="v-hours__row__action">
        <button @click="addHour" class="v-hours__btn-add"></button>
      </div>

      <div class="v-hours__row__action">
        <button @click="removeHour(index)" class="v-hours__btn-remove"></button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import VDropdown from '@/components/v-dropdown/VDropdown.vue';

interface HourRange {
  from: string;
  to: string;
}

export default {
  components: {
    VDropdown,
  },
  data() {
    return {
      dropdownHours: [
        { label: '00 am' },
        { label: '1 am' },
        { label: '2 am' },
        { label: '3 am' },
        { label: '4 am' },
        { label: '5 am' },
        { label: '6 am' },
        { label: '7 am' },
        { label: '8 am' },
        { label: '9 am' },
        { label: '10 am' },
        { label: '11 am' },
        { label: '1 pm' },
        { label: '2 pm' },
        { label: '3 pm' },
        { label: '4 pm' },
        { label: '5 pm' },
        { label: '6 pm' },
        { label: '7 pm' },
        { label: '8 pm' },
        { label: '9 pm' },
        { label: '10 pm' },
        { label: '11 pm' },
        { label: '12 pm' },
      ],
      hours: [] as HourRange[],
    };
  },
  methods: {
    addHour() {
      this.hours.push({ from: '', to: '' });
    },
    removeHour(index: number) {
      this.hours.splice(index, 1);
      if (this.hours.length === 0) {
        this.hours = [];
      }
    },
    handleDropdownClick(item: { label: string }) {
      console.log(item.label);
    }
  }
};
</script>

<style>
  @import url(./VHours.scss);
</style>
