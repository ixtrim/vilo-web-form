<template>
  <div class="form-group">
    <label v-if="label && label !== ''" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="updateValue"
      @blur="$emit('blur')"
    />
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      label: String,
      type: {
        type: String,
        default: 'text'
      },
      modelValue: [String, Number],
      placeholder: String,
      disabled: Boolean,
      errorMessage: String,
    },
    methods: {
      updateValue(event: Event) {
        const input = event.target as HTMLInputElement;
        this.$emit('update:modelValue', input.value);
      },
    },
    computed: {
      inputId() {
        return `input-${this.type}-${Date.now()}`;
      },
    },
  });
</script>

<style>
  @import url(./VInput.scss);
</style>
