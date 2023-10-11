<template>
  <div class="forgot-part">
    <v-iconbox class="v-check-circle" />
    <h2 class="text-center">Email verified</h2>
    <h4 class="text-center">Your email was successfully verified. You can now use it to log in.</h4>

    <v-button text="Continue" @click="handleButtonClick" block=true></v-button>
  </div>
</template>

<script>
  import VButton from '@/components/v-button/VButton.vue';
  import VIconbox from '@/components/v-iconbox/VIconbox.vue';

  export default {
    components: {
      VButton,
      VIconbox
    },
    methods: {
      handleButtonClick() {
        this.$router.push('/sign-in');
      },
    },
  };
</script>

<style>
  @import url(./styles/email-verification.scss);
</style>