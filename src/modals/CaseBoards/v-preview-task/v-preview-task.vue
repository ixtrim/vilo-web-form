<template>
  <div class="modal-body preview-task">

    <div class="row mb-2">
      <div class="col-lg-12">
        <h4>{{ localTitle }}</h4>
      </div>
    </div>

    <div class="row mb-4 preview-task__description">
      <div class="col-lg-12">
        <p>{{ localDescription }}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <div class="meta-info">
          <strong>Assigned to</strong>
          <p>{{ dropdownAssignedTitle }}</p>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="meta-info">
          <strong>Reported by</strong>
          <p>{{ dropdownReporterTitle }}</p>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-lg-6">
        <div class="meta-info">
          <strong>Priority</strong>
          <p>{{ dropdownPriorityTitle }}</p>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="meta-info">
          <strong>Due Date</strong>
          <p>{{ formattedDueDate }}</p>
        </div>
      </div>
    </div>

    <div class="row attachments" v-if="localAttachments && localAttachments.length > 0">
      <div class="col-lg-12">
        <strong>Attachments:</strong>
        <ul>
          <li v-for="(attachment, index) in localAttachments" :key="index">
            <a :href="attachment" download>
              <div class="img-frame" :style="{ backgroundImage: 'url(' + attachment + ')' }"></div>
              <span>Download file</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="modal-footer">
    <ul class="modal-footer__actions">
      <li></li>
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close preview"></v-button>
      </li>
      <li></li>
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
    caseId: String,
    taskId: String,
  });

  const emit = defineEmits(['close-modal', 'save-clicked', 'task-added']);

  const localTitle = ref('');
  const localDescription = ref('');
  const localUserAssigned = ref('');
  const localUserReporting = ref('');
  const localDueDate = ref(new Date());
  const localPriority = ref('');
  const localAttachments = ref('');

  
  const selectedPriority = ref('low');
  const selectedAssigned = ref('');
  const selectedReporter = ref('');
  const uploadedFiles: Ref<string[]> = ref([]);

  const dropdownReporter: Ref<DropdownItem[]> = ref([]);
  const dropdownAssigned: Ref<DropdownItem[]> = ref([]);

  const formattedDueDate = computed(() => {
    if (!localDueDate.value) return '';

    const date = new Date(localDueDate.value);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed.
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  });

  const taskDetails = ref({
    title: '',
    description: '',
    user_assigned: '',
    user_reporting: '',
    due_date: '',
    priority: '',
    attachments: '',
  });

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

  watch(() => props.taskId, async (newVal) => {
    if (newVal) {
      await fetchTaskDetails();
    }
  }, { immediate: true });

  async function fetchTaskDetails() {
      if (!props.taskId) {
        console.error("Task ID is undefined");
        return;
      }
      const taskRef = doc(db, "tasks", props.taskId);
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        const data = taskSnap.data();
        taskDetails.value = {
          title: data.title,
          description: data.description,
          user_assigned: data.user_assigned,
          user_reporting: data.user_reporting,
          due_date: data.due_date.toDate(),
          priority: data.priority,
          attachments: data.attachments,
        };
        localTitle.value = taskDetails.value.title;
        localDescription.value = taskDetails.value.description;
        localDueDate.value = new Date(taskDetails.value.due_date);
        localPriority.value = taskDetails.value.priority;
        localAttachments.value = taskDetails.value.attachments;
        initializeDropdownTitles();
      } else {
        console.error("Task does not exist!");
      }
  }

  function initializeDropdownTitles() {
      // Assuming you have a method to fetch a user's full name by their ID
      fetchUserName(taskDetails.value.user_assigned).then(name => {
          dropdownAssignedTitle.value = name;
      });
      fetchUserName(taskDetails.value.user_reporting).then(name => {
          dropdownReporterTitle.value = name;
      });
      // Set the priority dropdown title directly since it's a predefined list
      const priorityItem = dropdownPriority.value.find(item => item.value === taskDetails.value.priority);
      if (priorityItem) {
          dropdownPriorityTitle.value = priorityItem.label;
      }
  }

  // Example function to fetch a user's full name by their ID
  async function fetchUserName(userId: string) {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
          return userSnap.data().full_name; // Assuming the field is named 'full_name'
      }
      return 'Unknown'; // Fallback value
  }


  onMounted(async () => {
    await fetchTeamMembers();
  });

  function closeModal() {
    emit('close-modal');
  }

  async function saveAndClose() {
    if (!props.taskId) {
      console.error("Task ID is undefined");
      return;
    }
    // Ensure all required fields are filled
    if (!localTitle.value || !localDescription.value || !localDueDate.value) {
      console.error("Please fill in all required fields.");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", props.taskId);
      await updateDoc(taskRef, {
        title: localTitle.value,
        description: localDescription.value,
        user_assigned: dropdownAssigned.value.find(user => user.label === dropdownAssignedTitle.value)?.value || '',
        user_reporting: dropdownReporter.value.find(user => user.label === dropdownReporterTitle.value)?.value || '',
        due_date: Timestamp.fromDate(new Date(localDueDate.value)),
        priority: dropdownPriority.value.find(priority => priority.label === dropdownPriorityTitle.value)?.value || 'low',
        attachments: uploadedFiles.value,
      });
      emit('save-clicked');
      closeModal();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
@import url(./v-preview-task.scss);
</style>