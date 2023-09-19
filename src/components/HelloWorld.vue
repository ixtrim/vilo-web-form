
<template>
 <div class="container">
  <v-input/>
   <v-button
      rounded=true
      text="Sign In"
      @click="handleButtonClick"
      block=true
    ></v-button>
 </div>
</template>
<script>
import VButton from '@/components/v-button/VButton.vue';
import VInput from '@/components/v-input/VInput.vue';

export default {
  components: {
    VButton,
    VInput
  },
  methods: {
    handleButtonClick() {
      // Handle button click here
    },
  },
};
</script>