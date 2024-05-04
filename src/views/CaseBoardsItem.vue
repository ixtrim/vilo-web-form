<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-12">
        <VBreadcrumbs :breadcrumbItems="breadcrumbs" />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading">
          <h1>{{ caseDetails.title }}</h1>
          <p>{{ caseDetails.description }}</p>
          <VUserSmall v-if="userDetails.full_name" :userName="userDetails.full_name" :userAvatar="userDetails.avatar" />
          <VUserSmall v-else userName="General case board" userAvatar="https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/vilo_app%2Fvilo.svg?alt=media&token=5a714643-100b-4673-a24a-ca52bbf166f6" />
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="send-notification-white" styled="primary" @click="openAddTaskModal" text="Send notification"></VButton>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__line mt-0">
        <hr />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-3">
        <Search />
      </div>
      <div class="col-lg-3">
        
      </div>
      <div class="col-lg-6">
        <ul class="dashboard__actions">
          <li>
            <VDropdown :title="'Sort by priority'" :items="sortPriority" @item-clicked="handleDropdownClick" />
          </li>
          <li>
            <VDropdown :title="'All Tasks'" :items="sortTasks" @item-clicked="handleDropdownClick" />
          </li>
          <li>
            <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="openAddTaskModal" text="Add new task"></VButton>
          </li>
        </ul>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12"> 
        <Board ref="boardComponent" :caseId="caseDetails.id" @addTask="openAddTaskModal" @editTask="openEditTaskModal" @previewTask="openPreviewTaskModal" />
      </div>
    </div>
    <VModal :show="showAddTaskModal || showEditTaskModal  || showPreviewTaskModal || showEditModal" :title="modalAddTaskTitle || modalEditTaskTitle || modalEditTitle" @update:show="handleModalClose">
      <VAddTask v-if="showAddTaskModal" :title="modalAddTaskTitle" :caseId="caseDetails.id" @close-modal="showAddTaskModal = false" @save-clicked="handleAddTask" />
      <VEditTask v-if="showEditTaskModal" :title="modalEditTaskTitle" :caseId="caseDetails.id" :taskId="currentTaskId" @close-modal="showEditTaskModal = false" @save-clicked="handleEditTask" />
      <VPreviewTask v-if="showPreviewTaskModal" :title="modalPreviewTaskTitle" :caseId="caseDetails.id" :taskId="currentTaskId" @close-modal="showPreviewTaskModal = false" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '@/firebase.js';
import VBreadcrumbs from '@/components/v-breadcrumbs/VBreadcrumbs.vue';
import VButton from '@/components/v-button/VButton.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import Search from '@/modules/Navigation/Search.vue';
import Board from '@/modules/Board.vue';
import VNotification from '@/components/v-notification/VNotification.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VAddTask from '@/modals/CaseBoards/v-add-task/v-add-task.vue';
import VEditTask from '@/modals/CaseBoards/v-edit-task/v-edit-task.vue';
import VPreviewTask from '@/modals/CaseBoards/v-preview-task/v-preview-task.vue';
import VUserSmall from '@/components/v-user-small/v-user-small.vue';

export default defineComponent({
  components: {
    VBreadcrumbs,
    VButton,
    VNotification,
    VModal,
    VAddTask,
    VEditTask,
    VPreviewTask,
    VUserSmall,
    VDropdown,
    Board,
    Search
  },
  setup() {
    const route = useRoute();
    const caseDetails = ref<DocumentData>({ title: '', description: '', client_id: '' });
    const userDetails = ref<DocumentData>({ full_name: '', avatar: '' });

    const breadcrumbs = computed(() => [
      { text: 'Case boards', to: '/case-boards' },
      { text: caseDetails.value.title || 'Loading case...' }
    ]);

    const fetchCaseDetails = async () => {
      const caseId = route.params.caseId as string;
      const docRef = doc(db, "cases", caseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        caseDetails.value = {
          id: docSnap.id,
          title: data.title || 'No Title',
          description: data.description || 'No Description',
          client_id: data.client_id || '',
          team_members: data.team_members || '',
        };
        // Fetch user details if client_id is available
        if (caseDetails.value.client_id) {
          const userRef = doc(db, "users", caseDetails.value.client_id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            userDetails.value = userSnap.data();
          }
        }
      } else {
        console.log("No such document!");
      }
    };

    onMounted(fetchCaseDetails);

    return {
      caseDetails,
      breadcrumbs,
      userDetails,
      fetchCaseDetails,
    };
  },
  data() {
    return {
      showEditModal: false,
      showAddTaskModal: false,
      showEditTaskModal: false,
      showPreviewTaskModal: false,
      modalEditTitle: '',
      modalAddTaskTitle: '',
      modalEditTaskTitle: '',
      modalPreviewTaskTitle: '',
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      sortPriority: [
        { label: 'All' },
        { label: 'High Priority' },
        { label: 'Medium Priority' },
        { label: 'Low Priority' },
      ],
      sortTasks: [
        { label: 'All Tasks' },
        { label: 'My Tasks' },
      ],
      editableCaseDetails: {},
      currentTaskId: '',
    };
  },
  methods: {
    async fetchCaseDetails() {
      const route = useRoute();
      const caseId = route.params.caseId as string;
      const docRef = doc(db, "cases", caseId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        this.caseDetails = {
          title: data.title || 'No Title',
          description: data.description || 'No Description',
          client_id: data.client_id || '',
          team_members: data.team_members || '',
        };
        // Fetch user details if client_id is available
        if (this.caseDetails.client_id) {
          const userRef = doc(db, "users", this.caseDetails.client_id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            this.userDetails = userSnap.data();
          }
        }
      } else {
        console.log("No such document!");
      }
    },
    async updateCaseInFirestore(updatedCase: DocumentData) {
      const caseRef = doc(db, "cases", updatedCase.id);
      await updateDoc(caseRef, updatedCase);
    },
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as any).showNotification();
    },
    async handleEditCase(updatedCase: any) {
      this.showEditModal = false;
      this.triggerNotification('success', 'Case Updated', 'The case has been successfully updated.');
    },
    openAddTaskModal() {
      this.modalAddTaskTitle = 'Create task';
      this.showAddTaskModal = true;
    },
    handleAddTask() {
      this.showAddTaskModal = false;
      (this.$refs.boardComponent as any).fetchTasks();
      this.triggerNotification('success', 'You successfully created new task', 'Your task will be added to Vilo board.');
    },
    openEditTaskModal(taskId: string) {
      this.currentTaskId = taskId;
      this.modalEditTaskTitle = 'Edit task';
      this.showEditTaskModal = true;
    },
    openPreviewTaskModal(taskId: string) {
      this.currentTaskId = taskId;
      this.modalEditTaskTitle = 'Task details';
      this.showPreviewTaskModal = true;
    },
    handleEditTask() {
      this.showEditTaskModal = false;
      (this.$refs.boardComponent as any).fetchTasks();
      this.triggerNotification('success', 'You successfully edited task', 'Your task will be added to Vilo board.');
    },
    handleModalClose(value: boolean) {
      this.showEditModal = false;
      this.showAddTaskModal = false;
    },
    handleDropdownClick() {
    },
    handleButtonClick() {
    },
  },
});
</script>

<style>
@import url(./styles/dashboard.scss);
</style>
