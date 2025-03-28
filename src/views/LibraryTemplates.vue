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
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addDocument" text="Add new template"></VButton>
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
                  <VDropdown :title="'Filter by date'" :items="sortTime" @item-clicked="handleFilterTime" />
                </li>
                <!-- <li>
                  <VDropdown :title="'All templates'" :items="sortTime" @item-clicked="handleDropdownClick" />
                </li> -->
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="row fill-space mt-3">
      <div class="col-lg-12">
        
        <div class="row">
          <div class="col-md-4 col-lg-4" v-for="(template, index) in paginatedTemplates" :key="template.id">
            <FileTemplateCard
              :icon="'red'"
              :title="template.title"
              :createdDate="template.created_at"
              :creatorName="template.createdByDetails.name"
              @preview="handlePreview(index)"
              @create-new-document="handleCreateNewDocument(template.id)"
              @delete-template="handleDelete(template.id)"
              @edit-template="handleEdit(template.id)"
              @duplicate-template="handleDuplicate(template.id)"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- Delete Modal -->
    <VModal :show="showDeleteModal" :title="'Delete Template'" @update:show="showDeleteModal = $event">
      <VDeleteTemplate :title="'Delete File'" :fileId="selectedFileId" @close-modal="showDeleteModal = false" @delete-clicked="handleDeleteTemplate" />
    </VModal>

    <!-- Preview Modal -->
    <VModal :show="showPreviewModal" :title="previewTitle" @update:show="showPreviewModal = $event">
      <VPreviewTemplate :content="previewContent" :header="previewHeader" :footer="previewFooter" @close-modal="closePreviewModal" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader"
      :message="notificationMessage" :duration="7000" />

    <VNotification ref="notification2Ref" :type="notification2Type" :header="notification2Header"
      :message="notification2Message" :duration="7000" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { db } from '@/firebase.js';
import { doc, getDoc, query, collection, orderBy, limit, getDocs, addDoc, Timestamp  } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRoute } from 'vue-router';

import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';
import Search   from '@/modules/Navigation/Search.vue';
import VUser from '@/components/v-user/v-user.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
import TabsLibrary from '@/modules/TabsLibrary.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import FileTemplateCard from '@/modules/Library/FileTemplateCard/FileTemplateCard.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VDeleteTemplate from '@/modals/Library/v-delete-template/v-delete-template.vue';
import VPreviewTemplate from '@/modals/Library/v-preview-template/v-preview-template.vue';
import VNotification from '@/components/v-notification/VNotification.vue';

