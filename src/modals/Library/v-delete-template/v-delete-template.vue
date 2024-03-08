<template>
    <div class="modal-body">
  
      <div class="row">
        <div class="col-md-12">
            Are you sure you want to delete this template? This action can not be undone.
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <ul class="modal-footer__actions">
        <li>
          <v-button :block="true" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
        </li>
        <li>
          <v-button :block="true" size="md" styled="danger" @click="deleteTemplate" text="Delete"></v-button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref, watch, computed, defineEmits, defineProps } from 'vue';
    import type { PropType } from 'vue';
    import { doc, deleteDoc } from 'firebase/firestore';
    import { db } from '@/firebase.js';
    import VButton from '@/components/v-button/VButton.vue';
  
    const emit = defineEmits(['close-modal', 'delete-clicked']);
  
    const props = defineProps({
      fileId: String,
      title: String,
    });
  
    function closeModal() {
      emit('close-modal');
    }
    
    async function deleteTemplate() {
      if (!props.fileId) {
        console.error("File ID is undefined");
        return;
      }

      try {
        const fileRef = doc(db, "templates", props.fileId);
        deleteDoc(fileRef)
            .then(() => {
                console.log("Template successfully deleted!");
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });

        emit('delete-clicked');
        
        closeModal();
      } catch (error) {
        console.error("Error deleting the document:", error);
      }
    }
  </script>
  
  <style>
  @import url(@/components/v-modal/v-modal.scss);
  </style>