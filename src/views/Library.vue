<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading mb-0">
          <h1>Library</h1>
          <p> Create and manage your team documents and templates.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addDocument" text="Add new document"></VButton>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__separator">
        &nbsp;
      </div>
    </div>

    <div class="row mt5">
      <div class="col-lg-12">
        <TabsLibrary />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__filters">

          <div class="row">
            <div class="col-lg-3">
              <div class="dashboard__filters">
                <Search />
              </div>
            </div>
            <div class="col-lg-6"></div>
            <div class="col-lg-3">
              <ul class="dashboard__actions">
                <li>
                  <VDropdown :title="'Sort by date'" :items="sortTime" @item-clicked="handleDropdownClick" />
                </li>
                <li>
                  <VDropdown :title="'All cases'" :items="sortTime" @item-clicked="handleDropdownClick" />
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">

        <div class="dashboard__table">

          <div class="dashboard__table__head">
            <div class="col col--checkbox">
              <input type="checkbox" />
            </div>
            <div class="col col--l-document">
              <h4>Document name</h4>
            </div>
            <div class="col col--l-status">
              <h4>Status</h4>
            </div>
            <div class="col col--l-uploaded">
              <h4>Date uploaded</h4>
            </div>
            <div class="col col--l-updated">
              <h4>Last updated</h4>
            </div>
            <div class="col col--l-created">
              <h4>Created by</h4>
            </div>
            <div class="col col--l-delete">
              &nbsp;
            </div>
            <div class="col col--l-edit">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__table__page">

            <div class="dashboard__table__page">
              <div class="dashboard__table__page__item" v-for="document in files" :key="document.id">
                <div class="col col--checkbox">
                  <input type="checkbox" :id="'checkbox-' + document.id" />
                  <label :for="'checkbox-' + document.id"></label>
                </div>
                <div class="col col--l-document">
                  <VFile :file-extension="document.extension" :file-name="document.document_name" :file-size="document.size" />
                </div>
                <div class="col col--l-status">
                  <VBadge :variant="document.badgeVariant" v-if="document.status == 1">Active</VBadge>
                  <VBadge :variant="document.badgeVariant" v-if="document.status == 0">Pending</VBadge>
                </div>
                <div class="col col--l-uploaded">
                  <p>{{ document.date_uploaded }}</p>
                </div>
                <div class="col col--l-updated">
                  <p>{{ document.last_updated }}</p>
                </div>
                <div class="col col--l-created">
                  <VUser :userName="document.createdByDetails.name" :userEmail="document.createdByDetails.email" :userAvatar="document.createdByDetails.avatar" />
                </div>
                <div class="col col--l-delete">
                  <VLink to="#" styled="secondary">Delete</VLink>
                </div>
                <div class="col col--l-edit">
                  <VLink to="#" @click="addDocument" styled="primary">Edit</VLink>
                </div>
              </div>
            </div>

          </div>

          <div class="dashboard__table__pagination">
            <div class="dashboard__table__pagination__prev">
              <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="prevPage" text="Previous"></v-button>
            </div>
            <div class="dashboard__table__pagination__pages">
              <v-pagination-list :total-pages="totalPages" @update:currentPage="updatePage" />
            </div>
            <div class="dashboard__table__pagination__next">
              <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="nextPage" text="Next"></v-button>
            </div>
          </div>

        </div>

      </div>
    </div>

    <VModalSmall :title="'My Modal Title'">
      <p>Content for the modal goes here...</p>
    </VModalSmall>

    
    <VModal :show="showAddDocumentModal || showEditDocumentModal" :title="modalAddDocumentTitle || modalEditDocumentTitle" @update:show="handleModalClose">
      <VAddDocument v-if="showAddDocumentModal" :title="modalAddDocumentTitle" @close-modal="showAddDocumentModal = false" @save-clicked="handleAddDocument" />
      <VEditDocument v-if="showEditDocumentModal" :title="modalEditDocumentTitle" @close-modal="showEditDocumentModal = false" @save-clicked="handleEditDocument" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';
import Search from '@/modules/Navigation/Search.vue';
import VUser from '@/components/v-user/v-user.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VFile from '@/components/v-file/VFile.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import TabsLibrary from '@/modules/TabsLibrary.vue';
import VNotification from '@/components/v-notification/VNotification.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VAddDocument from '@/modals/Library/v-add-document/v-add-document.vue';
import VEditDocument from '@/modals/Library/v-edit-document/v-edit-document.vue';

import { db } from '@/firebase.js';
import { doc, getDoc, query, collection, orderBy, limit, getDocs, where } from 'firebase/firestore';


interface File {
  id: string;
  document_name: string;
  extension: string;
  size: string;
  date_uploaded: string;
  last_updated: string;
  createdBy: string;
  createdByDetails: { // Add a new property to hold user details
    name: string;
    email: string;
    avatar: string;
  };
  status: number;
}

interface DropdownItem {
  label: string;
}

interface NotificationRef {
  showNotification: () => void;
}

