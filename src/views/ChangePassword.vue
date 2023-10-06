
<template>
 <div class="forgot-part">
  <v-iconbox class="v-lock-icon"/>
<h2 class="text-center">Set new password</h2>
<h4 class="text-center">Your new password must be different to previously used passwords.</h4>
    <v-input label="Password" placeholder="*********" type="password"/>
    <v-input label="Confirm Password" placeholder="*********" type="password"/>

   <div class="row v-input-group">
    <div class="col-lg-6">
    </div>
   </div>

   <v-button
      rounded=true
      text="Change Ppassword"
      @click="handleButtonClick"
      block=true
    ></v-button>
    <div class="signup-wrap text-left">
      <span><span class="check-confirm"></span>Must be at least 8 characters</span><br/>
      <span>Must contain one special character</span>
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
<style lang="scss">
@import '@/components/styles/variables/fonts.scss';
@import '@/components/styles/variables/colors.scss';
.forgot-part{
max-width: 360px;
margin: 0 auto;
h2{
  font-family: var(--v-font-inter-semi-bold);
  color: var(--v-gray-900);
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 38px; /* 126.667% */
}
h4{
  font-family: var(--v-font-inter-regular);
  color: var(--v-gray-600);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  margin-bottom: 32px;
}
.input-group{
  input.mr-8p{
    margin-right: 8px;
  }
  label{
    color: var(--v-gray-700);
    font-family: var(--v-font-inter-medium);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
  }
}
.v-input-group{
  margin-top: 24px;
  margin-bottom: 24px;
}
.signup-wrap{
  span{
    font-family: var(--v-font-inter-regular);
    color: var(--v-gray-600);
    font-size: 14px;
    line-height: 20px;
    margin-right: 8px;
  }
}
}
</style>