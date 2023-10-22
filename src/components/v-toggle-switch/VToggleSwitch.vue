<template>
  <div class="toggle-container" @click="toggleValue">
    <div class="toggle-background" :class="{ 'is-true': value }">
      <div class="toggle-circle" :class="{ 'is-true': value }"></div>
    </div>
    <span class="toggle-label">{{ value ? trueLabel : falseLabel }}</span>
  </div>
</template>

<script>
export default {
  name: 'VToggleSwitch',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    trueLabel: {
      type: String,
      default: 'True'
    },
    falseLabel: {
      type: String,
      default: 'False'
    }
  },
  data() {
    return {
      value: this.modelValue
    };
  },
  watch: {
    modelValue(newVal) {
      this.value = newVal;
    }
  },
  methods: {
    toggleValue() {
      this.value = !this.value;
      this.$emit('update:modelValue', this.value);
    }
  }
}
</script>

<style>
  @import url(./VToggleSwitch.scss);
</style>