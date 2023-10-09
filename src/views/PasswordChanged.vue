
<template>
  <div class="forgot-part">
    <v-iconbox class="v-check-circle" />
    <h2 class="text-center">Password was changed</h2>
    <h4 class="text-center">Your password was successfully changed. You can know use it to log in.</h4>

    <v-button text="Continue" @click="handleButtonClick" block=true></v-button>
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
        this.$router.push('/sign-in');
      },
    },
  };
</script>

<style>
@import url(./styles/password-changed.scss);
</style>