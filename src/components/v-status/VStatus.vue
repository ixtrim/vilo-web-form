<template>
  <span :class="['status', variantClass]">
    <slot></slot>
  </span>
</template>

<script lang="ts">
export default {
  name: 'VStatus',
  props: {
    variant: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    variantClass() {
      return `status--${this.variant}`;
    }
  }
}
</script>

<style>
  @import url(./VStatus.scss);
</style>
