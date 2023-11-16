<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content">
      <slot></slot>
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:show', false);
    }
  }
};
</script>

<style>
.modal-backdrop {
  /* Add your styling for backdrop */
}
.modal-content {
  /* Add your styling for modal content */
}
</style>