interface Template {
    id: string,
    content: string,
    created_at: string,
    footer: string,
    header: string,
    title: string,
    createdBy: string,
    createdByDetails: { 
      name: string;
      email: string;
      avatar: string;
    };
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
    VModal,
    VModalSmall,
    TabsLibrary,
    VDropdown,
    FileTemplateCard,
    VDeleteTemplate,
    VNotification,
    VPreviewTemplate,
  },
  data() {
    return {
      userName: 'Olivia Rhye',
      userEmail: 'olivia@untitledui.com',
      sortCases: [
        { label: 'Internal user' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
        { label: 'Admin' },
      ],
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      queryMessage: '',
    };

  },
  setup() {

    const templateRows = ref<Template[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const searchTerm = ref('');
    const selectedTimeFrame = ref('all');
    const isNotify = ref(false);
    const route = useRoute();
    const notification2Ref = ref<any>(null);
    const notification2Type = ref('');
    const notification2Header = ref('');
    const notification2Message = ref('');
    const showPreviewModal = ref(false);
    const previewTitle = ref('');
    const previewHeader = ref('');
    const previewFooter = ref('');
    const previewContent = ref('');
    

    const sortTime = ref([
      { label: 'All', value: 'all' },
      { label: 'Last year', value: 'lastYear' },
      { label: 'Last three months', value: 'lastThreeMonths' },
      { label: 'Last two months', value: 'lastTwoMonths' },
      { label: 'Last month', value: 'lastMonth' },
      { label: 'This week', value: 'thisWeek' },
    ]);

    const modalTitle = ref('');
    const showDeleteModal = ref(false);
    const selectedFileId = ref<string>('');

    const filteredTemplates = computed(() => {
      const now = new Date();
      return templateRows.value
        .filter(file => {
          // Filter by search term and status as before
          const matchesSearchTerm = String(file.title).toLowerCase().includes(searchTerm.value.toLowerCase());
          // const matchesStatus = selectedStatus.value === null || file.status === selectedStatus.value;

          // Determine if the invoice matches the selected time frame
          let matchesTimeFrame = true;
          if (selectedTimeFrame.value !== 'all') {
            const createdDate = new Date(file.created_at);
           
            switch (selectedTimeFrame.value) {
              case 'lastYear':
                matchesTimeFrame = createdDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
              case 'lastThreeMonths':
                matchesTimeFrame = createdDate >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                break;
              case 'lastTwoMonths':
                matchesTimeFrame = createdDate >= new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
                break;
              case 'lastMonth':
                matchesTimeFrame = createdDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
              case 'thisWeek':
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                matchesTimeFrame = createdDate >= oneWeekAgo;
                break;
            }
          }
          
          return matchesSearchTerm && matchesTimeFrame;
        });
    }); 


    const totalPages = computed(() => Math.ceil(filteredTemplates.value.length / itemsPerPage.value));
    const paginatedTemplates = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredTemplates.value.slice(start, start + itemsPerPage.value);
    });

    const fetchTemplates = async() => {
    
      const filesQuery = query(collection(db, "templates"), orderBy("created", "desc"), limit(10));
      const querySnapshot = await getDocs(filesQuery);
      const templates = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
      const Data = docSnapshot.data();

        let createdByDetails = {
          name: "Unknown User",
          email: "No Email",
          avatar: "Default Avatar URL"
        };
        
        if(Data.created_by)
        {
          const userDocRef = doc(db, "users", Data.created_by);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            createdByDetails = {
              name: userData.full_name || "Unknown User",
              email: userData.email || "No Email",
              avatar: userData.avatar || "Default Avatar URL"
            };
          }
        }

        // Date String
        let timestamp = Data.created.toDate().toLocaleString();
        let createdDate = new Date(timestamp);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let month = months[createdDate.getMonth()];
        let day = createdDate.getDate();
        let year = createdDate.getFullYear();
        let formattedDate = `${month} ${day}, ${year}`;

        return {
          id: docSnapshot.id,
          content: Data.content,
          created_at: formattedDate,
          footer: Data.footer,
          header: Data.header,
          title: Data.title,
          createdBy: Data.created_by,
          createdByDetails, // Add user details to the file object
        };
      }));

      templateRows.value = templates;
    }
    
    onMounted(fetchTemplates);    

    const updateSearchTerm = (value: string) => {
      searchTerm.value = value;
    };

    const handleFilterTime = (item: any) => {
      selectedTimeFrame.value = item.value;
    };

    const updatePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    const handleDelete = (id: any) => {

      // Show Modal
      modalTitle.value = 'Delete Template';
      selectedFileId.value = id; 
      showDeleteModal.value = true;

    }

    const handleDeleteTemplate = () => {
      const index = templateRows.value.findIndex(file => file.id === selectedFileId.value);
      if (index !== -1) {
        templateRows.value.splice(index, 1); // Remove the deleted record
      } else {
          console.warn("File not found in the documents array.");
      }
      showDeleteModal.value = false;
      triggerNotifications('success', 'Success', 'Template deleted successfully!');
    }

    const triggerNotifications = (type: string, header: string, message: string) => {
      notification2Type.value = type;
      notification2Header.value = header;
      notification2Message.value = message;
      
      if (notification2Ref.value !== null) {
        notification2Ref.value.showNotification();
      } else {
        console.error('Notification reference is null.');
      }
    }

    const handlePreview = (index: any) => {
      let data = filteredTemplates.value[index];
      previewTitle.value = data.title;
      previewContent.value = data.content;
      previewHeader.value = data.header;
      previewFooter.value = data.footer;
      showPreviewModal.value = true;
    }

    const closePreviewModal = () => {
      showPreviewModal.value = false;
    }

    return {
      templateRows,
      sortTime,
      searchTerm,
      selectedTimeFrame,
      paginatedTemplates,
      updateSearchTerm,
      handleFilterTime,
      modalTitle,
      showDeleteModal,
      selectedFileId,
      handleDelete,
      handleDeleteTemplate,
      fetchTemplates,
      totalPages,
      currentPage,
      updatePage,
      isNotify,
      triggerNotifications,
      notification2Ref,
      notification2Type,
      notification2Header,
      notification2Message,
      showPreviewModal,
      handlePreview,
      closePreviewModal,
      previewTitle,
      previewContent,
      previewHeader,
      previewFooter
    };
  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    addDocument() {
      this.$router.push('/new-library-template');
    },
    handleButtonClick() {
    },
    handleDropdownClick(item: any) { 
    },
    handleCreateNewDocument(id: any) {
      this.$router.push('/new-library-template-document/'+id);
    },
    handleEdit(id: string) {
      this.$router.push('/edit-library-template/'+id);
    },
    async handleDuplicate(id: string) {
      // Get the data
      try {
          // Get the document with the specified ID
          const docRef = doc(db, "templates", id);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
              // Document exists, you can access its data using docSnapshot.data()
              const templateData = docSnapshot.data();
              
              const auth = getAuth();
              const createdAt = Timestamp.now(); 
              let user = auth.currentUser;
              if(user)
              {
                var userId = user.uid;
                
                await addDoc(collection(db, "templates"), {
                  title: 'Duplicate of '+templateData.title,
                  content: templateData.content,
                  header: templateData.header,
                  footer: templateData.footer,
                  created_by: userId,
                  created: createdAt
                });
              }

              this.fetchTemplates();

              this.triggerNotification('success', 'Success!', 'Template duplicated successfully!');

              // Now you can use templateData in your application
              console.log("Template data:", templateData);
          } else {
              console.log("Document not found!");
              // Handle the case where the document doesn't exist
          }
      } catch (error) {
          console.error("Error fetching document:", error);
      }    
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
