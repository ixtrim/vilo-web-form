<template>
  <div class="container-fluid">

    <QuillEditor theme="snow" />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  components: {
    QuillEditor
  }
}
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
