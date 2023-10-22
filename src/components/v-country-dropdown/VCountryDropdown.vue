<template>
  <div class="dropdown country-dropdown">
    <button class="v-button v-button--outlined dropdown-toggle" type="button" id="countryDropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
      <div class="country-flag">
        <img v-if="selectedCountry" :src="`/src/assets/flags/${selectedCountry.code}.svg`" alt="`${selectedCountry.code}`" >
      </div>
      {{ selectedCountry ? selectedCountry.name : 'Select Country' }}
    </button>
    <ul class="dropdown-menu" aria-labelledby="countryDropdownMenuButton">
      <li v-for="country in countries" :key="country.code">
        <a class="dropdown-item" href="#" @click.prevent="countryClicked(country)">
          <div class="country-flag">
            <img :src="`/src/assets/flags/${country.code}.svg`" alt="{{ country.name }}" />
          </div> {{ country.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VCountryDropdown',
  data() {
    return {
      countries: [
        { name: 'United States', code: 'us' },
        { name: 'Canada', code: 'ca' },
        // ... add other countries here
      ],
      selectedCountry: { name: 'United States', code: 'us' }  // Default selected country
    }
  },
  methods: {
    countryClicked(country) {
      this.selectedCountry = country;
      this.$emit('country-selected', country);
    }
  }
}
</script>

<style>
  @import url(./VCountryDropdown.scss);
</style>