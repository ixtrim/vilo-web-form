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
    <v-button :block="true" size="md" icon="left" icon-style="google" styled="outlined" @click="SignInWithGoogle" text="Sign in with Google"></v-button>

    <div class="signup-wrap text-center">
      <span>Don’t have an account?</span>
      <VLink to="/sign-up" isRouteLink>Sign Up</VLink>
    </div>

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
        /*const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(this.password)) {
          this.passwordValidationMessage = 'Password must be at least 8 characters and contain one special character';
        } else {
          this.passwordValidationMessage = '';
        }*/
      },
      SignInWithGoogle() {
        console.log('Sign in with Google button clicked');
      },
      async handleSubmit() {
        this.emailValidationMessage = '';
        this.passwordValidationMessage = '';
        this.loginErrorMessage = '';

        if (!this.email) {
          this.emailValidationMessage = 'Email is required!';
        }
        if (!this.password) {
          this.passwordValidationMessage = 'Password is required!';
        }

        // Check for specific admin credentials
        if (this.email === 'admin@viloapp.com' && this.password === 'ViloAPPpsw2023') {
          // Set a token or some flag in localStorage or sessionStorage
          localStorage.setItem('isAdmin', 'true'); // Example flag
          this.$router.push('/dashboard');
          return;
        }

        if (!this.emailValidationMessage && !this.passwordValidationMessage) {
          try {
            const response = await axios.post('https://api-vilo.nestvested.co/auth/login/', {
              email: this.email,
              password: this.password,
            }, {
              headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
              },
            });

            localStorage.setItem('token', response.data.tokens);

            if (this.rememberMe) {
              localStorage.setItem('token', response.data.tokens);
            } else {
              sessionStorage.setItem('token', response.data.tokens);
            }

            this.$router.push('/dashboard');
          } catch (error) {
            this.loginErrorMessage = 'Login failed. Please check your email and password and try again.';
          }
        } else {
          this.loginErrorMessage = 'Login failed. Please try again.';
        }
      },
    },
    mounted() {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        this.$router.push('/dashboard');
      }
    }
  };
</script>

<style>
  @import url(./styles/sign-in.scss);
</style>