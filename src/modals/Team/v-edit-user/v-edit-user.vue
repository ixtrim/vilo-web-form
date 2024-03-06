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
        <div class="form-group form-group--edit-avatar">
          <label>Avatar</label>

          <div class="row">
            <div class="col-lg-2">
              <div v-if="localUserAvatar" class="current-avatar">
                <img :src="localUserAvatar" :alt="localUserName" />
              </div>
            </div>
            <div class="col-lg-10">
              <VImageUploader @image-cropped="handleImageCropped" />
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Status</label>
          <VDropdown :title="getStatusLabel(localUserStatus ?? 0)" :items="dropdownStatusItems" @item-clicked="dropdownStatusChange" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Role</label>
          <VDropdown :title="getRoleLabel(localUserRole ?? 0)" :items="dropdownRoleItems" @item-clicked="dropdownRoleChange" />
        </div>
      </div>
    </div>

    <div class="row" v-if="localUserRole === 4">
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

    <div class="row" v-if="localUserRole === 3 || localUserRole === 4">
      <div class="col-lg-12">
        <VInput 
          label="Phone" 
          placeholder="+1 23 456 789" 
          v-model="localUserPhone"
        />
      </div>
    </div>

    <div class="row" v-if="localUserRole === 3 || localUserRole === 4">
      <div class="col-lg-12">
        <VInput 
          label="Address" 
          placeholder="132, My Street, Kingston, New York 12401, USA" 
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

    <div class="row" v-if="localUserRole !== 3 && localUserRole !== 4">
      <div class="col-lg-12">
        <hr />
        <strong style="">User Google Calendar Integration</strong><br/><br/>
      </div>
    </div>

    <div class="row" v-if="localUserRole !== 3 && localUserRole !== 4">
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

    <div class="row" v-if="localUserRole !== 3 && localUserRole !== 4">
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
  import { db } from '@/firebase.js';
  import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
  import { uploadBytes, ref as storageRef, getDownloadURL } from 'firebase/storage';
  import { storage } from '@/firebase.js';
  import { getAuth, updateEmail } from 'firebase/auth';
  import { ref, watch, computed } from 'vue';
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VImageUploader from '@/components/v-image-uploader/VImageUploader.vue';

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
    userAvatar: String,
    userGoogleCalendarAPIKey: String,
    userGoogleCalendarID: String,
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
  const userAvatar = ref(props.userAvatar);
  const userGoogleCalendarAPIKey = ref(props.userGoogleCalendarAPIKey);
  const userGoogleCalendarID = ref(props.userGoogleCalendarID);

  const localUserName = ref(props.userName);
  const localUserEmail = ref(props.userEmail);
  const localUserPhone = ref(props.userPhone);
  const localUserAddress = ref(props.userAddress);
  const localUserPosition = ref(props.userPosition);
  const localUserCompany = ref(props.userCompany);
  const localUserRole = ref(props.userRole);
  const localUserStatus = ref(props.userStatus);
  const localUserNotes = ref(props.userNotes);
  const localUserAvatar = ref(props.userAvatar);
  const localUserGoogleCalendarAPIKey = ref(props.userGoogleCalendarAPIKey);
  const localUserGoogleCalendarID = ref(props.userGoogleCalendarID);

  watch(() => props.userName, (newVal) => localUserName.value = newVal);
  watch(() => props.userEmail, (newVal) => localUserEmail.value = newVal);
  watch(() => props.userPhone, (newVal) => localUserPhone.value = newVal);
  watch(() => props.userAddress, (newVal) => localUserAddress.value = newVal);
  watch(() => props.userPosition, (newVal) => localUserPosition.value = newVal);
  watch(() => props.userCompany, (newVal) => localUserCompany.value = newVal);
  watch(() => props.userRole, (newVal) => localUserRole.value = newVal);
  watch(() => props.userStatus, (newVal) => localUserStatus.value = newVal);
  watch(() => props.userNotes, (newVal) => localUserNotes.value = newVal);
  watch(() => props.userAvatar, (newVal) => localUserAvatar.value = newVal);
  watch(() => props.userGoogleCalendarAPIKey, (newVal) => localUserGoogleCalendarAPIKey.value = newVal);
  watch(() => props.userGoogleCalendarID, (newVal) => localUserGoogleCalendarID.value = newVal);

  async function handleImageCropped(blob: Blob) {
    const userId = props.userId;
    const imageRef = storageRef(storage, `users/${userId}.jpg`);
    await uploadBytes(imageRef, blob);
    localUserAvatar.value = await getDownloadURL(imageRef);
  }

  const dropdownRoleChange = (item: DropdownItem) => {
    const roleCodeMapping = {
      'Admin': 0,
      'General': 1,
      'Finance': 2,
      'Client (individual)': 3,
      'Client (company)': 4,
    };
    const newRoleCode = roleCodeMapping[item.label as keyof typeof roleCodeMapping];
    if (newRoleCode !== undefined) {
      localUserRole.value = newRoleCode;
    } else {
      console.error('Invalid role selected');
    }
  };

  const getRoleLabel = (roleCode: number) => {
    const roleMapping: { [key: number]: string } = {
      0: 'Admin',
      1: 'General',
      2: 'Finance',
      3: 'Client (individual)',
      4: 'Client (company)',
    };

    return roleMapping[roleCode] ?? 'Unknown';
  };

  const dropdownStatusChange = (item: DropdownItem) => {
    const statusCodeMapping = {
      'Draft': 0,
      'Pending': 1,
      'Activated': 2,
    };
    const newStatusCode = statusCodeMapping[item.label as keyof typeof statusCodeMapping];
    if (newStatusCode !== undefined) {
      localUserStatus.value = newStatusCode;
    } else {
      console.error('Invalid status selected');
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
    const auth = getAuth();
    const user = auth.currentUser;
    
    emit('save-clicked', {
      userId: props.userId,
      userAvatar: localUserAvatar.value,
      userName: localUserName.value,
      userEmail: localUserEmail.value,
      userPhone: localUserPhone.value,
      userAddress: localUserAddress.value,
      userPosition: localUserPosition.value,
      userCompany: localUserCompany.value,
      userRole: localUserRole.value,
      userStatus: localUserStatus.value,
      userNotes: localUserNotes.value,
      userGoogleCalendarAPIKey: localUserGoogleCalendarAPIKey.value,
      userGoogleCalendarID: localUserGoogleCalendarID.value,
    });
    closeModal();
  }
</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>