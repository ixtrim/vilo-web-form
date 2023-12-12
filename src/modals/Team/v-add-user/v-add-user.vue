<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-6">
        <VInput 
          label="Full Name" 
          placeholder="John Kowalski" 
          v-model="localUserName"
        />
      </div>
      <div class="col-lg-6">
        <VInput 
          label="Email address" 
          placeholder="john@example.com" 
          v-model="localUserEmail"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Status</label>
          <VDropdown :title="dropdownStatusTitle" :items="dropdownStatus" @item-clicked="onStatusChanged" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Role</label>
          <VDropdown :title="dropdownRoleTitle" :items="dropdownRoles" @item-clicked="onRoleChanged" />
        </div>
      </div>
    </div>

    <div class="row" v-if="dropdownRoleTitle === 'Client (company)'">
      <div class="col-lg-12">
        <div class="form-group">
          <VInput 
          label="Company" 
          placeholder="ex. Vilo" 
          v-model="localUserCompany"
        />
        </div>
      </div>
    </div>

    <div class="row" v-if="dropdownRoleTitle === 'Client (individual)' || dropdownRoleTitle === 'Client (company)'">
      <div class="col-lg-12">
        <VInput 
          label="Phone" 
          placeholder="+1 23 456 789" 
          v-model="localUserPhone"
        />
      </div>
    </div>

    <div class="row" v-if="dropdownRoleTitle === 'Client (individual)' || dropdownRoleTitle === 'Client (company)'">
      <div class="col-lg-12">
        <VInput 
          label="Address" 
          placeholder="ex. 123 Main St, New York, NY 10001, USA" 
          v-model="localUserAddress"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label></label>
          <VInput 
            label="Position" 
            placeholder="ex. Sales" 
            v-model="localUserPosition"
          />
        </div>
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
  import { db } from '@/firebase.js';
  import { doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
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

  const props = defineProps({
    title: String,
    nextUserId: Number
  });

  type DropdownItem = {
    label: string;
  };

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);
  const userNotes = ref();
  const computedUserNotes = computed({
    get: () => userNotes.value === 'string' ? '' : userNotes.value,
    set: (val) => userNotes.value = val
  });

  const dropdownRoles = ref([
    { label: 'Admin' },
    { label: 'General' },
    { label: 'Finance' },
    { label: 'Client (individual)'  },
    { label: 'Client (company)'  },
    
  ]);
  const dropdownRoleTitle = ref('General');
  function onRoleChanged(item: DropdownItem) {
    dropdownRoleTitle.value = item.label;
  }

  const dropdownStatus = ref([
    { label: 'Draft' },
    { label: 'Pending'  },
    { label: 'Activated'  },
    
  ]);
  const dropdownStatusTitle = ref('Draft');
  function onStatusChanged(item: DropdownItem) {
    dropdownStatusTitle.value = item.label;
  }

  function closeModal() {
    emit('close-modal');
  }

  async function saveAndClose() {
    if (props.nextUserId === undefined) {
      console.error("nextUserId is undefined");
      return;
    }

    const formattedId = props.nextUserId.toString().padStart(4, '0');

    const newUser = {
      full_name: localUserName.value,
      email: localUserEmail.value,
      phone: localUserPhone.value || '',
      address: localUserAddress.value || '',
      position: localUserPosition.value || '',
      company: localUserCompany.value || '',
      role: dropdownRoles.value.findIndex(role => role.label === dropdownRoleTitle.value),
      status: dropdownStatus.value.findIndex(status => status.label === dropdownStatusTitle.value),
      notes: userNotes.value || ''
    };

    try {
      await setDoc(doc(db, "users", formattedId), newUser);
      emit('save-clicked', newUser);
    } catch (error) {
      console.error("Error adding new user: ", error);
    }

    closeModal();
  }

</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>