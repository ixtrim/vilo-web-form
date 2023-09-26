<!-- VLink.vue -->

<template>
  <router-link v-if="isRouteLink" :to="to" :class="linkClass">
    <slot></slot>
  </router-link>
  <a v-else :href="to" :target="openInNewTab ? '_blank' : '_self'" :class="linkClass">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    isRouteLink: {
      type: Boolean,
      default: false,
    },
    openInNewTab: {
      type: Boolean,
      default: false,
    },
    linkClass: {
      type: String,
      default: 'v-link',
    },
  },
};
</script>
<style>
@import url(./VLink.scss);
</style>
