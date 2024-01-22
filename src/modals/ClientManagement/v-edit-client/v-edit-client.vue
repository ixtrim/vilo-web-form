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
          <VDropdown :title="getRoleLabel(userRole ?? 0)" :items="dropdownRoleItems" @item-clicked="dropdownRoleChange" />
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
  import { ref, watch, computed, defineEmits, defineProps } from 'vue';
  import type { PropType } from 'vue';
  import { doc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebase.js';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';

  type DropdownItem = {
    label: string;
    value: number;
  };

  const emit = defineEmits(['close-modal', 'save-clicked']);

  const props = defineProps({
    userId: String,
    userName: String,
    userEmail: String,
    userPhone: String,
    userRole: Number,
    userPosition: String,
    userCompany: String,
    userAddress: String,
    userNotes: String,
    title: String,
    dropdownRoleItems: {
      type: Array as PropType<DropdownItem[]>,
      default: () => []
    },
  });

  // Define userRole as a reactive property
  const userRole = ref(props.userRole);

  // Now set up the watcher
  watch(() => props.userRole, (newRole) => {
    if (newRole !== undefined) {
      userRole.value = newRole;
    }
  }, { immediate: true });

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

  const dropdownRoleItems: DropdownItem[] = [
    { label: 'Client (individual)', value: 3 },
    { label: 'Client (company)', value: 4 },
  ];

  const dropdownRoleChange = (item: DropdownItem) => {
    const roleCodeMapping = {
      'Client (individual)': 3,
      'Client (company)': 4,
    };
    const newRoleCode = roleCodeMapping[item.label as keyof typeof roleCodeMapping];
    if (newRoleCode !== undefined) {
      userRole.value = newRoleCode;
    } else {
      console.error('Invalid role selected');
    }
  };

  const getRoleLabel = (roleCode: number) => {
    const roleItem = dropdownRoleItems.find(item => item.value === roleCode);
    return roleItem ? roleItem.label : 'Unknown';
  };

  function closeModal() {
    emit('close-modal');
  }

  async function saveAndClose() {
    if (!props.userId) {
      console.error("User ID is undefined");
      return;
    }
    try {
      const userRef = doc(db, "users", props.userId);
      await updateDoc(userRef, {
        full_name: userName.value,
        email: userEmail.value,
        phone: userPhone.value,
        position: userPosition.value,
        role: userRole.value,
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