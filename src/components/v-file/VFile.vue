<template>
  <div class="v-file">
    <div class="v-file__icon">
      <img :src="`/src/assets/filetypes/${fileExtension}.svg`" :alt="fileName" />
    </div>
    <div class="v-file__details">
      <h5 class="v-file__name">{{ fileName }}</h5>
      <p class="v-file__size">{{ fileSize }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'VFile',
  props: {
    fileExtension: {
      type: String as PropType<string>,
      required: true
    },
    fileName: {
      type: String as PropType<string>,
      required: true
    },
    fileSize: {
      type: String as PropType<string>,
      required: true
    }
  },
  computed: {
    
  }
});
</script>

<style>
  @import url(./VFile.scss);
</style>