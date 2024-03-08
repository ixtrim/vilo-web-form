<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-9">
        <div class="dashboard__heading mb-0">
          <h1>Invoices</h1>
          <p>Create and manage your team documents and templates.</p>
        </div>
      </div>
      <div class="col-lg-3 align-right">
        <ul class="dashboard__actions" v-if="notClient">
          <li>
            <VLink 
              to="/invoices-reports" 
              isRouteLink 
              styled="alternate"
              :block="true"
            >Reports</VLink>
          </li>
          <li>
            <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="openAddInvoiceModal" text="Add new invoice"></VButton>
          </li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__separator">
        &nbsp;
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
                <li>
                  <VDropdown :title="'All invoices'" :items="sortStatus" @item-clicked="handleFilterStatus" />
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">

        <div class="dashboard__table mt-2">

          <div class="dashboard__table__head">
            <div class="col col--inv-invoice">
              <ul>
                <li>
                  <h4>Invoice</h4>
                </li>
              </ul>
            </div>
            <div class="col col--inv-case">
              <h4>Case</h4>
            </div>
            <div class="col col--inv-date">
              <h4>Due date</h4>
            </div>
            <div class="col col--inv-status">
              <h4>Status</h4>
            </div>
            <div class="col col--inv-customer">
              <h4>Customer</h4>
            </div>
            <div class="col col--inv-reminder">
              <h4>Reminder</h4>
            </div>
            <div class="col col--inv-action" v-if="notClient">
              &nbsp;
            </div>
            <div class="col col--inv-action" v-if="notClient">
              &nbsp;
            </div>
            <div class="col col--inv-action">
              &nbsp;
            </div>
            <div class="col col--inv-action">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__table__page">
            <div 
              class="dashboard__table__page__item"
              v-for="invoice in paginatedInvoices" :key="invoice.id"
            >
              <div class="col col--inv-invoice">
                <h5>{{ invoice.number }}</h5>
              </div>
              <div class="col col--inv-case">
                <VLink :to="`/case-board/${invoice.case}`" isRouteLink styled="secondary" icon="left" icon-style="tag">{{ invoice.caseTitle }}</VLink>
              </div>
              <div class="col col--inv-date">
                <p>{{ formatDate(invoice.due_date) }}</p>
              </div>
              <div class="col col--inv-status">
                <VStatus :variant="statusText(invoice.status).variant.toLowerCase()">
                  {{ statusText(invoice.status).text }}
                </VStatus>
              </div>
              <div class="col col--inv-customer">
                <VUser :userName="invoice.clientName" :userEmail="truncateEmail(invoice.clientEmail)" :userAvatar="invoice.clientAvatar" />
              </div>
              <div class="col col--inv-reminder">
                
              </div>
              <!-- Assuming you have different methods for different buttons -->
              <div class="col col--inv-action">
                <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" @click="openPreviewInvoiceModal(invoice)" text=""></VButton>
              </div>
              <div class="col col--inv-action">
                <VButton :block="false" size="sm" icon="left" icon-style="download" styled="simple-icon" @click="handleDownloadClick" text=""></VButton>
              </div>
              <div class="col col--inv-action" v-if="notClient">
                <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="handleDeleteClick" text=""></VButton>
              </div>
              <div class="col col--inv-action" v-if="notClient">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openAddInvoiceModal" text=""></VButton>
              </div>
            </div>

          </div>

          </div>

          <div class="dashboard__pagination-below-table">
            <div class="dashboard__pagination-below-table__prev">
              <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="changePage(-1, $event)" text="Previous" v-if="currentPage > 1"></v-button>
            </div>
            <div class="dashboard__pagination-below-table__pages">
              <v-pagination-list :total-pages="totalPages" :initial-page="currentPage" @update:currentPage="updatePage" />
            </div>
            <div class="dashboard__pagination-below-table__next">
              <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="changePage(1, $event)" text="Next" v-if="currentPage < totalPages"></v-button>
            </div>
          </div>

      </div>
    </div>

    <VModal :show="showAddInvoiceModal || showPreviewInvoiceModal" :title="modalAddInvoiceTitle || modalPreviewInvoiceTitle" @update:show="handleModalClose">
      <VAddInvoice v-if="showAddInvoiceModal" :title="modalAddInvoiceTitle" @close-modal="showAddInvoiceModal = false" @save-clicked="handleAddInvoiceCase" />
      <VPreviewInvoice v-if="showPreviewInvoiceModal && currentInvoice" :title="modalPreviewInvoiceTitle" :invoice="currentInvoice" :userRole="userRole" :generalSettings="generalSettings" :billingSettings="billingSettings" @close-modal="showPreviewInvoiceModal = false" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { db } from '@/firebase.js';
