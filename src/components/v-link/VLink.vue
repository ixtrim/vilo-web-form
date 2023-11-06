<template>
  <router-link v-if="isRouteLink" :to="to" :class="[linkClass, `v-link--${styled}`, { [`v-link--icon-${icon}`]: icon !== 'no' }, { 'v-link--block': block }]">
    <i v-if="icon === 'left'" :class="iconStyle"></i>
    <slot></slot>
    <i v-if="icon === 'right'" :class="iconStyle"></i>
  </router-link>
  <a v-else :href="to" :target="openInNewTab ? '_blank' : '_self'" :class="[linkClass, `v-link--${styled}`, { [`v-link--icon-${icon}`]: icon !== 'no' }, { 'v-link--block': block }]">
    <i v-if="icon === 'left'" :class="iconStyle"></i>
    <slot></slot>
    <i v-if="icon === 'right'" :class="iconStyle"></i>
  </a>
</template>

<script lang="ts">
  export default {
    props: {
      block: Boolean,
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
      styled: {
        type: String,
        default: 'primary',
        validator: (value: unknown): boolean => ['primary', 'secondary', 'important', 'crucial'].includes(value as string)
      },
      icon: {
        type: String,
        default: 'no',
        validator: (value: unknown): boolean => ['no', 'left', 'right'].includes(value as string)
      },
      iconStyle: {
        type: String,
        default: '',
        validator: (value: unknown): boolean => ['arrow-left', 'arrow-right', 'save', 'preview', 'edit', 'delete', 'add', 'copy', 'upload', 'share'].includes(value as string)
      }
    },
  };
</script>

<style>
  @import url(./VLink.scss);
</style>
