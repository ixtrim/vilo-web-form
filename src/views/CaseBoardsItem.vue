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
          <h1>Vilo Board</h1>
          <p>Time tracking, invoicing and expenses.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <v-button :block="false" size="sm" icon="left" icon-style="edit--2" styled="outlined" @click="openEditModal" text="Edit"></v-button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        
      </div>
    </div>

    <VModal :show="showEditModal" :title="modalEditTitle" @update:show="handleModalClose">
      <VEditCaseBoard v-if="showEditModal" :title="modalEditTitle" @close-modal="showEditModal = false" @save-clicked="handleEditCase" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import VBreadcrumbs from '@/components/v-breadcrumbs/VBreadcrumbs.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
  import Board from '@/modules/Board.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';
  import VModal from '@/components/v-modal/v-modal.vue';
  import VEditCaseBoard from '@/modals/CaseBoards/v-edit-case-board/v-edit-case-board.vue';

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
      Board
    },
    data() {
      return {
        showEditModal: false,
        modalEditTitle: '',
        notificationType: 'success',
        notificationHeader: 'Changes saved',
        notificationMessage: 'This account has been successfully edited.',
        breadcrumbs: [
          { text: 'Case boards', to: '/case-boards' },
          { text: 'Example Vilo Board' }
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
      handleModalClose(value: boolean) {
        this.showEditModal = false;
      },
    },
  });
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
