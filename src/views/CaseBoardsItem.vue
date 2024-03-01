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
      const caseDetails = ref<DocumentData>({ title: '', description: '', client_id: '' });
      const userDetails = ref<DocumentData>({ full_name: '', avatar: '' });

      const fetchCaseDetails = async () => {
        const caseId = route.params.caseId as string;
        const docRef = doc(db, "cases", caseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          caseDetails.value = {
            title: data.title || 'No Title',
            description: data.description || 'No Description',
            client_id: data.client_id || '',
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

      const breadcrumbs = computed(() => [
        { text: 'Case boards', to: '/case-boards' },
        { text: caseDetails.value.title || 'Loading case...' }
      ]);

      return {
        caseDetails,
        breadcrumbs,
        userDetails,
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
