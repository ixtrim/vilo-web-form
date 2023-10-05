
<template>
  <div class="forgot-part">
    <v-iconbox class="v-forgot-key" />
    <h2 class="text-center">Forgot Password</h2>
    <h4 class="text-center">No worries, we’ll send you reset instructions.</h4>
    <v-input label="Email" placeholder="Enter your email" />

    <v-button text="Reset password" @click="handleButtonClick" block=true></v-button>
    <VLink to="/signin" isRouteLink styled="primary" icon="left" icon-style="arrow-left" block=true>
      <span>Back to login</span>
    </VLink>
    <div class="signup-wrap text-center">
      <span>Don’t have an account?</span>
      <VLink to="/signup" isRouteLink>Sign Up</VLink>
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
  @import url(./styles/forgot-password.scss);
</style>