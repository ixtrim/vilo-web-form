<template>
  <div class="files-uploader">
    <input type="file" multiple @change="onFileChange" accept=".jpeg, .png, .gif, .webp, .pdf, .docx, .doc, .xlsx, .xls, .ppt, .pptx, .txt" />
    <div class="files-uploader__list">
      <div v-for="(fileData, index) in filesData" :key="index" class="files-uploader__list__item">
        <template v-if="fileData.isImage">
          <div class="image-preview">
            <img :src="fileData.preview" alt="Preview" />
            <span>Image</span>
          </div>
        </template>
        <template v-else>
          <div class="file-preview"><span>{{ fileData.extension }}</span></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { storage } from '@/firebase.js'; 
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface FileData {
  isImage: boolean;
  preview: string;
  extension: string;
}

const filesData = ref<FileData[]>([]);
const emit = defineEmits(['images-uploaded']);

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    console.error("No files selected");
    return;
  }

  const files = Array.from(input.files);
  filesData.value = []; // Reset current files data

  files.forEach(file => {
    const fileData: FileData = {
      isImage: file.type.startsWith('image/'),
      preview: '',
      extension: ''
    };

    if (fileData.isImage) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          fileData.preview = result;
          filesData.value.push(fileData);
          await uploadFile(file); // Upload each image
        }
      };
      reader.readAsDataURL(file);
    } else {
      fileData.extension = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      filesData.value.push(fileData);
      uploadFile(file); // Upload non-image files without preview
    }
  });
}

async function uploadFile(file: File) {
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