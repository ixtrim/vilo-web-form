<template>
  <div class="image-uploader">
    <input type="file" @change="onFileChange" accept="image/jpeg, image/png, image/gif, image/webp" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineEmits } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const imageData = ref<string>('');
const imageElement = ref<HTMLImageElement | null>(null);
const emit = defineEmits(['image-cropped', 'image-selected']);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    console.error("No file selected");
    return;
  }

  const file = input.files[0];

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    const imageData = reader.result;

    emit('image-selected', imageData);
  };

}

</script>

<style>
  @import url(./VImageUploaderNoCropped.scss);
</style>