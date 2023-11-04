<template>
  <span :class="['badge', variantClass]">
    <slot></slot>
  </span>
</template>

<script lang="ts">
export default {
  name: 'VBadge',
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
  @import url(./VBadge.scss);
</style>
