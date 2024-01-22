<template>
  <div class="search-widget">
    <v-input 
      label=""
      placeholder="Search"
      v-model="internalSearchTerm"
      @input="emitInput"
    />
  </div>
</template>

<script lang="ts">
  import VInput from '@/components/v-input/VInput.vue';

  export default {
    components: {
      VInput,
    },
    data() {
      return {
        internalSearchTerm: ''
      };
    },
    methods: {
      emitInput(event: Event) {
        const target = event.target as HTMLInputElement;
        this.internalSearchTerm = target.value;
        this.$emit('update-search', this.internalSearchTerm);
      }
    }
  };
</script>

<style>
  @import url(../styles/search.scss);
</style>