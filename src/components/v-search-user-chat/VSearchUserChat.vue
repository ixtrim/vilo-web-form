<template>
  <div class="search-widget">
    <v-input 
      label=""
      placeholder="New Message to @"
      v-model="internalSearchTerm"
      @input="$emit('input', internalSearchTerm)"
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
      emitInput() {
        this.$emit('input', this.internalSearchTerm);
      }
    }
  };
</script>

<style>
  @import url(./VSearchUserChat.scss);
</style>