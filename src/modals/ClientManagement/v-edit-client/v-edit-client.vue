<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-6">
        <VInput 
          label="Full Name" 
          placeholder="John Kowalski" 
          v-model="userName"
        />
      </div>
      <div class="col-lg-6">
        <VInput 
          label="Email address" 
          placeholder="john@example.com" 
          v-model="userEmail"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Client type</label>
          <VDropdown :title="dropdownClientTypeTitle" :items="dropdownClientType" @item-clicked="onClientTypeChanged" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <VInput 
            label="Position" 
            placeholder="ex. Lawyer" 
            v-model="userPosition"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <VInput 
          label="Company" 
          placeholder="ex. Vilo" 
          v-model="userCompany"
        />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Phone" 
          placeholder="+1 23 456 789" 
          v-model="userPhone"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Address" 
          placeholder="+1 23 456 789" 
          v-model="userAddress"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VTextarea 
          label="Notes" 
          placeholder="Additional notes..." 
          v-model="computedUserNotes"
        />
      </div>
    </div>

  </div>
  <div class="modal-footer">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="Primary" @click="saveAndClose" text="Save"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { doc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebase.js';
  import { ref, watch, computed } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';

  type DropdownItem = {
    label: string;
  };

  const emit = defineEmits(['close-modal', 'save-clicked']);

  const props = defineProps({
    userId: Number,
    userName: String,
    userEmail: String,
    userPhone: String,
    userPosition: String,
    userCompany: String,
    userAddress: String,
    userNotes: String,
    title: {
      type: String,
      required: true
    },
  });

  const userName = ref(props.userName);
  watch(() => props.userName, (newVal) => {
    userName.value = newVal;
  });
  const userEmail = ref(props.userEmail);
  const userPhone = ref(props.userPhone);
  const userPosition = ref(props.userPosition);
  const userCompany = ref(props.userCompany);
  const userAddress = ref(props.userAddress);
  const userNotes = ref(props.userNotes);
  const computedUserNotes = computed({
    get: () => userNotes.value === 'string' ? '' : userNotes.value,
    set: (val) => userNotes.value = val
  });

  const dropdownClientType = ref([
    { label: 'Individual' },
    { label: 'Company' }
  ]);
  const dropdownClientTypeTitle = ref('Individual');
  function onClientTypeChanged(item: DropdownItem) {
    dropdownClientTypeTitle.value = item.label;
  }

  const dropdownPositions = ref([
    { label: 'Sales' },
    { label: 'Retainer' },
  ]);
  const dropdownPositionTitle = ref('Sales');
  function onPositionChanged(item: DropdownItem) {
    dropdownPositionTitle.value = item.label;
  }

  function closeModal() {
    emit('close-modal');
  }

  async function saveAndClose() {
    try {
      const userRef = doc(db, "users", props.userId);
      await updateDoc(userRef, {
        full_name: userName.value,
        email: userEmail.value,
        phone: userPhone.value,
        position: userPosition.value,
        company: userCompany.value,
        address: userAddress.value,
        notes: userNotes.value,
      });
      emit('save-clicked');
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }
</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>