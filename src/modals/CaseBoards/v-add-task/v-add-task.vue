<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-12">
        <p>Case ID: {{ props.caseId }}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Title" 
          placeholder="New task" 
          v-model="localTitle"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VTextarea 
          label="Description" 
          placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints." 
          v-model="localDescription"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <div class="form-group">
          <label>Priority</label>
          <VDropdown :title="dropdownPriorityTitle" :items="dropdownPriority" @item-clicked="onPriorityChanged" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <VInput 
            label="Due Date" 
            placeholder="02.12.2023" 
            v-model="localDueDate"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Assign to</label>
          <VDropdown :title="dropdownAssignedTitle" :items="dropdownAssigned" @item-clicked="onAssignedChanged" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Reporter</label>
          <VDropdown :title="dropdownReporterTitle" :items="dropdownReporter" @item-clicked="onReporterChanged" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <v-button :block="false" size="md" styled="link-gray" icon="left" icon-style="upload" text="Attach file"></v-button>
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
  import { DocumentReference, addDoc, doc, getDoc, updateDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
  import { onMounted, ref, watch, computed } from 'vue';
  import type { Ref } from 'vue';
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';

  interface DropdownItem {
    label: string;
    value: string;
  }

  interface User {
    full_name: string;
    id: string;
  }

  const props = defineProps({
    caseId: String
  });

  const selectedPriority = ref('low');

  const localTitle = ref('');
  const localDescription = ref('');
  const localDueDate = ref('');
  const dropdownReporter: Ref<DropdownItem[]> = ref([]);
  const dropdownAssigned: Ref<DropdownItem[]> = ref([]);

  const fetchTeamMembers = async () => {
    if (props.caseId) {
      const caseDocRef = doc(db, "cases", props.caseId);
      const caseDocSnap = await getDoc(caseDocRef);
      let teamMembers: string[] = [];
      if (caseDocSnap.exists()) {
        const caseData = caseDocSnap.data();
        teamMembers = caseData.team_members || [];
      }

      // Fetch all users with roles 1, 2, or 3
      const usersQuery = query(collection(db, "users"), where("role", "in", [0, 1, 2]));
      const querySnapshot = await getDocs(usersQuery);
      
      // Filter the fetched users to include only those who are in the team_members array
      const filteredUsers = querySnapshot.docs
        .filter(doc => teamMembers.includes(doc.id))
        .map(doc => ({
          label: doc.data().full_name as string,
          value: doc.id
        }));

      // Update dropdown options
      dropdownReporter.value = filteredUsers;
      dropdownAssigned.value = filteredUsers;
    }
  };



  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);

  const dropdownReporterTitle = ref('Matthew Bowman');
  function onReporterChanged(item: DropdownItem) {
    dropdownReporterTitle.value = item.label;
  }

  const dropdownAssignedTitle = ref('Matthew Bowman');
  function onAssignedChanged(item: DropdownItem) {
    dropdownAssignedTitle.value = item.label;
  }

  const dropdownPriority = ref([
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]);
  const dropdownPriorityTitle = ref('Low');
  function onPriorityChanged(item: DropdownItem) {
    dropdownPriorityTitle.value = item.label;
  }

  onMounted(async () => {
    await fetchTeamMembers();
  });

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