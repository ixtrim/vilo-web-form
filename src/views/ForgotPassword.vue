
<template>
  <div class="forgot-part">
    <v-iconbox class="v-forgot-key" />
    <h2 class="text-center">Forgot Password</h2>
    <h4 class="text-center">No worries, we’ll send you reset instructions.</h4>

    <v-input 
      label="Email" 
      placeholder="Enter your email" 
      v-model="email" 
      @blur="validateEmail" 
      :errorMessage="emailValidationMessage"
    />

    
    <p class="error-message" v-if="resetErrorMessage">{{ resetErrorMessage }}</p>

    <v-button text="Reset password" @click="handleSubmit" :block="true"></v-button>
    <VLink to="/sign-in" isRouteLink styled="secondary" icon="left" icon-style="arrow-left" :block="true">
      <span>Back to log in</span>
    </VLink>
  </div>
</template>
<script lang="ts">
  import axios, { AxiosError } from 'axios';
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
    data() {
      return {
        email: '',
        emailValidationMessage: '',
        resetErrorMessage: '',
        resetSuccessMessage: '',
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
      async handleSubmit() {
        this.emailValidationMessage = '';
        this.resetErrorMessage = '';

        if (!this.email) {
          this.emailValidationMessage = 'Email is required!';
        }

        if (!this.emailValidationMessage) {
          try {
            await axios.post('https://api-vilo.nestvested.co/auth/request-reset-email/', {
              email: this.email,
            }, {
              headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
              },
            });

            this.$router.push('/email-verification');
          } catch (error: any) {
            if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.email) {
              this.resetErrorMessage = error.response.data.email[0];
            } else {
              this.resetErrorMessage = 'An error occurred. Please try again later.';
            }
          }
          
        } else {
          console.log('Form is invalid, do not submit');
        }
      },
    },
  };
</script>
<style>
  @import url(./styles/forgot-password.scss);
</style>