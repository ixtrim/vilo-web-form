<template>
  <div class="form-group">
    <label v-if="label && label !== ''" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="localValue"
      :placeholder="placeholder"
      @input="updateValue"
      @blur="$emit('blur')"
    />
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Label'
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      localValue: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.localValue = newVal;
    },
    localValue(newVal) {
      this.$emit('input', newVal);  // Emit the 'input' event for v-model to work
    },
  },
  methods: {
    updateValue(event) {
      this.localValue = event.target.value;
    },
  },
  computed: {
    inputId() {
      return `input-${this.type}-${Date.now()}`
    }
  }
}
</script>

<style>
  @import url(./VInput.scss);
</style>
