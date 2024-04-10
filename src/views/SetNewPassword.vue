<template>
  <div class="set-new-password-part">
    <v-iconbox class="v-lock-icon" />
    <h2 class="text-center">Set new password</h2>
    <h4 class="text-center">Your new password must be different to previously used passwords.</h4>

    <form @submit.prevent="handleSubmit">
      <v-input 
        type="password" 
        v-model="password" 
        @input="validatePassword" 
        placeholder="••••••••" 
        label="Password"
        :errorMessage="passwordValidationMessage"
      />
      <v-input 
        label="Confirm password" 
        placeholder="••••••••" 
        type="password" 
        v-model="confirmPassword"
        @input="validateConfirmPassword"
        :errorMessage="confirmPasswordValidationMessage"
      />

      <ul role="list" class="password-validation">
        <li :class="validationClass(isValidLength)">
          <div class="icon-container" :class="iconContainerClass(isValidLength)">
            <i :class="iconClass(isValidLength)"></i>
          </div>
          <span>Must be at least 8 characters</span>
        </li>
        <li :class="validationClass(hasSpecialCharacter)">
          <div class="icon-container" :class="iconContainerClass(hasSpecialCharacter)">
            <i :class="iconClass(hasSpecialCharacter)"></i>
          </div>
          <span>Must contain one special character</span>
        </li>
        <li :class="validationClass(arePasswordsMatching)">
          <div class="icon-container" :class="iconContainerClass(arePasswordsMatching)">
            <i :class="iconClass(arePasswordsMatching)"></i>
          </div>
          <span>Password fields are matching</span>
        </li>
      </ul>

      <p class="error-message" v-if="apiErrorMessage">{{ apiErrorMessage }}</p>

      <v-button  
        text="Change password" 
        type="submit"
        @click="handleSubmit"
        :block="true"
      ></v-button>
    </form>

  </div>
</template>

<script lang="ts">
  import { confirmPasswordReset, getAuth } from 'firebase/auth';
  import VButton from '@/components/v-button/VButton.vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VIconbox from '@/components/v-iconbox/VIconbox.vue';

  export default {
    components: {
      VButton,
      VInput,
      VIconbox
    },
    data() {
      return {
        password: '',
        confirmPassword: '',
        isValidLength: false,
        hasSpecialCharacter: false,
        arePasswordsMatching: false,
        passwordValidationMessage: '',
        confirmPasswordValidationMessage: '',
        apiErrorMessage: '',
      };
    },
    computed: {
      isPasswordValid() {
        return this.isValidLength && this.hasSpecialCharacter && this.arePasswordsMatching;
      },
    },
    methods: {
      validatePassword() {
        this.isValidLength = this.password.length >= 8;
        this.hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);

        this.passwordValidationMessage = '';

        this.validateConfirmPassword();
      },
      validateConfirmPassword() {
        this.arePasswordsMatching = this.password === this.confirmPassword;

        this.confirmPasswordValidationMessage = '';
      },
      validationClass(isValid: boolean) {
        return {
          'valid': isValid,
          'invalid': !isValid && this.password !== '',
          'default': this.password === ''
        };
      },
      iconContainerClass(isValid: boolean) {
        return {
          'icon-container--valid': isValid,
          'icon-container--invalid': !isValid && this.password !== '',
          'icon-container--default': this.password === ''
        };
      },
      iconClass(isValid: boolean) {
        return {
          'icon--check': isValid,
          'icon--cross': !isValid && this.password !== '',
          'icon--default': this.password === ''
        };
      },
      async handleSubmit() {
        if (!this.password || !this.confirmPassword) {
          // Basic validation already handled by individual input validations
          return;
        }

        if (!this.isPasswordValid) {
          // Additional logic or user feedback can be implemented here
          return;
        }

        try {
          const oobCode = this.$route.query.oobCode as string;
          await confirmPasswordReset(getAuth(), oobCode, this.password);
          this.$router.push('/password-changed'); // Redirect on success
        } catch (error) {
            if ((error as any).code === 'auth/invalid-action-code') {
            this.apiErrorMessage = 'Your reset link has expired or is invalid. Please request a new one.';
          } else {
            this.apiErrorMessage = 'Failed to reset password. Please try again.';
          }
          console.error(error);
        }
      }
    },
    async mounted() {
      if (!this.$route.query.oobCode) {
        this.apiErrorMessage = 'Invalid or expired password reset link. Please request a new one.';
        setTimeout(() => this.$router.push('/forgot-password'), 5000);
      }
    },
  };
</script>

<style>
  @import url(./styles/set-new-password.scss);
</style>
