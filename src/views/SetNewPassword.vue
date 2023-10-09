<template>
  <div class="set-new-password-part">
    <v-iconbox class="v-lock-icon" />
    <h2 class="text-center">Set new password</h2>
    <h4 class="text-center">Your new password must be different to previously used passwords.</h4>

    <form @submit.prevent="handleButtonClick">
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

      <v-button  
        text="Sign In" 
        type="submit"
        @click="handleSubmit"
        block=true
      ></v-button>
    </form>

  </div>
</template>

<script>
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
      validationClass(isValid) {
        return {
          'valid': isValid,
          'invalid': !isValid && this.password !== '',
          'default': this.password === ''
        };
      },
      iconContainerClass(isValid) {
        return {
          'icon-container--valid': isValid,
          'icon-container--invalid': !isValid && this.password !== '',
          'icon-container--default': this.password === ''
        };
      },
      iconClass(isValid) {
        return {
          'icon--check': isValid,
          'icon--cross': !isValid && this.password !== '',
          'icon--default': this.password === ''
        };
      },
      handleSubmit() {
        console.log('Button clicked or form submitted'); 

        // Check if fields are filled
        if (!this.password) {
          this.passwordValidationMessage = 'Password is required!';
        } else {
          this.passwordValidationMessage = '';
        }

        if (!this.confirmPassword) {
          this.confirmPasswordValidationMessage = 'Confirm password is required!';
        } else {
          this.confirmPasswordValidationMessage = '';
        }

        // Check if password is valid
        if (this.isPasswordValid && this.password && this.confirmPassword) {
          this.$router.push('/password-changed');
        } else {
          console.log('Password is invalid.');
        }
      },
    },
  };
</script>


<style>
  @import url(./styles/set-new-password.scss);
</style>
