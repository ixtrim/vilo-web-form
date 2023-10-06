<template>
  <div class="set-new-password-part">
    <v-iconbox class="v-check-circle" />
    <h2 class="text-center">Set new password</h2>
    <h4 class="text-center">Your new password must be different to previously used passwords.</h4>

    <form @submit.prevent="handleButtonClick">
      <v-input 
        type="password" 
        v-model="password" 
        @input="validatePassword" 
        placeholder="********" 
        label="Password"
      />
      <v-input 
        label="Confirm password" 
        placeholder="********" 
        type="password" 
        v-model="confirmPassword"
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
      </ul>

      <v-button  
        text="Sign In" 
        type="submit"
        block=true
      ></v-button>
    </form>

  </div>
</template>

<script>
import VButton from '@/components/v-button/VButton.vue';
import VInput from '@/components/v-input/VInput.vue';

export default {
  components: {
    VButton,
    VInput,
  },
  data() {
    return {
      password: '',
      confirmPassword: '',
      isValidLength: false,
      hasSpecialCharacter: false,
    };
  },
  computed: {
    isPasswordValid() {
      return this.isValidLength && this.hasSpecialCharacter && this.password === this.confirmPassword;
    },
  },
  methods: {
    handleButtonClick() {

    console.log('Button clicked or form submitted'); 

    if (this.isPasswordValid) {
      // Handle password change
      console.log('Password is valid and can be changed.');
    } else {
      console.log('Password is invalid.');
    }
    },
    validatePassword() {
      console.log('Typed password:', this.password);
      this.isValidLength = this.password.length >= 8;
      this.hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
      console.log('Validating password:', this.isValidLength, this.hasSpecialCharacter);
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
    
  },
};
</script>


<style>
  @import url(./styles/set-new-password.scss);
</style>
