<template>
  <div class="form-group">
    <label v-if="labelEnabled" :for="inputId">{{ label }}</label>
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
    labelEnabled: {
      type: Boolean,
      default: true
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
      localValue: this.modelValue,
    };
  },
  watch: {
    modelValue(newVal) {
      this.localValue = newVal;
    },
    localValue(newVal) {
      this.$emit('update:modelValue', newVal);
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
