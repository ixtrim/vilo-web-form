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

    <v-button text="Sign In" @click="handleSubmit" block=true></v-button>
    <v-button :block="true" size="md" icon="left" icon-style="google" styled="outlined" @click="handleButtonClick" text="Sign in with Google"></v-button>

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
    data() {
      return {
        email: '',
        emailValidationMessage: '',
        password: '',
        passwordValidationMessage: '',
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
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(this.password)) {
          this.passwordValidationMessage = 'Password must be at least 8 characters and contain one special character';
        } else {
          this.passwordValidationMessage = '';
        }
      },
      handleSubmit() {
        this.emailValidationMessage = '';
        this.passwordValidationMessage = '';

        if (!this.email) {
          this.emailValidationMessage = 'Email is required!';
        }
        if (!this.password) {
          this.passwordValidationMessage = 'Password is required!';
        }

        if (!this.emailValidationMessage && !this.passwordValidationMessage) {
          this.$router.push('/dashboard');
        } else {
          console.log('Form is invalid, do not submit');
        }
      },
    },
  };
</script>

<style>
  @import url(./styles/sign-in.scss);
</style>