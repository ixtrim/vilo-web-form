<template>
  <div class="sign-in-part">
    <h2>Log in to your account</h2>
    <h4>Welcome back! Please enter your details.</h4>
    <v-input label="Email" placeholder="Enter your email" />
    <v-input label="Password" placeholder="*********" type="password" />

    <div class="row v-input-group">
      <div class="col-lg-6">
        <div class="input-group align-items-center ">
          <input type="checkbox" id="remember" class="mr-8p">
          <label for="remember">Remember me</label>
        </div>
      </div>
      <div class="col-lg-6 text-end">
        <VLink to="/forgot-password" isRouteLink>Forgot password</VLink>
      </div>
    </div>

    <v-button 
      text="Sign In" 
      @click="handleButtonClick" 
      block=true
    ></v-button>
    <v-button
      :block="true"
      size="md"
      icon="left"
      icon-style="google"
      styled="outlined"
      @click="handleButtonClick"
      text="Sign in with Google"
    ></v-button>
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

export default {
  components: {
    VButton,
    VInput,
    VLink
  },
  methods: {
    handleButtonClick() {
      // Handle button click here
    },
  },
};
</script>

<style>
@import url(./styles/sign-in.scss);
</style>