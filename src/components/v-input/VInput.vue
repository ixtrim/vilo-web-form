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

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
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
        localValue: this.value as string | number,
      };
    },
    watch: {
      value(newVal: string | number) {
        this.localValue = newVal;
      },
      localValue(newVal: string | number) {
        this.$emit('input', newVal);
      },
    },
    methods: {
      updateValue(event: Event) {
        const input = event.target as HTMLInputElement;
        this.localValue = input.value;
      },
    },
    computed: {
      inputId(): string {
        return `input-${this.type}-${Date.now()}`
      }
    }
  });
</script>

<style>
  @import url(./VInput.scss);
</style>
