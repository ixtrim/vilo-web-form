<template>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-12">
            <img :src="header" style="width: 100%; max-width: 100%; height: auto; max-height: 120px; margin: 0 auto 20px auto;" />
        </div>
        <div class="col-md-12" v-if="content">
            <div v-for="(item, index) in content" v-html="item"></div>
        </div>
        <div class="col-md-12">
            <img :src="footer || ''" style="width: 100%; max-width: 100%; height: auto; max-height: 120px; margin: 0 auto 20px auto;" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <ul class="modal-footer__actions">
        <li></li>
        <li>
          <v-button :block="true" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
        </li>
        <li></li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
    import { defineComponent, onMounted, ref, watch, computed, defineEmits, defineProps } from 'vue';
    import type { PropType } from 'vue';
    import { doc, deleteDoc } from 'firebase/firestore';
    import { db } from '@/firebase.js';
    import VButton from '@/components/v-button/VButton.vue';
  
    const emit = defineEmits(['close-modal']);
  
    const props = defineProps({
        content: String,
        header: String,
        footer: String,
    });
    

    function closeModal() {
      emit('close-modal');
    }
    
  </script>
  
  <style>
  @import url(@/components/v-modal/v-modal.scss);
  </style>