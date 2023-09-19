<template>
  <button
    :class="[
      'v-button',
      buttonClass,
      { 'v-button--block': block },
      { 'v-button--rounded': rounded },
      { 'v-button--outlined': outlined },
      hoverClass,
      activeClass,
      focusClass
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <i v-if="icon" :class="icon"></i>
    <span v-if="loading" class="v-button-loader"></span>
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    buttonClass: String,
    text: String,
    disabled: Boolean,
    type: String,
    block: Boolean,
    icon: String,
    loading: Boolean,
    rounded: Boolean,
    outlined: Boolean,
    hoverClass: String,
    activeClass: String,
    focusClass: String
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
