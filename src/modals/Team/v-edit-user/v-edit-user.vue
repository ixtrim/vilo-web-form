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
          <VDropdown :title="getStatusLabel(localUserStatus ?? 0)" :items="dropdownStatusItems" @item-clicked="item => dropdownStatusChange(userId ?? '', item)" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Role</label>
            <VDropdown :title="getRoleLabel(localUserRole ?? 0)" :items="dropdownRoleItems" @item-clicked="item => dropdownRoleChange(userId ?? '', item)" />
        </div>
      </div>
    </div>

    <div class="row" v-if="localUserRole === 3">
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

    <div class="row" v-if="localUserRole === 2 || localUserRole === 3">
      <div class="col-lg-12">
        <VInput 
          label="Phone" 
          placeholder="+1 23 456 789" 
          v-model="localUserPhone"
        />
      </div>
    </div>

    <div class="row" v-if="localUserRole === 2 || localUserRole === 3">
      <div class="col-lg-12">
        <VInput 
          label="Address" 
          placeholder="+1 23 456 789" 
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
  import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
  import { ref, watch, computed } from 'vue';
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';

  type DropdownItem = {
    label: string;
  };

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);

  const props = defineProps({
    userId: String,
    userName: String,
    userEmail: String,
    userPhone: String,
    userAddress: String,
    userPosition: String,
    userCompany: String,
    dropdownRoleItems: {
      type: Array as PropType<DropdownItem[]>,
      default: () => []
    },
    userRole: Number,
    dropdownStatusItems: {
      type: Array as PropType<DropdownItem[]>,
      default: () => []
    },
    userStatus: Number,
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
  const userAddress = ref(props.userAddress);
  const userPosition = ref(props.userPosition);
  const userCompany = ref(props.userCompany);
  const userRole = ref(props.userRole);
  const userStatus = ref(props.userStatus);
  const userNotes = ref(props.userNotes);

  const localUserName = ref(props.userName);
  const localUserEmail = ref(props.userEmail);
  const localUserPhone = ref(props.userPhone);
  const localUserAddress = ref(props.userAddress);
  const localUserPosition = ref(props.userPosition);
  const localUserCompany = ref(props.userCompany);
  const localUserRole = ref(props.userRole);
  const localUserStatus = ref(props.userStatus);
  const localUserNotes = ref(props.userNotes);

  watch(() => props.userName, (newVal) => localUserName.value = newVal);
  watch(() => props.userEmail, (newVal) => localUserEmail.value = newVal);
  watch(() => props.userPhone, (newVal) => localUserPhone.value = newVal);
  watch(() => props.userAddress, (newVal) => localUserAddress.value = newVal);
  watch(() => props.userPosition, (newVal) => localUserPosition.value = newVal);
  watch(() => props.userCompany, (newVal) => localUserCompany.value = newVal);
  watch(() => props.userRole, (newVal) => localUserRole.value = newVal);
  watch(() => props.userStatus, (newVal) => localUserStatus.value = newVal);
  watch(() => props.userNotes, (newVal) => localUserNotes.value = newVal);

  const dropdownRoleChange = async (userId: string, item: DropdownItem) => {
    const roleCodeMapping = {
      'Admin': 0,
      'Internal user': 1,
      'Client (individual)': 2,
      'Client (company)': 3,
    };
    const newRoleCode = roleCodeMapping[item.label as keyof typeof roleCodeMapping];

    if (newRoleCode !== undefined && props.userId) {
      try {
        const userRef = doc(db, "users", props.userId);
        await updateDoc(userRef, {
          role: newRoleCode
        });
        console.log('Role updated successfully');
        userRole.value = newRoleCode;
        emit('role-changed', newRoleCode);
      } catch (error) {
        console.error('Error updating role:', error);
      }
    } else {
      console.error('Invalid role selected or User ID is undefined');
    }
  };

  const getRoleLabel = (roleCode: number) => {
    const roleMapping: { [key: number]: string } = {
      0: 'Admin',
      1: 'Internal user',
      2: 'Client (individual)',
      3: 'Client (company)',
    };

    return roleMapping[roleCode] ?? 'Unknown';
  };

  const dropdownStatusChange = async (userId: string, item: DropdownItem) => {
    const statusCodeMapping = {
      'Draft': 0,
      'Pending': 1,
      'Activated': 2,
    };
    const newStatusCode = statusCodeMapping[item.label as keyof typeof statusCodeMapping];

    if (newStatusCode !== undefined && props.userId) {
      try {
        const userRef = doc(db, "users", props.userId);
        await updateDoc(userRef, {
          status: newStatusCode
        });
        console.log('Status updated successfully');
        userStatus.value = newStatusCode;
        emit('status-changed', newStatusCode);
      } catch (error) {
        console.error('Error updating role:', error);
      }
    } else {
      console.error('Invalid status selected or User ID is undefined');
    }
  };

  const getStatusLabel = (statusCode: number) => {
    const statusMapping: { [key: number]: string } = {
      0: 'Draft',
      1: 'Pending',
      2: 'Activated',
    };

    return statusMapping[statusCode] ?? 'Unknown';
  };

  const computedUserNotes = computed({
    get: () => userNotes.value === 'string' ? '' : userNotes.value,
    set: (val) => localUserNotes.value = val
  });

  function closeModal() {
    emit('close-modal');
  }

  function saveAndClose() {
    console.log("Emitting updated data:", {
      // Log the data being emitted
      userId: props.userId,
      userName: localUserName.value,
      userEmail: localUserEmail.value,
      // ... other fields
    });
    emit('save-clicked', {
      userId: props.userId,
      userName: localUserName.value,
      userEmail: localUserEmail.value,
      userPhone: localUserPhone.value,
      userAddress: localUserAddress.value,
      userPosition: localUserPosition.value,
      userCompany: localUserCompany.value,
      userRole: localUserRole.value,
      userStatus: localUserStatus.value,
      userNotes: localUserNotes.value,
    });
    closeModal();
  }
</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>