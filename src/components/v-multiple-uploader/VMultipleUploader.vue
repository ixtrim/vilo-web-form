<template>
  <div class="files-uploader">
    <input type="file" multiple @change="onFileChange" accept="image/jpeg, image/png, image/gif, image/webp" />
    <div class="files-uploader__list">
      <div v-for="(imageSrc, index) in imagesData" :key="index" class="files-uploader__list__item">
        <img :src="imageSrc" alt="Preview" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { storage } from '@/firebase.js'; // Ensure you have this import for Firebase storage
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const imagesData = ref<string[]>([]);
const emit = defineEmits(['images-uploaded']);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    console.error("No files selected");
    return;
  }

  const files = Array.from(input.files);
  imagesData.value = []; // Reset current images data

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          imagesData.value.push(result);
          await uploadImage(file); // Upload each image
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

async function uploadImage(file: File) {
  const storagePath = `tasks/${new Date().getTime()}_${file.name}`;
  const fileRef = storageRef(storage, storagePath);
  try {
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    emit('images-uploaded', downloadURL); // You might adjust this to handle multiple URLs
  } catch (error) {
    console.error("Upload failed: ", error);
  }
}
</script>

<style>
  @import url(./VMultipleUploader.scss);
</style>