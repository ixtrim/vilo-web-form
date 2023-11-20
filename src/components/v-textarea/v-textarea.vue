<template>
  <div class="form-group">
    <label v-if="label" :for="textareaId">{{ label }}</label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      @input="updateValue"
      @blur="$emit('blur')"
      :rows="rows"
      :cols="cols"
    ></textarea>
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VTextarea',
  props: {
    label: String,
    modelValue: {
      type: [String, Number],
      default: ''
    },
    placeholder: String,
    rows: {
      type: Number,
      default: 4
    },
    cols: Number,
    errorMessage: String,
  },
  methods: {
    updateValue(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      this.$emit('update:modelValue', textarea.value);
    },
  },
  computed: {
    textareaId() {
      return `textarea-${Date.now()}`;
    },
  },
});
</script>

<style>
  @import url(./v-textarea.scss);
</style>