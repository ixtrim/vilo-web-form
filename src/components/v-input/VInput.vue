<template>
  <div class="form-group">
    <label v-if="labelEnabled" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
    />
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
    }
  },
  computed: {
    inputId() {
      // Generate a unique input ID based on a unique key (timestamp)
      return `input-${Date.now()}`
    }
  }
}
</script>

<style>
@import url(./VInput.scss);
</style>
