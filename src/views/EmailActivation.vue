<template>
  <div class="forgot-part">

    <div v-if="emailVerified">
      <v-iconbox class="v-check-circle" />
      <h2 class="text-center">Email verified</h2>
      <h4 class="text-center">Your email was successfully verified. You can now use it to log in.</h4>
    </div>

    <div v-if="error">
      <v-iconbox class="v-error" />
      <h2 class="text-center">Verification Failed</h2>
      <h4 class="text-center">Contact us for more details.</h4>
    </div>


    <v-button v-if="emailVerified" text="Continue" @click="handleButtonClick" block=true></v-button>
  </div>
</template>

<script>
  import axios from 'axios';
  import VButton from '@/components/v-button/VButton.vue';
  import VIconbox from '@/components/v-iconbox/VIconbox.vue';

  export default {
    components: {
      VButton,
      VIconbox
    },
    data() {
      return {
        token: '',
        emailVerified: false,
        error: null,
      };
    },
    mounted() {
      this.token = this.$route.query.token;
      this.verifyEmail();
    },
    methods: {
      async verifyEmail() {
        console.log('verifyEmail');
        try {
          const response = await axios.get('https://api-vilo.nestvested.co/auth/email-verify', {
            params: {
              token: this.token,
            },
          });

          if (response.data.email) {
            this.emailVerified = true;
          } else {
            this.error = 'Email verification failed';
            console.log('111');
          }
        } catch (error) {
          this.error = error.message || 'Email verification failed';
          console.log('222');
        }
      },
      handleButtonClick() {
        this.$router.push('/sign-in');
      },
    },
  };
</script>

<style>
  @import url(./styles/email-verification.scss);
</style>