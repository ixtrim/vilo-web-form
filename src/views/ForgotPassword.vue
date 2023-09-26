
<template>
 <div class="sign-in-part">
<h2 class="text-center">Forgot Password</h2>
<h4 class="mb-">No worries, we’ll send you reset instructions.</h4>
  <v-input label="Email" placeholder="Enter your email"/>

   <div class="row v-input-group">
    <div class="col-lg-6">
    </div>
   </div>

   <v-button
      rounded=true
      text="Reset password"
      @click="handleButtonClick"
      block=true
    ></v-button>
     <!-- <v-button
     class="v-button--white v-button--flex"
      rounded=true
      text="Back to login"
      @click="handleButtonClick"
      block=true
      icon="vicon v-back"
    ></v-button> -->
     <VLink to="/signin" isRouteLink class="v-button v-button--white v-button--flex v-button--link"><i class="vicon v-back icon-20"></i><span>Back to login</span></VLink>
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
<style lang="scss">
@import '@/components/styles/variables/fonts.scss';
@import '@/components/styles/variables/colors.scss';
.sign-in-part{
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
.icon-20:after{
  height: 20px;
  width: 20px;
}
</style>