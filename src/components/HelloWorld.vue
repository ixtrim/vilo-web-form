
<template>
 <div class="container">
  Hello World!
   <v-button
      width="200px"
      height="40px"
      bgcolor="#3498db"
      size="18px"
      textColor="#fff"
      icon="fa fa-search"
      text="Search"
      @click="handleButtonClick"
    ></v-button>
 </div>
</template>
<script>
import VButton from '@/components/v-button/VButton.vue';

export default {
  components: {
    VButton,
  },
  methods: {
    handleButtonClick() {
      // Handle button click here
    },
  },
};
</script>