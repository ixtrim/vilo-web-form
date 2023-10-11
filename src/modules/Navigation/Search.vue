<template>
  <div class="search-widget">
    <v-input 
      :label-enabled="false"
      placeholder="Search"
    />
  </div>
</template>

<script>
  import VInput from '@/components/v-input/VInput.vue';

  export default {
    components: {
      VInput,
    },
    methods: {
    },
  };
</script>

<style lang="scss">
  .search-widget {
    width: 100%;

    input {
      padding-left: 42px;
      background: url('../../assets/icons/icon-search.svg') no-repeat 15px center;
    }
  }
</style>