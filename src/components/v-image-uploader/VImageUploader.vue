<template>
  <div class="image-uploader">
    <input type="file" @change="onFileChange" accept="image/jpeg, image/png, image/gif, image/webp" />
    <div v-if="imageData" class="image-preview">
      <img :src="imageData" alt="Preview" ref="imageElement" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, defineEmits } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const imageData = ref<string>('');
const imageElement = ref<HTMLImageElement | null>(null);
const emit = defineEmits(['image-cropped']);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    console.error("No file selected");
    return;
  }

  const file = input.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        imageData.value = result;
        initializeCropper();
      }
    };
    reader.readAsDataURL(file);
  }
}

function initializeCropper() {
  nextTick(() => {
    if (imageElement.value) {
      const cropper = new Cropper(imageElement.value, {
        aspectRatio: 1,
        viewMode: 1,
        crop(event) {
          const canvas = cropper.getCroppedCanvas({
            width: 150,
            height: 150
          });

          // Convert the canvas to a Blob and emit the cropped image data
          canvas.toBlob((blob) => {
            emit('image-cropped', blob);
          });
        },
      });
    }
  });
}

</script>

<style>
  @import url(./VImageUploader.scss);
</style>