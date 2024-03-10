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
            <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="openEditInvoiceModal" text="Add new invoice"></VButton>
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
              &nbsp;
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
            <div v-if="isLoading" class="loading-indicator">
              <img src="@/assets/loader.gif" alt="Loading...">
              <span>Loading invoices...</span>
            </div>
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
                <VButton :block="false" size="sm" icon="left" icon-style="download" styled="simple-icon" text=""></VButton>
              </div>
              <div class="col col--inv-action" v-if="notClient">
                <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="deleteInvoice(invoice.id)" text=""></VButton>
              </div>
              <div class="col col--inv-action" v-if="notClient">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditInvoiceModal" text=""></VButton>
              </div>
            </div>

          </div>

          </div>

          <div class="dashboard__pagination-below-table">
            <div class="dashboard__pagination-below-table__prev">
              <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="() => changePage(-1)" text="Previous" v-if="currentPage > 1"></v-button>
            </div>
            <div class="dashboard__pagination-below-table__pages">
              <v-pagination-list :total-pages="totalPages" :initial-page="currentPage" @update:currentPage="updatePage" />
            </div>
            <div class="dashboard__pagination-below-table__next">
              <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="() => changePage(1)" text="Next" v-if="currentPage < totalPages"></v-button>
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { db } from '@/firebase.js';
import { orderBy, collection, query, getDocs, doc, getDoc, Timestamp, writeBatch, deleteDoc } from 'firebase/firestore';
import VStatus from '@/components/v-status/VStatus.vue';
import VButton from '@/components/v-button/VButton.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VAddInvoice from '@/modals/Invoices/v-add-invoice/v-add-invoice.vue';
import VPreviewInvoice from '@/modals/Invoices/v-preview-invoice/v-preview-invoice.vue';
import VUser from '@/components/v-user/v-user.vue';
import VLink from '@/components/v-link/VLink.vue';
import Search from '@/modules/Navigation/Search.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VNotification from '@/components/v-notification/VNotification.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import { useUserStore } from '@/stores/userStore';

interface Invoice {
  id: string;
  number: string;
  case: string;
  created: Timestamp;
  due_date: Timestamp;
  status: number;
  client_id: string;
  sales_taxes: number;
  subtotal_amount: number;
  total_amount: number;
  total_discount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientAvatar: string;
  caseTitle: string;
  invoiceItems: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  item: string;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
}

interface NotificationRef {
  showNotification: () => void;
}

