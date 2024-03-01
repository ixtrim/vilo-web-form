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
          <h1>1 {{ caseDetails.title }}</h1>
          <p>2 {{ caseDetails.description }}</p>
          <VUserSmall userName="Phoenix Baker" />
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <v-button :block="false" size="sm" icon="left" icon-style="edit--2" styled="outlined" @click="openEditModal" text="Edit"></v-button>
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
        <Board @addTask="openAddTaskModal" />
      </div>
    </div>

    <VModal :show="showAddTaskModal || showEditModal" :title="modalAddTaskTitle || modalEditTitle" @update:show="handleModalClose">
      <VAddTask v-if="showAddTaskModal" :title="modalAddTaskTitle" @close-modal="showAddTaskModal = false" @save-clicked="handleAddTaskCase" />
      <VEditCaseBoard v-if="showEditModal" :title="modalEditTitle" @close-modal="showEditModal = false" @save-clicked="handleEditCase" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { doc, getDoc } from 'firebase/firestore';
  import type { DocumentData } from 'firebase/firestore';
  import { db } from '@/firebase.js';
  import VBreadcrumbs from '@/components/v-breadcrumbs/VBreadcrumbs.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import Search from '@/modules/Navigation/Search.vue';
  import Board from '@/modules/Board.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';
  import VModal from '@/components/v-modal/v-modal.vue';
  import VEditCaseBoard from '@/modals/CaseBoards/v-edit-case-board/v-edit-case-board.vue';
  import VAddTask from '@/modals/CaseBoards/v-add-task/v-add-task.vue';
  import VUserSmall from '@/components/v-user-small/v-user-small.vue';

  interface NotificationRef {
    showNotification: () => void;
  }

  export default defineComponent({
    components: {
      VBreadcrumbs,
      VButton,
      VModalSmall,
      VNotification,
      VModal,
      VEditCaseBoard,
      VAddTask,
      VUserSmall,
      VDropdown,
      Board,
      Search
    },
    setup() {
      const route = useRoute();
      const caseDetails = ref<DocumentData>({ title: '', description: '' });

      const fetchCaseDetails = async () => {
        const caseId = route.params.caseId as string;
        const docRef = doc(db, "cases", caseId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          caseDetails.value = {
            title: data.title || 'No Title', // Provide default values
            description: data.description || 'No Description',
          };
        } else {
          console.log("No such document!");
        }
      };

      onMounted(fetchCaseDetails);

      return {
        caseDetails,
      };
    },
    data() {
      return {
        showEditModal: false,
        showAddTaskModal: false,
        modalEditTitle: '',
        modalAddTaskTitle: '',
        notificationType: 'success',
        notificationHeader: 'Changes saved',
        notificationMessage: 'This account has been successfully edited.',
        breadcrumbs: [
          { text: 'Case boards', to: '/case-boards' },
          { text: 'Baker INC 0212' }
        ],
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
      };
    },
    methods: {
      triggerNotification(type: string, header: string, message: string) {
        this.notificationType = type;
        this.notificationHeader = header;
        this.notificationMessage = message;
        (this.$refs.notificationRef as NotificationRef).showNotification();
      },
      openEditModal() {
        this.modalEditTitle = 'Edit case board';
        this.showEditModal = true;
      },
      handleEditCase() {
        this.showEditModal = false;
        this.triggerNotification('success', 'Changes saved', 'Case board modified successfully.');
      },
      openAddTaskModal() {
        this.modalAddTaskTitle = 'Create task';
        this.showAddTaskModal = true;
      },
      handleAddTaskCase() {
        this.showAddTaskModal = false;
        this.triggerNotification('success', 'You successfully created new task', 'Your task will be added to Vilo board.');
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
