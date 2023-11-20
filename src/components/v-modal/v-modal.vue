<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
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
  @import url(@/components/v-modal/v-modal.scss);
</style>