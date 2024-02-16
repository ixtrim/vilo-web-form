<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Full Name" 
          placeholder="John Kowalski" 
          v-model="localUserName"
        />
        <p v-if="errorUserName" class="error-message">{{ errorUserName }}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <VInput 
          label="Email address" 
          placeholder="john@example.com" 
          v-model="localUserEmail"
        />
        <p v-if="errorUserEmail" class="error-message">{{ errorUserEmail }}</p>
      </div>
      <div class="col-lg-6">
        <VInput 
          label="Password" 
          placeholder="Enter password" 
          type="password" 
          v-model="localUserPassword"
        />
        <p v-if="errorUserPassword" class="error-message">{{ errorUserPassword }}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Avatar</label>
          <VImageUploader @image-cropped="handleImageCropped" />
        </div>
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
          <p v-if="errorUserCompany" class="error-message">{{ errorUserCompany }}</p>
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
        <p v-if="errorUserPhone" class="error-message">{{ errorUserPhone }}</p>
      </div>
    </div>

    <div class="row" v-if="dropdownRoleTitle === 'Client (individual)' || dropdownRoleTitle === 'Client (company)'">
      <div class="col-lg-12">
        <VInput 
          label="Address" 
          placeholder="ex. 123 Main St, New York, NY 10001, USA" 
          v-model="localUserAddress"
        />
        <p v-if="errorUserAddress" class="error-message">{{ errorUserAddress }}</p>
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
          <p v-if="errorUserPosition" class="error-message">{{ errorUserPosition }}</p>
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
  import { db, storage } from '@/firebase.js';
  import type { PropType } from 'vue';
  import { ref, watch, computed } from 'vue';
  import { doc, setDoc } from 'firebase/firestore';
  import { uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { getAuth } from 'firebase/auth';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VImageUploader from '@/components/v-image-uploader/VImageUploader.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';

  const localUserName = ref('');
  const localUserEmail = ref('');
  const localUserPassword = ref('');
  const localUserCompany = ref('');
  const localUserPhone = ref('');
  const localUserAddress = ref('');
  const localUserPosition = ref('');

  const errorUserName = ref('');
  const errorUserEmail = ref('');
  const errorUserPassword = ref('');
  const errorUserPosition = ref('');
  const errorUserPhone = ref('');
  const errorUserAddress = ref('');
  const errorUserCompany = ref('');

  const avatarUrl = ref('');

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

  const dropdownStatusTitle = ref('Pending');
  function onStatusChanged(item: DropdownItem) {
    dropdownStatusTitle.value = item.label;
  }

  async function handleImageCropped(blob: Blob) {
    if (props.nextUserId === undefined) {
      console.error("nextUserId is undefined");
      return;
    }

    try {
      const userId = props.nextUserId.toString().padStart(4, '0');
      const imageRef = storageRef(storage, `users/${userId}.jpg`);
      await uploadBytes(imageRef, blob);
      avatarUrl.value = await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  }

  function closeModal() {
    emit('close-modal');
  }

  async function saveAndClose() {

    errorUserName.value = '';
    errorUserEmail.value = '';
    errorUserPassword.value = '';
    errorUserPosition.value = '';
    errorUserPhone.value = '';
    errorUserAddress.value = '';
    errorUserCompany.value = '';

    let isValid = true;

    if (!localUserName.value.trim()) {
      errorUserName.value = 'Full Name is required!';
      isValid = false;
    }

    if (!localUserPassword.value.trim() || localUserPassword.value.length < 6) {
      errorUserPassword.value = 'Password is required and must be at least 6 characters!';
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!localUserEmail.value.trim()) {
      errorUserEmail.value = 'Email is required!';
      isValid = false;
    } else if (!emailRegex.test(localUserEmail.value)) {
      errorUserEmail.value = 'Invalid email format!';
      isValid = false;
    }
    
    if (!localUserPosition.value.trim()) {
      errorUserPosition.value = 'Position is required!';
      isValid = false;
    }

    if (dropdownRoleTitle.value === 'Client (individual)' || dropdownRoleTitle.value === 'Client (company)') {
      if (!localUserPhone.value.trim()) {
        errorUserPhone.value = 'Phone is required!';
        isValid = false;
      }
      if (!localUserAddress.value.trim()) {
        errorUserAddress.value = 'Address is required!';
        isValid = false;
      }
    }

    if (dropdownRoleTitle.value === 'Client (company)' && !localUserCompany.value.trim()) {
      errorUserCompany.value = 'Company name is required!';
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Saving datas to Firebase Authentication and Firestore
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, localUserEmail.value, localUserPassword.value);
      const user = userCredential.user;

      // Use the UID from Firebase Authentication as the document ID in Firestore
      const newUserDetails = {
        full_name: localUserName.value,
        phone: localUserPhone.value || '',
        address: localUserAddress.value || '',
        position: localUserPosition.value || '',
        company: localUserCompany.value || '',
        role: dropdownRoles.value.findIndex(role => role.label === dropdownRoleTitle.value),
        status: dropdownStatus.value.findIndex(status => status.label === dropdownStatusTitle.value),
        notes: userNotes.value || '',
        avatar: avatarUrl.value,
      };

      await setDoc(doc(db, "users", user.uid), newUserDetails);

      emit('save-clicked', newUserDetails);
      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error creating new user: ", error);
    }

    function resetForm() {
      localUserName.value = '';
      localUserEmail.value = '';
      localUserCompany.value = '';
      localUserPhone.value = '';
      localUserAddress.value = '';
      localUserPosition.value = '';
      avatarUrl.value = '';

      // Reset all dropdowns to their default values
      dropdownRoleTitle.value = 'General'; // Assuming 'General' is the default
      dropdownStatusTitle.value = 'Pending'; // Assuming 'Pending' is the default

      // Reset all error messages
      errorUserName.value = '';
      errorUserEmail.value = '';
      errorUserPosition.value = '';
      errorUserPhone.value = '';
      errorUserAddress.value = '';
      errorUserCompany.value = '';
    }

  }

</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>