export default defineComponent({
  components: {
    Search,
    VLink,
    VButton,
    VUser,
    VPaginationList,
    VModalSmall,
    VDropdown,
    VFile,
    VBadge,
    TabsLibrary,
    VModal,
    VAddDocument,
    VEditDocument,
  },
  data() {
    return {
      showAddDocumentModal: false,
      showEditDocumentModal: false,
      modalAddDocumentTitle: '',
      modalEditDocumentTitle: '',
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      userName: 'Olivia Rhye',
      userEmail: 'olivia@untitledui.com',
      sortTime: [
        { label: 'All' },
        { label: 'Last year' },
        { label: 'Last three months' },
        { label: 'Last month' },
        { label: 'This week' },
      ],
      sortCases: [
        { label: 'Internal user' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
        { label: 'Admin' },
      ],
      documents: [
        {
          id: 1,
          fileExtension: 'pdf',
          fileName: 'Mergers_Acquisitions_Report_2022.pdf',
          fileSize: '5 MB',
          badgeVariant: 'warning',
          status: 'Review',
          uploadedDate: 'Feb 12, 2023',
          updatedDate: 'Mar 5, 2023',
          userName: 'Adrian Stone',
          userEmail: 'adrian@lawfirm.com',
        },
        {
          id: 2,
          fileExtension: 'docx',
          fileName: 'Client_Contract_John_Doe.docx',
          fileSize: '2 MB',
          badgeVariant: 'success',
          status: 'Signed',
          uploadedDate: 'Jan 20, 2023',
          updatedDate: 'Jan 22, 2023',
          userName: 'Brenda Walsh',
          userEmail: 'brenda@lawfirm.com',
        },
        {
          id: 3,
          fileExtension: 'docx',
          fileName: 'Case_Expenses_2023.docx',
          fileSize: '1 MB',
          badgeVariant: 'primary',
          status: 'Updated',
          uploadedDate: 'Mar 1, 2023',
          updatedDate: 'Mar 1, 2023',
          userName: 'Carlos Diaz',
          userEmail: 'carlos@lawfirm.com',
        },
        {
          id: 4,
          fileExtension: 'doc',
          fileName: 'Litigation_Strategies_2023.doc',
          fileSize: '6 MB', 
          badgeVariant: 'light',
          status: 'Draft',
          uploadedDate: 'Apr 10, 2023',
          updatedDate: 'Apr 15, 2023',
          userName: 'Diana Reed',
          userEmail: 'diana@lawfirm.com',
        },
        {
          id: 5,
          fileExtension: 'pdf',
          fileName: 'Non_Disclosure_Agreement_Globex.pdf',
          fileSize: '2.5 MB', 
          badgeVariant: 'danger',
          status: 'Urgent',
          uploadedDate: 'Feb 28, 2023',
          updatedDate: 'Mar 2, 2023',
          userName: 'Evan Wright',
          userEmail: 'evan@lawfirm.com',
        },
        {
          id: 6,
          fileExtension: 'docx',
          fileName: 'Settlement_Agreement_Case_4321.docx',
          fileSize: '3 MB', 
          badgeVariant: 'success',
          status: 'Final',
          uploadedDate: 'Jan 5, 2023',
          updatedDate: 'Jan 6, 2023',
          userName: 'Fiona Grant',
          userEmail: 'fiona@lawfirm.com',
        },
        {
          id: 7,
          fileExtension: 'pdf',
          fileName: 'Meeting_Minutes_030323.pdf',
          fileSize: '512 KB', 
          badgeVariant: 'success',
          status: 'Completed',
          uploadedDate: 'Mar 3, 2023',
          updatedDate: 'Mar 4, 2023',
          userName: 'George Hanson',
          userEmail: 'george@lawfirm.com',
        }
      ],

      files: {},
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.documents.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.documents.slice(start, end);
    },
  },
  mounted() {
    this.fetchFiles();
  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    handleDropdownClick(item: DropdownItem) {
      console.log('Dropdown item clicked:', item);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    handleButtonClick() {
      // Logic for handling button click
      console.log('Button clicked');
    },
    updatePage(newPage: number) {
      this.currentPage = newPage;
    },
    addDocument() {
      this.$router.push('/library-document');
    },
    handleAddDocument() {
      this.showAddDocumentModal = false;
      this.triggerNotification('success', 'Changes saved', 'Case board modified successfully.');
    },
    openEditDocumentModal() {
      this.modalEditDocumentTitle = 'Create task';
      this.showEditDocumentModal = true;
    },
    handleEditDocument() {
      this.showEditDocumentModal = false;
      this.triggerNotification('success', 'You successfully created new task', 'Your task will be added to Vilo board.');
    },
    handleModalClose(value: boolean) {
      this.showAddDocumentModal = false;
      this.showEditDocumentModal = false;
    },
    async fetchFiles() {
      const filesQuery = query(collection(db, "files"), where("status", "==", 1), limit(8));
      const querySnapshot = await getDocs(filesQuery);
      const filesWithUserDetails = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const fileData = docSnapshot.data();
        const userDocRef = doc(db, "users", fileData.created_by);
        const userDocSnap = await getDoc(userDocRef);
        let createdByDetails = {
          name: "Unknown User",
          email: "No Email",
          avatar: "Default Avatar URL"
        };
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          createdByDetails = {
            name: userData.full_name || "Unknown User",
            email: userData.email || "No Email",
            avatar: userData.avatar || "Default Avatar URL"
          };
        }
        return {
          id: docSnapshot.id,
          document_name: fileData.document_name,
          extension: fileData.extension,
          size: "2MB", // Adjust as needed
          date_uploaded: fileData.date_uploaded.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          last_updated: fileData.last_updated.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          createdBy: fileData.created_by,
          createdByDetails, // Add user details to the file object
          status: fileData.status,
        };
      }));
      console.log(filesWithUserDetails[0])
      this.files = filesWithUserDetails;
      console.log(this.files);
    }
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
