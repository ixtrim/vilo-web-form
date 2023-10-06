
<template>
  <div class="forgot-part">
    <v-iconbox class="v-mail-icon" />
    <h2 class="text-center">Check your email</h2>
    <h4 class="text-center">We sent a verification link to <a class="normal-link"
        href="mailto:olivia@untitledui.com">olivia@untitledui.com</a></h4>

    <v-button text="Go to Login" @click="handleButtonClick" block=true></v-button>

    <div class="signup-wrap text-center">
      <span>Didn’t receive the email?</span>
      <VLink to="/forgot-password" isRouteLink>Click to resend</VLink>
    </div>
  </div>
</template>

<script>
  import VButton from '@/components/v-button/VButton.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VLink from '@/components/v-link/VLink.vue';
  import VIconbox from '@/components/v-iconbox/VIconbox.vue';

  export default {
    components: {
      VButton,
      VInput,
      VLink,
      VIconbox
    },
    methods: {
      handleButtonClick() {
        // Handle button click here
      },
    },
  };
</script>

<style>
  @import url(./styles/email-verification.scss);
</style>