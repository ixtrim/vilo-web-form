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
          <label>Role</label>
          <VDropdown :title="dropdownRoleTitle" :items="dropdownRoles" @item-clicked="onRoleChanged" />
        </div>
      </div>
    </div>

    <div class="row" v-if="dropdownRoleTitle === 'Client user'">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Client type</label>
          <VDropdown :title="dropdownClientTypeTitle" :items="dropdownClientType" @item-clicked="onClientTypeChanged" />
        </div>
      </div>
    </div>

    <div class="row" v-if="dropdownClientTypeTitle === 'Company' && dropdownRoleTitle === 'Client user'">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Company name</label>
          <VDropdown :title="dropdownCompanyTitle" :items="dropdownCompany" @item-clicked="onCompanyChanged" />
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

    <div class="row" v-if="dropdownRoleTitle === 'Client user'">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Position</label>
          <VDropdown :title="dropdownPositionTitle" :items="dropdownPositions" @item-clicked="onPositionChanged" />
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
import { ref, watch, computed } from 'vue';
import { defineEmits, defineProps } from 'vue';
import VInput from '@/components/v-input/VInput.vue';
import VTextarea from '@/components/v-textarea/v-textarea.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VButton from '@/components/v-button/VButton.vue';

const emit = defineEmits(['close-modal']);
const props = defineProps({
  userId: Number,
  userName: String,
  userEmail: String,
  userPhone: String,
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
const userAddress = ref(props.userAddress);
const userNotes = ref(props.userNotes);
const computedUserNotes = computed({
  get: () => userNotes.value === 'string' ? '' : userNotes.value,
  set: (val) => userNotes.value = val
});

const dropdownRoles = ref([
  { label: 'Admin' },
  { label: 'Internal user' },
  { label: 'Client user' }
]);
const dropdownRoleTitle = ref('Client user');
function onRoleChanged(item) {
  dropdownRoleTitle.value = item.label;
}

const dropdownClientType = ref([
  { label: 'Individual' },
  { label: 'Company' }
]);
const dropdownClientTypeTitle = ref('Individual');
function onClientTypeChanged(item) {
  dropdownClientTypeTitle.value = item.label;
}

const dropdownCompany = ref([
  { label: 'MAXBURST, Inc.' },
  { label: 'Pardalis and Nohavicka Lawyers' },
  { label: 'Jeffrey B. Peltz, P.C.' },
  { label: 'Redmond Accident Lawyers' },
  { label: 'Leav & Steinberg, LLP' },
  { label: 'Morelli Law Firm' },
  { label: 'Meirowitz & Wasserberg, LLP' },
  { label: 'Mark I. Cohen, ESQ' },
  { label: 'Antin Ehrlich & Epstein LLP' },
  { label: 'Law Offices of Lisa Beth' },
  { label: 'Rudyuk Law Firm' },
]);
const dropdownCompanyTitle = ref('Rudyuk Law Firm');
function onCompanyChanged(item) {
  dropdownCompanyTitle.value = item.label;
}

const dropdownPositions = ref([
  { label: 'Sales' },
  { label: 'Retainer' },
]);
const dropdownPositionTitle = ref('Sales');
function onPositionChanged(item) {
  dropdownPositionTitle.value = item.label;
}

function closeModal() {
  emit('close-modal');
}

function saveAndClose() {
  closeModal();
  emit('save-clicked');
}

</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>