<template>
  <button
    :class="[
      'v-button',
      `v-button--${size}`,
      `v-button--${styled}`,
      { 'v-button--block': block },
      hoverClass,
      activeClass,
      focusClass,
      { [`v-button--icon-${icon}`]: icon !== 'no' }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <i v-if="icon === 'left'" :class="iconStyle"></i>
    <span v-if="loading" class="v-button-loader"></span>
    {{ text }}
    <i v-if="icon === 'right'" :class="iconStyle"></i>
  </button>
</template>

<script lang="ts">
  export default {
    props: {
      buttonClass: String,
      text: String,
      disabled: Boolean,
      type: {
        type: String as () => "button" | "reset" | "submit",
        default: "button",
      },
      block: Boolean,
      icon: {
        type: String,
        default: 'no',
        validator: (value: string): boolean => ['no', 'left', 'right'].includes(value),
      },
      iconStyle: String,
      loading: Boolean,
      hoverClass: String,
      activeClass: String,
      focusClass: String,
      size: {
        type: String,
        default: 'md',
        validator: (value: string): boolean => ['sm', 'md', 'lg', 'xl', 'xxl'].includes(value),
      },
      styled: {
        type: String,
        default: 'primary',
        validator: (value: string): boolean => ['primary', 'secondary', 'outlined', 'important', 'crucial'].includes(value),
      }
    },
    methods: {
      handleClick() {
        if (!this.disabled && !this.loading) {
          this.$emit('click')
        }
      }
    }
  }
</script>

<style>
  @import url(./VButton.scss);
</style>
