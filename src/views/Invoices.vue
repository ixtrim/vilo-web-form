<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-9">
        <div class="dashboard__heading mb-0">
          <h1>Invoices</h1>
          <p>Create and manage invoices.</p>
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
            <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="addNewInvoiceModal" text="Add new invoice"></VButton>
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
                  <VDropdown :title="currentDateTitle" :items="sortTime" @item-clicked="handleFilterTime" />
                </li>
                <li>
                  <VDropdown :title="currentStatusTitle" :items="sortStatus" @item-clicked="handleFilterStatus" />
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
                <VButton :block="false" size="sm" icon="left" icon-style="download" styled="simple-icon" @click="openDownloadInvoiceModal(invoice)" text=""></VButton>
              </div>
              <div class="col col--inv-action" v-if="notClient">
                <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="deleteInvoice(invoice.id)" text=""></VButton>
              </div>
              <div class="col col--inv-action" v-if="notClient">
                <VButton v-if="notClient && (invoice.status === 0 || invoice.status === 1)" :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditInvoiceModal(invoice)" text=""></VButton>
                <span v-else>&nbsp;</span>
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

    <VModal :show="showAddInvoiceModal || showEditInvoiceModal  || showPreviewInvoiceModal || showDownloadInvoiceModal" :title="modalAddInvoiceTitle || modalEditInvoiceTitle || modalPreviewInvoiceTitle || modalDownloadInvoiceTitle" @update:show="handleModalClose">
      <VAddInvoice v-if="showAddInvoiceModal" @close-modal="showAddInvoiceModal = false" :taxLabel="taxLabel" :userRole="userRole" :generalSettings="generalSettings" :billingSettings="billingSettings" @add-invoice="handleAddInvoice" />
      <VEditInvoice v-if="showEditInvoiceModal && currentInvoice" :title="modalEditInvoiceTitle" :taxLabel="taxLabel" :invoice="currentInvoice" :userRole="userRole" :generalSettings="generalSettings" :billingSettings="billingSettings" @save-changes="handleInvoiceUpdate" @close-modal="showEditInvoiceModal = false" />
      <VPreviewInvoice v-if="showPreviewInvoiceModal && currentInvoice" :title="modalPreviewInvoiceTitle" :taxLabel="taxLabel" :invoice="currentInvoice" :userRole="userRole" :generalSettings="generalSettings" :billingSettings="billingSettings" @invoice-pending="markInvoiceAsPending" @invoice-paid="markInvoiceAsPaid"  @invoice-refunded="markInvoiceAsRefunded" @invoice-cancelled="markInvoiceAsCancelled" @close-modal="showPreviewInvoiceModal = false" />
      <VDownloadInvoice v-if="showDownloadInvoiceModal && currentInvoice" :title="modalDownloadInvoiceTitle" :invoice="currentInvoice" :taxLabel="taxLabel" :userRole="userRole" :generalSettings="generalSettings" :billingSettings="billingSettings" @close-modal="showDownloadInvoiceModal = false" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { db } from '@/firebase.js';
