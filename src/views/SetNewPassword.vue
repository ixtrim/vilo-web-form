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
  import axios, { AxiosError } from 'axios';
  import { defineComponent } from 'vue';
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
      isPasswordValid(): boolean {
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
      validationClass(isValid: boolean): Record<string, boolean> {
        return {
          'valid': isValid,
          'invalid': !isValid && this.password !== '',
          'default': this.password === ''
        };
      },
      iconContainerClass(isValid: boolean): Record<string, boolean> {
        return {
          'icon-container--valid': isValid,
          'icon-container--invalid': !isValid && this.password !== '',
          'icon-container--default': this.password === ''
        };
      },
      iconClass(isValid: boolean): Record<string, boolean> {
        return {
          'icon--check': isValid,
          'icon--cross': !isValid && this.password !== '',
          'icon--default': this.password === ''
        };
      },
      async handleSubmit() {

        // Check if fields are filled
        if (!this.password) {
          this.passwordValidationMessage = 'Password is required!';
          return;
        } else {
          this.passwordValidationMessage = '';
        }

        if (!this.confirmPassword) {
          this.confirmPasswordValidationMessage = 'Confirm password is required!';
          return;
        } else {
          this.confirmPasswordValidationMessage = '';
        }

        // Check if password is valid
        if (this.isPasswordValid && this.password && this.confirmPassword) {
          try {
            const { token1: uidb64, token2: token } = this.$route.params;

            const response = await axios.patch('https://api-vilo.nestvested.co/auth/password-reset-complete/', {
              password: this.password,
              uidb64,
              token
            }, {
              headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
              },
            });

            this.$router.push('/password-changed');
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response && error.response.data && error.response.data.message) {
                this.apiErrorMessage = error.response.data.message;
              } else {
                this.apiErrorMessage = 'An unexpected error occurred. Please try again later.';
              }
            } else {
              this.apiErrorMessage = 'An unexpected error occurred. Please try again later.';
            }
          }
        } else {
          
        }
      },
    },
    async mounted() {
      try {
        const { token1: uidb64, token2: token } = this.$route.params;

        const response = await axios.post('https://api-vilo.nestvested.co/auth/password-reset/', {
          uidb64,
          token
        }, {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
        });

        console.log('Response:', response.data);

      } catch (error) {
        this.$router.push('/forgot-password');
      }
    },
  };
</script>

<style>
  @import url(./styles/set-new-password.scss);
</style>
