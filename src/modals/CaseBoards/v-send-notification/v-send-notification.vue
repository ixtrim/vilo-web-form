<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Status" 
          placeholder="Sale completed" 
          v-model="notificationStatus"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VTextarea 
          label="Notes" 
          placeholder="e.g. We have completed the bill of sale on June 8, 2024" 
          v-model="localDescription"
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
        <v-button :block="false" size="md" styled="Primary" @click="saveAndClose" text="Send"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { db } from '@/firebase.js';
  import { DocumentReference, addDoc, doc, getDoc, updateDoc, collection, getDocs, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
  import { defineComponent, onMounted, ref, watch, computed } from 'vue';
  import type { Ref } from 'vue';
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import VMultipleUploader from '@/components/v-multiple-uploader/VMultipleUploader.vue';
  import '@vuepic/vue-datepicker/dist/main.css';

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

  const emit = defineEmits(['close-modal', 'save-clicked', 'task-added']);

  const notificationStatus = ref('');
  const localDescription = ref('');
  const localDueDate = ref(new Date());
  const selectedPriority = ref('low');
  const selectedAssigned = ref('');
  const selectedReporter = ref('');
  const uploadedFiles: Ref<string[]> = ref([]);

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

  function handleFilesUploaded(url: string) {
    uploadedFiles.value.push(url);
  }

  onMounted(async () => {
    await fetchTeamMembers();
  });

  function closeModal() {
    emit('close-modal');
  }

  async function saveAndClose(event: any) {
    // Ensure all required fields are filled
    if (!notificationStatus.value || !localDescription.value || !localDueDate.value) {
      return;
    }
    event.stopPropagation();
    try {
      const newTask = {
        title: notificationStatus.value,
        description: localDescription.value,
        user_assigned: dropdownAssigned.value.find(user => user.label === dropdownAssignedTitle.value)?.value || '',
        user_reporting: dropdownReporter.value.find(user => user.label === dropdownReporterTitle.value)?.value || '',
        case: props.caseId,
        due_date: Timestamp.fromDate(new Date(localDueDate.value)),
        created_date: Timestamp.fromDate(new Date()),
        status: 0,
        priority: dropdownPriority.value.find(priority => priority.label === dropdownPriorityTitle.value)?.value || 'low',
        attachments: uploadedFiles.value,
      };

      await addDoc(collection(db, "tasks"), newTask);
      emit('save-clicked');
      closeModal();
    } catch (error) {
      console.error("Failed to add new task:", error);
    }
  }
</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>