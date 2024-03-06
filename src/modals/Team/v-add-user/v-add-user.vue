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

    <div class="row" v-if="dropdownRoleTitle !== 'Client (individual)' && dropdownRoleTitle !== 'Client (company)'">
      <div class="col-lg-12">
        <hr />
        <strong style="">User Google Calendar Integration</strong><br/><br/>
      </div>
    </div>

    <div class="row" v-if="dropdownRoleTitle !== 'Client (individual)' && dropdownRoleTitle !== 'Client (company)'">
      <div class="col-lg-12">
        <div class="form-group">
          <label></label>
          <VInput 
            label="Google Calendar API key" 
            placeholder="ex. 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" 
            v-model="localUserGoogleCalendarAPIKey"
          />
          <small>In the Google Cloud console, go to Menu menu > APIs & Services > Credentials. Click Create credentials > API key. Your new API key is displayed. Click Copy content_copy to copy your API key for use in your app's code. <a href="https://cloud.google.com/docs/authentication/api-keys" target="_blank">Here you can find more information.</a></small>
        </div>
      </div>
    </div>

    <div class="row" v-if="dropdownRoleTitle !== 'Client (individual)' && dropdownRoleTitle !== 'Client (company)'">
      <div class="col-lg-12">
        <div class="form-group">
          <label></label>
          <VInput 
            label="Google Calendar ID" 
            placeholder="ex. abcdeaa21f268@group.calendar.google.com" 
            v-model="localUserGoogleCalendarID"
          />
          <small>Click on the three vertical dot menu option next to your name or the primary calendar name. Select Settings and sharing. Scroll down on the screen and select Integrate calendar. You will find your Calendar ID. <a href="https://support.google.com/calendar/answer/37083?hl=en" target="_blank">Here you can find more information.</a></small>
        </div>
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
  const localUserGoogleCalendarAPIKey = ref('');
  const localUserGoogleCalendarID = ref('');

  const errorUserName = ref('');
  const errorUserEmail = ref('');
  const errorUserPassword = ref('');
  const errorUserPosition = ref('');
  const errorUserPhone = ref('');
  const errorUserAddress = ref('');
  const errorUserCompany = ref('');

  const errorMessage = ref('');

  const avatarUrl = ref('');
  let croppedImageBlob = ref<Blob | null>(null);

  const props = defineProps({
    title: String
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

  const roleMappings = {
    'Admin': 0,
    'General': 1,
    'Finance': 2,
    'Client (individual)': 3,
    'Client (company)': 4,
  };

  const statusMappings = {
    'Draft': 0,
    'Pending': 1,
    'Activated': 2,
  };

  function handleImageCropped(blob: Blob) {
    croppedImageBlob.value = blob;
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

    const newUserDetails = {
      full_name: localUserName.value,
      email: localUserEmail.value,
      password: localUserPassword.value,
      phone: localUserPhone.value || '',
      address: localUserAddress.value || '',
      position: localUserPosition.value || '',
      company: localUserCompany.value || '',
      role: roleMappings[dropdownRoleTitle.value as keyof typeof roleMappings],
      status: statusMappings[dropdownStatusTitle.value as keyof typeof statusMappings],
      notes: userNotes.value || '',
      avatarBlob: croppedImageBlob.value,
      google_calendar_api_key: localUserGoogleCalendarAPIKey.value,
      google_calendar_id: localUserGoogleCalendarID.value,
    };

    emit('save-clicked', newUserDetails);

    resetForm();
    closeModal();

    function resetForm() {
      localUserName.value = '';
      localUserEmail.value = '';
      localUserCompany.value = '';
      localUserPhone.value = '';
      localUserAddress.value = '';
      localUserPosition.value = '';
      avatarUrl.value = '';

      // Reset all dropdowns to their default values
      dropdownRoleTitle.value = 'General';
      dropdownStatusTitle.value = 'Pending';

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