<template>
  <span :class="['timestamp', variantClass]">
    <slot></slot>
  </span>
</template>

<script lang="ts">
export default {
  name: 'VTimestamp',
  props: {
    variant: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    variantClass() {
      return `bg-${this.variant}`;
    }
  }
}
</script>

<style>
  @import url(./VTimestamp.scss);
</style>
