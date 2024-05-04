<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Status" 
          placeholder="Sale completed" 
          v-model="notificationStatus"
        />
        <p v-if="errorStatus" class="error-message">{{ errorStatus }}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VTextarea 
          label="Notes" 
          placeholder="e.g. We have completed the bill of sale on June 8, 2024" 
          v-model="notificationNotes"
        />
        <p v-if="errorNotes" class="error-message">{{ errorNotes }}</p>
      </div>
    </div>

  </div>
  <div class="modal-footer">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="Primary" @click="sendAndClose" text="Send"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { db } from '@/firebase.js';
  import { defineComponent, onMounted, ref } from 'vue';
  import type { Ref } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import '@vuepic/vue-datepicker/dist/main.css';

  const emit = defineEmits(['close-modal', 'send-clicked', 'notification-sent']);

  const notificationStatus = ref('');
  const notificationNotes = ref('');
  const errorStatus = ref('');
  const errorNotes = ref('');

  function closeModal() {
    emit('close-modal');
  }

  async function sendAndClose(event: any) {
    event.stopPropagation();
    // Reset error messages
    errorStatus.value = '';
    errorNotes.value = '';

    // Validation
    if (!notificationStatus.value.trim()) {
      errorStatus.value = 'Status is required!';
    }
    if (!notificationNotes.value.trim()) {
      errorNotes.value = 'Note is required!';
    }

    if (errorStatus.value || errorNotes.value) {
      return;
    }
    
    try {
      
      emit('send-clicked');
      closeModal();
    } catch (error) {
      console.error("Failed to add new task:", error);
    }
  }
</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>