<template>
  <transition name="fade">
    <div v-if="visible" :class="['v-notification', type]" @click="closeNotification">
      <span class="v-notification__close" @click.stop="closeNotification"></span>
      <div class="v-notification__content">
        <div>
          <strong>{{ header }}</strong>
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'warning', // 'success', 'error', 'warning'
    },
    header: {
      type: String,
      default: 'Changes was succesfully saved!',
    },
    message: {
      type: String,
      default: 'All your changes was successfully saved in app. You do not need to do anything else.',
    },
    duration: {
      type: Number,
      default: 5000,
    }
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    closeNotification() {
      this.visible = false;
    },
    showNotification() {
      this.visible = true;
      setTimeout(() => {
        this.closeNotification();
      }, this.duration);
    }
  },
};
</script>

<style>
@import url(./VNotification.scss);
</style>