import { collection, query, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import VStatus from '@/components/v-status/VStatus.vue';
import VButton from '@/components/v-button/VButton.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VAddInvoice from '@/modals/Invoices/v-add-invoice/v-add-invoice.vue';
import VPreviewInvoice from '@/modals/Invoices/v-preview-invoice/v-preview-invoice.vue';
import VUser from '@/components/v-user/v-user.vue';
import VLink from '@/components/v-link/VLink.vue';
import Search from '@/modules/Navigation/Search.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import { useUserStore } from '@/stores/userStore';

interface Invoice {
  id: string;
  number: string;
  case: string;
  due_date: Timestamp;
  status: number;
  client_id: string;
  clientName: string;
  clientEmail: string;
  clientAvatar: string;
  caseTitle: string;
}

export default defineComponent({
  components: {
    VButton,
    VModal,
    VAddInvoice,
    VPreviewInvoice,
    VStatus,
    VUser,
    VLink,
    Search,
    VPaginationList,
    VDropdown,
  },
  setup() {
    const invoices = ref<Invoice[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const searchTerm = ref('');
    const showAddInvoiceModal = ref(false);
    const showPreviewInvoiceModal = ref(false);
    const modalAddInvoiceTitle = ref('');
    const modalPreviewInvoiceTitle = ref('');
    const currentInvoice = ref<Invoice | null>(null);

    const billingSettings = ref({});
    const fetchBillingSettings = async () => {
      const billingDocRef = doc(db, "settings", "billing");
      const billingDocSnap = await getDoc(billingDocRef);

      if (billingDocSnap.exists()) {
        billingSettings.value = billingDocSnap.data();
      } else {
        console.log("No such document!");
      }
    };
    const generalSettings = ref({});
    const fetchGeneralSettings = async () => {
      const generalDocRef = doc(db, "settings", "general");
      const generalDocSnap = await getDoc(generalDocRef);

      if (generalDocSnap.exists()) {
        generalSettings.value = generalDocSnap.data();
      } else {
        console.log("No such document!");
      }
    };

    const { user } = useUserStore();
    const userRole = computed(() => user.value?.role ?? 0);
    const notClient = computed(() => {
      return [0, 1, 2].includes(user.value?.role ?? 0);
    });

    const sortTime = ref([
      { label: 'All', value: 'all' },
      { label: 'Last year', value: 'lastYear' },
      { label: 'Last three months', value: 'lastThreeMonths' },
      { label: 'Last two months', value: 'lastTwoMonths' },
      { label: 'Last month', value: 'lastMonth' },
      { label: 'This week', value: 'thisWeek' },
    ]);
    const selectedTimeFrame = ref('all');

    const notificationType = ref('success');
    const notificationHeader = ref('Changes saved');
    const notificationMessage = ref('This account has been successfully edited.');

    const truncateEmail = (email: string) => email.length > 35 ? `${email.substring(0, 32)}...` : email;

    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const invoicePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const invoiceData = docSnapshot.data() as any; // Use `as any` temporarily to bypass TypeScript checks
        // Assuming invoiceData contains all required fields directly
        const clientDocRef = doc(db, "users", invoiceData.client_id);
        const clientDocSnap = await getDoc(clientDocRef);
        let clientName = "Unknown";
        let clientEmail = "No Email";
        let clientAvatar = "Default Avatar URL";

        if (clientDocSnap.exists()) {
          const clientData = clientDocSnap.data();
          clientName = clientData.full_name || "Unknown";
          clientEmail = clientData.email || "No Email";
          clientAvatar = clientData.avatar || "Default Avatar URL";
        }

        const caseDocRef = doc(db, "cases", invoiceData.case);
        const caseDocSnap = await getDoc(caseDocRef);
        let caseTitle = "Unknown Case";

        if (caseDocSnap.exists()) {
          caseTitle = caseDocSnap.data().title || "Unknown Case";
        }

        // Ensure all required properties are included
        return {
          id: docSnapshot.id,
          number: invoiceData.number, // Ensure this exists in your document
          case: invoiceData.case, // Ensure this exists in your document
          due_date: invoiceData.due_date, // Ensure this exists in your document and is a Timestamp
          status: invoiceData.status, // Ensure this is a number
          client_id: invoiceData.client_id, // Ensure this exists in your document
          clientName,
          clientEmail,
          clientAvatar,
          caseTitle,
        };
      });

      invoices.value = await Promise.all(invoicePromises);
    };

    const sortStatus = ref([
      { label: 'All', value: null },
      { label: 'Draft', value: 0 },
      { label: 'Paid', value: 2 },
      { label: 'Cancelled', value: 3 },
      { label: 'Refunded', value: 4 },
    ]);
    const selectedStatus = ref(null);

    const filteredInvoices = computed(() => {
      const now = new Date();
      return invoices.value
        .filter(invoice => {
          // Filter by search term and status as before
          const matchesSearchTerm = invoice.number.toLowerCase().includes(searchTerm.value.toLowerCase()) || invoice.client_id.toLowerCase().includes(searchTerm.value.toLowerCase());
          const matchesStatus = selectedStatus.value === null || invoice.status === selectedStatus.value;
          
          // Determine if the invoice matches the selected time frame
          let matchesTimeFrame = true;
          if (selectedTimeFrame.value !== 'all') {
            const invoiceDate = invoice.due_date.toDate();
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

    const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage.value));
    const paginatedInvoices = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredInvoices.value.slice(start, start + itemsPerPage.value);
    });

    const openAddInvoiceModal = () => showAddInvoiceModal.value = true;

    const openPreviewInvoiceModal = (invoice: Invoice) => {
      currentInvoice.value = invoice;
      showPreviewInvoiceModal.value = true;
    };

    const handleModalClose = () => {
      showAddInvoiceModal.value = false;
      showPreviewInvoiceModal.value = false;
    };

    const updateSearchTerm = (value: string) => {
      searchTerm.value = value;
    };

    const handleFilterTime = (item: any) => {
      selectedTimeFrame.value = item.value;
    };

    const handleFilterStatus = (item: any) => {
      selectedStatus.value = item.value;
    };

    const handleDropdownClick = () => {
      // Implement dropdown click handling
    };

    const handleDownloadClick = () => {
      // Implement download click handling
    };

    const handleDeleteClick = () => {
      // Implement delete click handling
    };

    const changePage = (step: number, event: Event) => {
      const newPage = currentPage.value + step;
      if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage;
      }
      event.preventDefault();
    };

    watch([selectedStatus, selectedTimeFrame, searchTerm], () => {
      currentPage.value = 1;
    }, { deep: true });

    const updatePage = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage;
      }
    };

    const handleAddInvoiceCase = () => {
      // Implement add invoice case handling
    };

    const handlePreviewInvoiceCase = () => {
      // Implement preview invoice case handling
    };

    onMounted(() => {
      fetchInvoices();
      fetchBillingSettings();
      fetchGeneralSettings();
    });

    return {
      invoices,
      currentPage,
      itemsPerPage,
      paginatedInvoices,
      totalPages,
      searchTerm,
      truncateEmail,
      showAddInvoiceModal,
      showPreviewInvoiceModal,
      modalAddInvoiceTitle,
      modalPreviewInvoiceTitle,
      openAddInvoiceModal,
      currentInvoice,
      openPreviewInvoiceModal,
      handleModalClose,
      handleDropdownClick,
      handleDownloadClick,
      handleDeleteClick,
      handleFilterTime,
      handleFilterStatus,
      changePage,
      updatePage,
      handleAddInvoiceCase,
      handlePreviewInvoiceCase,
      sortTime,
      sortStatus,
      notificationType,
      notificationHeader,
      notificationMessage,
      updateSearchTerm,
      billingSettings,
      generalSettings,
      notClient,
      userRole,
    };
  },
  methods: {
    formatDate(timestamp: Timestamp) {
      return timestamp ? timestamp.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
    },
    statusText(status: number) {
      const statusMap: { [key: number]: { text: string; variant: string } } = {
        0: { text: 'Draft', variant: 'draft' },
        1: { text: 'Pending', variant: 'pending' },
        2: { text: 'Paid', variant: 'paid' },
        3: { text: 'Cancelled', variant: 'cancelled' },
        4: { text: 'Refunded', variant: 'refunded' }
      };
      return statusMap[status] || { text: 'Unknown', variant: 'unknown' };
    },
  }
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
