<template>
  <div class="sign-in-part">
    <h2>Log in to your account</h2>
    <h4>Welcome back! Please enter your details.</h4>

    <v-input 
      label="Email" 
      placeholder="Enter your email" 
      v-model="email" 
      @blur="validateEmail" 
      :errorMessage="emailValidationMessage"
    />

    <v-input 
      label="Password" 
      placeholder="••••••••" 
      type="password" 
      v-model="password"
      @input="validatePassword"
      :errorMessage="passwordValidationMessage"
    />

    <p class="error-message" v-if="loginErrorMessage">{{ loginErrorMessage }}</p>

    <div class="row v-input-group">
      <div class="col-lg-6">
        <div class="input-group align-items-center ">
          <input type="checkbox" id="remember" v-model="rememberMe" class="mr-8p">
          <label for="remember">Remember me</label>
        </div>
      </div>
      <div class="col-lg-6 text-end">
        <VLink to="/forgot-password" isRouteLink>Forgot password</VLink>
      </div>
    </div>

    <v-button text="Sign In" @click="handleSubmit" :block="true"></v-button>

  </div>
</template>

<script lang="ts">
  import axios from 'axios';
  import VButton from '@/components/v-button/VButton.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VLink from '@/components/v-link/VLink.vue';

  export default {
    components: {
      VButton,
      VInput,
      VLink
    },
    data() {
      return {
        email: '',
        emailValidationMessage: '',
        password: '',
        passwordValidationMessage: '',
        rememberMe: false,
        loginErrorMessage: '',
      };
    },
    methods: {
      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          this.emailValidationMessage = 'Please enter a valid email address';
        } else {
          this.emailValidationMessage = '';
        }
      },
      validatePassword() {
      },
      SignInWithGoogle() {
        console.log('Sign in with Google button clicked');
      },
      async handleSubmit() {
      },
    },
    mounted() {
      
    }
  };
</script>

<style>
  @import url(./styles/sign-in.scss);
</style>