<template>
  <div class="modal-body add-invoice">

    <div class="row">
      <div class="col-lg-8">
        <h4 class="add-invoice__nr">Invoice <span>#3066</span></h4>
      </div>
      <div class="col-lg-4">
        
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <VInput 
          label="Recipient Name*" 
          placeholder="John Doe" 
          v-model="localUserName"
        />
      </div>
      <div class="col-lg-6">
        <VInput 
          label="Recipient email" 
          placeholder="johndoe@vilo.com" 
          v-model="localUserName"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Billing Address" 
          placeholder="132, My Street, Kingston, New York 12401, USA" 
          v-model="localUserName"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <h4>Invoice Items</h4>
      </div>
      <div class="col-lg-6">
        
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <VInput 
          label="Project Description" 
          placeholder="Legal Consulting" 
          v-model="localUserName"
        />
      </div>
      <div class="col-lg-6">
        <VInput 
          label="Due Date" 
          placeholder="21.10.2023" 
          v-model="localUserName"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <p>Subtotal: <strong>$1400</strong></p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <VInput 
          label="Taxes" 
          placeholder="6%" 
          v-model="localUserName"
        />
      </div>
      <div class="col-lg-6">
        <VInput 
          label="Total discount" 
          placeholder="0%" 
          v-model="localUserName"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <p>Total: <strong>$1400</strong></p>
      </div>
    </div>

  </div>
  <div class="modal-footer">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" icon="left" icon-style="add" styled="outlined" @click="closeModal" text="Save as draft"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="Primary" @click="saveAndClose" text="Send to client"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { db } from '@/firebase.js';
  import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
  import { ref, watch, computed } from 'vue';
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';

  const localUserName = ref('');
  const localUserEmail = ref('');
  const localUserCompany = ref('');
  const localUserPhone = ref('');
  const localUserAddress = ref('');
  const localUserPosition = ref('');

  type DropdownItem = {
    label: string;
  };

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);
  const userNotes = ref();
  const computedUserNotes = computed({
    get: () => userNotes.value === 'string' ? '' : userNotes.value,
    set: (val) => userNotes.value = val
  });

  const dropdownTeam = ref([
    { label: 'Sara Kozinska' },
    { label: 'Matthew Bowman' },
    { label: 'Bessy Hourigan'  },
    { label: 'Fiona Rainton'  },
    
  ]);
  const dropdownTeamTitle = ref('Matthew Bowman');
  function onTeamChanged(item: DropdownItem) {
    dropdownTeamTitle.value = item.label;
  }

  const dropdownClient = ref([
    { label: 'Valaria Roches' },
    { label: 'Cooper Houtbie'  },
    { label: 'Giusto Tomson'  },
    { label: 'General use'  },
  ]);
  const dropdownClientTitle = ref('General use');
  function onClientChanged(item: DropdownItem) {
    dropdownClientTitle.value = item.label;
  }

  function closeModal() {
    emit('close-modal');
  }

  function saveAndClose() {
    emit('save-clicked');
    closeModal();
  }
</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>