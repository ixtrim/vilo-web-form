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
                <Search :value="searchTerm" @update-search="updateSearchTerm" />
              </div>
            </div>
            <div class="col-lg-6"></div>
            <div class="col-lg-3">
              <ul class="dashboard__actions">
                <li>
                  <VDropdown :title="'Sort by date'" :items="sortTime" @item-clicked="handleFilterTime" />
                </li>
                <li>
                  <VDropdown :title="'All cases'" :items="sortStatus" @item-clicked="handleFilterStatus" />
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
              <div class="dashboard__table__page__item" v-for="file in paginatedFiles" :key="file.id">
                <div class="col col--checkbox">
                  <input type="checkbox" :id="'checkbox-' + file.id" />
                  <label :for="'checkbox-' + file.id"></label>
                </div>
                <div class="col col--l-document">
                  <VFile :file-extension="file.extension" :file-name="file.document_name" :file-size="file.size" />
                </div>
                <div class="col col--l-status">
                  <VBadge :variant="'primary'" v-if="file.status == 0">Draft</VBadge>
                  <VBadge :variant="'primary'" v-if="file.status == 1">Pending</VBadge>
                  <VBadge :variant="'primary'" v-if="file.status == 2">Signed</VBadge>
                </div>
                <div class="col col--l-uploaded">
                  <p>{{ file.date_uploaded }}</p>
                </div>
                <div class="col col--l-updated">
                  <p>{{ file.last_updated }}</p>
                </div>
                <div class="col col--l-created">
                  <VUser :userName="file.createdByDetails.name" :userEmail="file.createdByDetails.email" :userAvatar="file.createdByDetails.avatar" />
                </div>
                <div class="col col--l-delete">
                  <!-- <VLink to="#" styled="secondary" @click="deleteDocumentAction(file)">Delete</VLink> -->
                  <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="deleteDocumentAction(file)" text=""></VButton>
                </div>
                <div class="col col--l-edit">
                  <!-- <VLink to="#" @click="addDocument" styled="primary">Edit</VLink> -->
                  <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="editDocument(file.id)" text=""></VButton>
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

    <VModal :show="showDeleteModal" :title="'Delete File'" @update:show="showDeleteModal = $event">
      <VDeleteDocument :title="'Delete File'" :fileId="selectedFileId" :files="files" @close-modal="showDeleteModal = false" @delete-clicked="handleDeleteDocument" />
    </VModal>

    <!-- :type="notificationType" 
    :header="notificationHeader" 
    :message="notificationMessage"  -->
    <!-- <VNotification 
      ref="notificationRef" 
      :duration="7000"
      @save-clicked="handleDeleteDocument"
      /> -->

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader"
      :message="notificationMessage" :duration="7000" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed,onMounted, watch } from 'vue';
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
import VDeleteDocument from '@/modals/Library/v-delete-document/v-delete-document.vue';

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
    VDeleteDocument,
    VNotification
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
      sortCases: [
        { label: 'Internal user' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
        { label: 'Admin' },
      ],
    };
  },
  setup() {


    const files = ref<File[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const searchTerm = ref('');
    const selectedTimeFrame = ref('all');
    const selectedStatus = ref(null);
    const modalTitle = ref('');
    const showDeleteModal = ref(false);

    const selectedFileId = ref<string>('');

    const sortTime = ref([
      { label: 'All', value: 'all' },
      { label: 'Last year', value: 'lastYear' },
      { label: 'Last three months', value: 'lastThreeMonths' },
      { label: 'Last two months', value: 'lastTwoMonths' },
      { label: 'Last month', value: 'lastMonth' },
      { label: 'This week', value: 'thisWeek' },
    ]);

    const sortStatus = ref([
      { label: 'All', value: null },
      { label: 'Draft', value: 0 },
      { label: 'Pending', value: 1 },
      { label: 'Signed', value: 2 },
    ]);

    const deleteDocumentAction = (file: File) => {
      modalTitle.value = 'Edit user';
      selectedFileId.value = file.id; 
      showDeleteModal.value = true;
    };

    const filteredFiles = computed(() => {
      const now = new Date();
      return files.value
        .filter(file => {

          // Filter by search term and status as before
          const matchesSearchTerm = String(file.document_name).toLowerCase().includes(searchTerm.value.toLowerCase());
          const matchesStatus = selectedStatus.value === null || file.status === selectedStatus.value;

          // Determine if the invoice matches the selected time frame
          let matchesTimeFrame = true;
          if (selectedTimeFrame.value !== 'all') {
            const invoiceDate = new Date(file.date_uploaded);

            switch (selectedTimeFrame.value) {
              case 'lastYear':
                matchesTimeFrame = invoiceDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
              case 'lastThreeMonths':
                matchesTimeFrame = invoiceDate >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                break;
              case 'lastTwoMonths':
                matchesTimeFrame = invoiceDate >= new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
                break;
              case 'lastMonth':
                matchesTimeFrame = invoiceDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
              case 'thisWeek':
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                matchesTimeFrame = invoiceDate >= oneWeekAgo;
                break;
            }
          }
          
          return matchesSearchTerm && matchesStatus && matchesTimeFrame;
        });
    });

    const totalPages = computed(() => Math.ceil(filteredFiles.value.length / itemsPerPage.value));
    const paginatedFiles = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredFiles.value.slice(start, start + itemsPerPage.value);
    });

    const fetchFiles = async() => {
      const filesQuery = query(collection(db, "files"), where("status", "==", 1), limit(10));
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

      files.value = filesWithUserDetails;
    }
    
    onMounted(fetchFiles);

    const updateSearchTerm = (value: string) => {
      searchTerm.value = value;
    };
    
    const nextPage = () => {
      if (currentPage.value * itemsPerPage.value < files.value.length) {
        currentPage.value++;
      }
    };
  
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
    const updatePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    const handleFilterTime = (item: any) => {
      selectedTimeFrame.value = item.value;
    };

    const handleFilterStatus = (item: any) => {
      selectedStatus.value = item.value;
    };


    watch([selectedStatus, selectedTimeFrame, searchTerm], () => {
      currentPage.value = 1;
    }, { deep: true });


    return {
      files,
      paginatedFiles,
      nextPage,
      prevPage,
      totalPages,
      updatePage,
      searchTerm,
      updateSearchTerm,
      sortTime,
      handleFilterTime,
      sortStatus,
      handleFilterStatus,
      showDeleteModal,
      deleteDocumentAction,
      selectedFileId,
    }

  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;

      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    handleButtonClick() {
      // Logic for handling button click
      console.log('Button clicked');
    },
    addDocument() {
      this.$router.push('/library-document');
    },
    handleAddDocument() {
      this.showAddDocumentModal = false;
      this.triggerNotification('success', 'Changes saved', 'Case board modified successfully.');
    },
    handleDeleteDocument(){
      const index = this.files.findIndex(file => file.id === this.selectedFileId);
      if (index !== -1) {
          this.files.splice(index, 1); // Remove the deleted record
      } else {
          console.warn("File not found in the documents array.");
      }
      // this.showDeleteModal = false;
      this.triggerNotification('success', 'Document deleted', 'Document deleted successfully.');
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
    getMessageFromURL() {
      // Accessing message parameter from URL
      let query = this.$route.query.message;
      if(typeof query === 'string')
      {
        this.triggerNotification('success', 'Success!', query);

        const currentPath = this.$route.path;
        const newUrl = `${currentPath}`;
        history.replaceState({}, '', newUrl);
      }
    },
    editDocument(id: any){
      this.$router.push('/edit-library-document/'+id);
    }
  },
  mounted() {
    // Call the method to get the message from the URL when the component is mounted
    this.getMessageFromURL();
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