export default defineComponent({
  components: {
    VStatus,
    VButton,
    VModal,
    VAddInvoice,
    VNotification,
    VPreviewInvoice,
    VUser,
    VLink,
    Search,
    VPaginationList,
    VDropdown,
  },
  data() {
    return {
      invoices: [] as Invoice[],
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      showAddInvoiceModal: false,
      showPreviewInvoiceModal: false,
      modalAddInvoiceTitle: '',
      modalPreviewInvoiceTitle: '',
      currentInvoice: null as Invoice | null,
      billingSettings: {},
      generalSettings: {},
      sortTime: [
        { label: 'All', value: 'all' },
        { label: 'Last year', value: 'lastYear' },
        { label: 'Last three months', value: 'lastThreeMonths' },
        { label: 'Last two months', value: 'lastTwoMonths' },
        { label: 'Last month', value: 'lastMonth' },
        { label: 'This week', value: 'thisWeek' },
      ],
      selectedTimeFrame: 'all',
      sortStatus: [
        { label: 'All', value: null },
        { label: 'Draft', value: 0 },
        { label: 'Paid', value: 2 },
        { label: 'Cancelled', value: 3 },
        { label: 'Refunded', value: 4 },
      ],
      selectedStatus: null,
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This invoice has been successfully edited.',
    };
  },
  setup() {
    const userStore = useUserStore();
    const userRole = computed(() => userStore.user.value?.role ?? 0);
    const notClient = computed(() => [0, 1, 2].includes(userRole.value));

    const invoices = ref<Invoice[]>([]);
    const billingSettings = ref({});
    const generalSettings = ref({});
    
    const isLoading = ref(false);

    const fetchInvoices = async () => {
      isLoading.value = true;
      invoices.value = [];
      try {
        const q = query(collection(db, "invoices"), orderBy("due_date", "asc"));
        const querySnapshot = await getDocs(q);
        const invoicesData: Invoice[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const invoiceData = docSnapshot.data();
          
          // Fetch client details
          const clientDocRef = doc(db, "users", invoiceData.client_id);
          const clientDocSnap = await getDoc(clientDocRef);
          let clientDetails = {
            clientName: "Unknown",
            clientEmail: "No Email",
            clientPhone: "No Phone",
            clientAddress: "No Address",
            clientAvatar: "Default Avatar URL",
          };
          if (clientDocSnap.exists()) {
            const clientData = clientDocSnap.data();
            clientDetails = {
              clientName: clientData.full_name || "Unknown",
              clientEmail: clientData.email || "No Email",
              clientPhone: clientData.phone || "No Phone",
              clientAddress: clientData.address || "No Address",
              clientAvatar: clientData.avatar || "Default Avatar URL",
            };
          }

          // Fetch case title
          const caseDocRef = doc(db, "cases", invoiceData.case);
          const caseDocSnap = await getDoc(caseDocRef);
          let caseTitle = "Unknown Case";
          if (caseDocSnap.exists()) {
            caseTitle = caseDocSnap.data().title || "Unknown Case";
          }

          // Fetch invoice items
          const invoiceItemsSnapshot = await getDocs(collection(db, `invoices/${docSnapshot.id}/invoice_items`));
          const invoiceItems: InvoiceItem[] = invoiceItemsSnapshot.docs.map(doc => ({
            id: doc.id,
            item: doc.data().item,
            quantity: doc.data().quantity,
            price: doc.data().price,
            discount: doc.data().discount,
            amount: doc.data().amount,
          }));

          // Construct the Invoice object
          const invoice: Invoice = {
            id: docSnapshot.id,
            number: invoiceData.number,
            case: invoiceData.case,
            created: invoiceData.created,
            due_date: invoiceData.due_date,
            status: invoiceData.status,
            client_id: invoiceData.client_id,
            sales_taxes: invoiceData.sales_taxes,
            subtotal_amount: invoiceData.subtotal_amount,
            total_amount: invoiceData.total_amount,
            total_discount: invoiceData.total_discount,
            clientName: clientDetails.clientName,
            clientEmail: clientDetails.clientEmail,
            clientPhone: clientDetails.clientPhone,
            clientAddress: clientDetails.clientAddress,
            clientAvatar: clientDetails.clientAvatar,
            caseTitle: caseTitle,
            invoiceItems: invoiceItems,
          };

          invoicesData.push(invoice);
        }

        invoices.value = invoicesData;
      } catch (error) {
        console.error("Error fetching invoices: ", error);
      } finally {
        isLoading.value = false; // End loading
      }
    };

    const fetchBillingSettings = async () => {
      try {
        const billingDocRef = doc(db, "settings", "billing");
        const billingDocSnap = await getDoc(billingDocRef);
        if (billingDocSnap.exists()) {
          billingSettings.value = billingDocSnap.data();
        } else {
          console.log("No billing settings document found!");
        }
      } catch (error) {
        console.error("Error fetching billing settings: ", error);
      }
    };

    const fetchGeneralSettings = async () => {
      try {
        const generalDocRef = doc(db, "settings", "general");
        const generalDocSnap = await getDoc(generalDocRef);
        if (generalDocSnap.exists()) {
          generalSettings.value = generalDocSnap.data();
        } else {
          console.log("No general settings document found!");
        }
      } catch (error) {
        console.error("Error fetching general settings: ", error);
      }
    };

    onMounted(async () => {
      await fetchInvoices();
      await fetchBillingSettings();
      await fetchGeneralSettings();
    });

    return { 
      userRole, 
      notClient,
      invoices,
      billingSettings,
      generalSettings,
      isLoading,
    };
  },
  computed: {
    totalPages() {
      const filteredInvoices = this.invoices.filter(invoice => {
        return invoice.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              invoice.number.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
      return Math.ceil(filteredInvoices.length / this.itemsPerPage);
    },
    paginatedInvoices() {
      const filteredInvoices = this.invoices.filter(invoice => {
        // Adjust this condition based on how you want to search (e.g., by number, clientName, etc.)
        // This example searches by clientName and invoice number
        return invoice.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              invoice.number.toLowerCase().includes(this.searchTerm.toLowerCase());
      });

      // Then, calculate the start and end indices for pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;

      // Return the slice of filtered invoices for the current page
      return filteredInvoices.slice(start, end);
    },
  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    async fetchInvoices() {
      this.invoices = [];
      try {
        const querySnapshot = await getDocs(collection(db, "invoices"));
        const invoicesData: Invoice[] = []; // Typed according to the Invoice interface
    
        for (const docSnapshot of querySnapshot.docs) {
          const invoiceData = docSnapshot.data() as Omit<Invoice, 'id' | 'invoiceItems'>; // Assuming direct mapping except 'id' and 'invoiceItems'
          
          // Fetch client details
          const clientDocRef = doc(db, "users", invoiceData.client_id);
          const clientDocSnap = await getDoc(clientDocRef);
          let clientDetails = {
            clientName: "Unknown",
            clientEmail: "No Email",
            clientPhone: "No Phone",
            clientAddress: "No Address",
            clientAvatar: "Default Avatar URL",
          };
          if (clientDocSnap.exists()) {
            const clientData = clientDocSnap.data();
            clientDetails = {
              clientName: clientData.full_name || "Unknown",
              clientEmail: clientData.email || "No Email",
              clientPhone: clientData.phone || "No Phone",
              clientAddress: clientData.address || "No Address",
              clientAvatar: clientData.avatar || "Default Avatar URL",
            };
          }
    
          // Fetch case title
          const caseDocRef = doc(db, "cases", invoiceData.case);
          const caseDocSnap = await getDoc(caseDocRef);
          let caseTitle = "Unknown Case";
          if (caseDocSnap.exists()) {
            caseTitle = caseDocSnap.data().title || "Unknown Case";
          }
    
          // Fetch invoice items
          const invoiceItemsSnapshot = await getDocs(collection(db, `invoices/${docSnapshot.id}/invoice_items`));
          const invoiceItems: InvoiceItem[] = invoiceItemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as InvoiceItem[];
    
          // Combine all fetched data into a single object conforming to the Invoice interface
          invoicesData.push({
            id: docSnapshot.id,
            ...invoiceData,
            ...clientDetails,
            caseTitle,
            invoiceItems,
          });
        }
    
        this.invoices = invoicesData;
      } catch (error) {
        console.error("Error fetching invoices: ", error);
        // Handle the error appropriately
      }
    },    
    async fetchBillingSettings() {
      try {
        const billingDocRef = doc(db, "settings", "billing");
        const billingDocSnap = await getDoc(billingDocRef);
        if (billingDocSnap.exists()) {
          this.billingSettings = billingDocSnap.data();
        } else {
          console.log("No billing settings document found!");
          this.billingSettings = {}; // Reset to default or keep previous state
        }
      } catch (error) {
        console.error("Error fetching billing settings: ", error);
        // Handle the error appropriately
      }
    },
    async fetchGeneralSettings() {
      try {
        const generalDocRef = doc(db, "settings", "general");
        const generalDocSnap = await getDoc(generalDocRef);
        if (generalDocSnap.exists()) {
          this.generalSettings = generalDocSnap.data();
        } else {
          console.log("No general settings document found!");
          this.generalSettings = {}; // Reset to default or keep previous state
        }
      } catch (error) {
        console.error("Error fetching general settings: ", error);
        // Handle the error appropriately
      }
    },
    truncateEmail(email: string) {
      const maxLength = 35; // Define the maximum length of the email to display
      if (email.length > maxLength) {
        return `${email.substring(0, maxLength - 3)}...`; // Truncate and add ellipsis
      }
      return email; // Return the original email if it's short enough
    },
    openEditInvoiceModal() {
      this.showAddInvoiceModal = true;
    },
    openPreviewInvoiceModal(invoice: Invoice) {
      this.currentInvoice = invoice;
      this.showPreviewInvoiceModal = true;
    },
    handleModalClose() {
      this.showAddInvoiceModal = false;
      this.showPreviewInvoiceModal = false;
    },
    updateSearchTerm(value: string) {
      this.searchTerm = value;
    },
    handleFilterTime(item: any) {
      this.selectedTimeFrame = item.value;
    },
    handleFilterStatus(item: any) {
      this.selectedStatus = item.value;
    },

    async deleteInvoice(invoiceId: string) {
      try {
        await deleteDoc(doc(db, "invoices", invoiceId));
        this.invoices = this.invoices.filter(invoice => invoice.id !== invoiceId);

        this.notificationType = 'success';
        this.notificationHeader = 'Invoice Deleted';
        this.notificationMessage = 'The invoice has been successfully deleted.';
        this.triggerNotification('success', 'Invoice Deleted', 'The invoice has been successfully deleted.');
      } catch (error) {
        console.error("Error deleting invoice: ", error);

        this.notificationType = 'error';
        this.notificationHeader = 'Error';
        this.notificationMessage = 'Failed to delete the invoice.';
        this.triggerNotification('error', 'Error', 'Failed to delete the invoice.');
      }
    },
    changePage(step: number) {
      const newPage = this.currentPage + step;
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
      }
    },
    updatePage(newPage: number) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
      }
    },
    handleAddInvoiceCase() {
      // Method logic to handle add invoice case
    },
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
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
