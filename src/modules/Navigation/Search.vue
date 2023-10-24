<template>
  <div class="search-widget">
    <v-input 
      label=""
      placeholder="Search"
      v-model="internalSearchTerm"
      @input="$emit('input', internalSearchTerm)"
    />
  </div>
</template>

<script>
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
