<template>
  <div class="iconbox-wrapper">
    <span class="iconbox">
      <i :class="customClass">
        <slot></slot>
      </i>
    </span>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    class: {
      type: String,
      default: "",
    },
  },
  computed: {
    customClass() {
      return `vicon v-iconbox-icon ${this.class}`;
    },
  },
};
</script>

<style scoped lang="scss">
.iconbox-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 24px;

  .iconbox {
    height: 56px;
    width: 56px;
    border: 1px solid #EAECF0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 1px 2px 0px #1018280D;
  }
}
</style>