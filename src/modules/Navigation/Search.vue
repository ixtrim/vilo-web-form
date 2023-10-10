<template>
  <div class="search-widget">
    <v-input 
      :label-enabled="false"
      placeholder="Enter your email"
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