import { orderBy, collection, query, getDocs, doc, getDoc, Timestamp, writeBatch, deleteDoc, updateDoc, where, Query } from 'firebase/firestore';
import VStatus from '@/components/v-status/VStatus.vue';
import VButton from '@/components/v-button/VButton.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VAddInvoice from '@/modals/Invoices/v-add-invoice/v-add-invoice.vue';
import VEditInvoice from '@/modals/Invoices/v-edit-invoice/v-edit-invoice.vue';
import VPreviewInvoice from '@/modals/Invoices/v-preview-invoice/v-preview-invoice.vue';
import VDownloadInvoice from '@/modals/Invoices/v-download-invoice/v-download-invoice.vue';
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
  custom_company_name: string;
  custom_bank_name: string;
  custom_branch: string;
  custom_account_number: string;
  custom_address: string;
  custom_sort_code: string;
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
    VEditInvoice,
    VNotification,
    VPreviewInvoice,
    VDownloadInvoice,
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
      showEditInvoiceModal: false,
      showPreviewInvoiceModal: false,
      showDownloadInvoiceModal: false,
      modalAddInvoiceTitle: '',
      modalEditInvoiceTitle: '',
      modalPreviewInvoiceTitle: '',
      modalDownloadInvoiceTitle: '',
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
      currentStatusTitle: 'All invoices',
      currentDateTitle: 'Filter by date',
    };
  },
  setup() {
    const userStore = useUserStore();
    const userRole = computed(() => userStore.user.value?.role ?? 0);
    const notClient = computed(() => [0, 1, 2].includes(userRole.value));

    const invoices = ref<Invoice[]>([]);
    const billingSettings = ref({});
    const generalSettings = ref({});
    const taxLabel = ref('');
    
    const isLoading = ref(false);

    const fetchInvoices = async () => {
      isLoading.value = true;
      invoices.value = [];
      try {
        let q: Query;
        if (userRole.value === 3 || userRole.value === 4) {
          q = query(collection(db, "invoices"), where("client_id", "==", userStore.user.value?.id));
        } else if (userRole.value === 0 || userRole.value === 2) {
          q = query(collection(db, "invoices"), orderBy("due_date", "asc"));
        } else {
          throw new Error("Invalid user role");
        }
        const querySnapshot = await getDocs(q);
        const invoicesData: Invoice[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const invoiceData = docSnapshot.data() as Omit<Invoice, 'id' | 'invoiceItems'> & { id: string }; // Correctly typed with id included
          
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
            custom_company_name: invoiceData.custom_company_name,
            custom_bank_name: invoiceData.custom_bank_name,
            custom_branch: invoiceData.custom_branch,
            custom_account_number: invoiceData.custom_account_number,
            custom_address: invoiceData.custom_address,
            custom_sort_code: invoiceData.custom_sort_code,
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

    const fetchTaxLabel = async () => {
      try {
        const docRef = doc(db, "settings", "invoice");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          taxLabel.value = docSnap.data().tax_label; // Set the taxLabel value
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
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
      await fetchTaxLabel();
    });

    return { 
      userRole, 
      notClient,
      invoices,
      billingSettings,
      generalSettings,
      isLoading,
      taxLabel,
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
        const matchesSearchTerm = invoice.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                  invoice.number.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesStatus = this.selectedStatus === null || invoice.status === this.selectedStatus;
        return matchesSearchTerm && matchesStatus;
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
          const invoiceData = docSnapshot.data() as Omit<Invoice, 'id' | 'invoiceItems'> & { id: string }; // Assuming direct mapping except 'id' and 'invoiceItems'
          
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

          invoicesData.push({
            ...invoiceData,
            id: docSnapshot.id,
            ...clientDetails,
            caseTitle,
            invoiceItems,
          });
        }
    
        this.invoices = invoicesData;
      } catch (error) {
        console.error("Error fetching invoices: ", error);
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
          this.billingSettings = {};
        }
      } catch (error) {
        console.error("Error fetching billing settings: ", error);
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
          this.generalSettings = {};
        }
      } catch (error) {
        console.error("Error fetching general settings: ", error);
      }
    },
    truncateEmail(email: string) {
      const maxLength = 35;
      if (email.length > maxLength) {
        return `${email.substring(0, maxLength - 3)}...`;
      }
      return email;
    },
    openEditInvoiceModal(invoice: Invoice) {
      this.currentInvoice = invoice;
      this.showEditInvoiceModal = true;
    },
    openPreviewInvoiceModal(invoice: Invoice) {
      this.currentInvoice = invoice;
      this.showPreviewInvoiceModal = true;
    },
    openDownloadInvoiceModal(invoice: Invoice) {
      this.currentInvoice = invoice;
      this.showDownloadInvoiceModal = true;
    },
    addNewInvoiceModal() {
      this.showAddInvoiceModal = true;
    },
    handleModalClose() {
      this.showAddInvoiceModal = false;
      this.showEditInvoiceModal = false;
      this.showPreviewInvoiceModal = false;
      this.showDownloadInvoiceModal = false;
    },
    updateSearchTerm(value: string) {
      this.searchTerm = value;
    },
    handleFilterTime(item: any) {
      this.selectedTimeFrame = item.value;
      const selectedItem = this.sortTime.find(time => time.value === item.value);
      this.currentDateTitle = selectedItem ? selectedItem.label : 'Filter by date';
    },
    handleFilterStatus(item: any) {
      this.selectedStatus = item.value;
      const selectedItem = this.sortStatus.find(status => status.value === item.value);
      this.currentStatusTitle = selectedItem ? selectedItem.label : 'All invoices';
    },
    async refreshData() {
      await this.fetchInvoices();
    },
    handleInvoiceUpdate(updatedInvoice: any) {
      // Find the index of the invoice that was updated
      const index = this.invoices.findIndex(invoice => invoice.id === updatedInvoice.id);
      if (index !== -1) {
        // Update the invoice in the local state
        this.invoices[index] = updatedInvoice;
        this.triggerNotification('success', 'Invoice Updated', 'The invoice has been successfully updated.');
      }
    },
    async markInvoiceAsPending(invoiceId: string) {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId);
        await updateDoc(invoiceRef, {
          status: 1
        });
        
        const invoiceIndex = this.invoices.findIndex(invoice => invoice.id === invoiceId);
        if (invoiceIndex !== -1) {
          this.invoices[invoiceIndex].status = 1;
        }

        this.triggerNotification('success', 'Invoice sent to client', 'This invoice has been successfully sent to client and its status is now pending.');
      } catch (error) {
        console.error("Error updating invoice status: ", error);
        this.triggerNotification('error', 'Error', 'Failed to update the invoice status.');
      }
    },
    async markInvoiceAsPaid(invoiceId: string) {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId);
        await updateDoc(invoiceRef, {
          status: 2
        });

        const invoiceIndex = this.invoices.findIndex(invoice => invoice.id === invoiceId);
        if (invoiceIndex !== -1) {
          this.invoices[invoiceIndex].status = 2;
        }

        this.triggerNotification('success', 'Invoice status updated', 'This invoice status has been successfully updated as paid.');
      } catch (error) {
        console.error("Error updating invoice status: ", error);
        this.triggerNotification('error', 'Error', 'Failed to update the invoice status.');
      }
    },
    async markInvoiceAsCancelled(invoiceId: string) {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId);
        await updateDoc(invoiceRef, {
          status: 3
        });

        const invoiceIndex = this.invoices.findIndex(invoice => invoice.id === invoiceId);
        if (invoiceIndex !== -1) {
          this.invoices[invoiceIndex].status = 3;
        }

        this.triggerNotification('success', 'Invoice status updated', 'This invoice status has been successfully updated as cancelled.');
      } catch (error) {
        console.error("Error updating invoice status: ", error);
        this.triggerNotification('error', 'Error', 'Failed to update the invoice status.');
      }
    },
    async markInvoiceAsRefunded(invoiceId: string) {
      try {
        const invoiceRef = doc(db, "invoices", invoiceId);
        await updateDoc(invoiceRef, {
          status: 4
        });

        const invoiceIndex = this.invoices.findIndex(invoice => invoice.id === invoiceId);
        if (invoiceIndex !== -1) {
          this.invoices[invoiceIndex].status = 4;
        }

        this.triggerNotification('success', 'Invoice status updated', 'This invoice status has been successfully updated as refunded.');
      } catch (error) {
        console.error("Error updating invoice status: ", error);
        this.triggerNotification('error', 'Error', 'Failed to update the invoice status.');
      }
    },
    async deleteInvoice(invoiceId: string) {
      try {
        await deleteDoc(doc(db, "invoices", invoiceId));

        // Remove the invoice from the local state immediately
        this.invoices = this.invoices.filter(invoice => invoice.id !== invoiceId);

        this.triggerNotification('success', 'Invoice Deleted', 'The invoice has been successfully deleted.');
      } catch (error) {
        console.error("Error deleting invoice: ", error);
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
    async handleAddInvoice() {
      this.showAddInvoiceModal = false;
      this.triggerNotification('success', 'Invoice Added', 'The new invoice has been successfully added.');
      await this.fetchInvoices();
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
