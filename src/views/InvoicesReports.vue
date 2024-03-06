<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-12">
        <VBreadcrumbs :breadcrumbItems="breadcrumbs" />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__heading">
          <h1>Reports</h1>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__line">
        <hr />
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-lg-5">

        <div class="row mb-3">
          <div class="tax-due">
            <div class="row">
              <div class="col-lg-12">
                <h3>Tax due</h3>
                <h2>$ {{ taxDueAmount.toFixed(2) }}</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="clients-breakdown">
            <div class="row">
              <div class="col-lg-12">
                <h3>Client’s Breakdown</h3>
                <canvas ref="chartRef"></canvas>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="col-lg-7">
        <TotalIncome />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__heading mt-3 mb-3">
          <h4>Invoices</h4>
          <p>Keep track of your clients & payments</p>
        </div>
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
                  <VDropdown :title="'All invoices'" :items="sortTime" @item-clicked="handleDropdownClick" />
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
            <div class="col col--inv-customer">
              <h4>Customer</h4>
            </div>
            <div class="col col--inv-amount">
              <h4>Amount</h4>
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
          </div>

          <div class="dashboard__table__page">
            <div 
              class="dashboard__table__page__item"
              v-for="invoice in paginatedInvoices" :key="invoice.id"
            >
              <div class="col col--inv-invoice">
                <h5>{{ invoice.number }}</h5>
              </div>
              <div class="col col--inv-customer">
                <VUser :userName="invoice.clientName" :userEmail="truncateEmail(invoice.clientEmail)" :userAvatar="invoice.clientAvatar" />
              </div>
              <div class="col col--inv-amount">
                <p>$ {{ invoice.total_amount }}</p>
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
            </div>

          </div>

          </div>

          <div class="dashboard__pagination-below-table">
            <div class="dashboard__pagination-below-table__prev">
              <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="link-gray" @click="prevPage" text="Previous"></v-button>
            </div>
            <div class="dashboard__pagination-below-table__pages">
              <v-pagination-list :total-pages="totalPages" @update:currentPage="updatePage" />
            </div>
            <div class="dashboard__pagination-below-table__next">
              <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="link-gray" @click="nextPage" text="Next"></v-button>
            </div>
          </div>

      </div>
    </div>

    <VModal :show="showAddInvoiceModal || showPreviewInvoiceModal" :title="modalAddInvoiceTitle || modalPreviewInvoiceTitle" @update:show="handleModalClose">
      <VAddInvoice v-if="showAddInvoiceModal" :title="modalAddInvoiceTitle" @close-modal="showAddInvoiceModal = false" @save-clicked="handleAddInvoiceCase" />
      <VPreviewInvoice v-if="showPreviewInvoiceModal" :title="modalPreviewInvoiceTitle" @close-modal="showPreviewInvoiceModal = false" @save-clicked="handlePreviewInvoiceCase" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, nextTick } from 'vue';
import { db } from '@/firebase.js';
import { collection, query, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import Chart from 'chart.js/auto';
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
import VBreadcrumbs from '@/components/v-breadcrumbs/VBreadcrumbs.vue';
import TotalIncome from '@/modules/InvoicesReports/TotalIncome/TotalIncome.vue';

interface Invoice {
  id: string;
  number: string;
  case: string;
  due_date: Timestamp;
  status: number;
  total_amount: number;
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
    VBreadcrumbs,
    TotalIncome,
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

    const breadcrumbs = computed(() => [
      { text: 'Invoices', to: '/invoices' },
      { text: 'Reports' || '/invoices-reports' }
    ]);

    const sortTime = ref([
      { label: 'All' },
      { label: 'Last year' },
      { label: 'Last three months' },
      { label: 'Last two months' },
      { label: 'Last month' },
      { label: 'This week' },
    ]);

    const chartRef = ref(null);
    const fetchInvoicesAndCalculateIncome = async () => {
      // Example data and labels
      const data = [3500, 19583]; // Replace with your actual data
      const labels = ['Aniyah Ernser', 'James Williams']; // Replace with your actual labels

      // Wait for the next DOM update cycle to ensure the ref is bound
      await nextTick();

      if (chartRef.value) {
        const ctx = chartRef.value.getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              label: 'Total Income',
              data: data,
              backgroundColor: [
                '#444ce7',
                '#6172f3',
                '#8098f9',
                '#a4bcfd',
                '#eaecf0',
              ],
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            }
          }
        });
      }
    };

    onMounted(fetchInvoicesAndCalculateIncome);

    const notificationType = ref('success');
    const notificationHeader = ref('Changes saved');
    const notificationMessage = ref('This account has been successfully edited.');

    const truncateEmail = (email: string) => email.length > 25 ? `${email.substring(0, 22)}...` : email;

    const taxDueAmount = ref(0);

    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      let totalPaidInvoicesAmount = 0;
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
        
        querySnapshot.forEach((doc) => {
          const invoice = doc.data();
          if (invoice.status === 2) { // Check if the invoice status is 'Paid'
            totalPaidInvoicesAmount += invoice.total_amount; // Sum up the total amount
          }
        });
        taxDueAmount.value = totalPaidInvoicesAmount * 0.25;

        // Ensure all required properties are included
        return {
          id: docSnapshot.id,
          number: invoiceData.number, // Ensure this exists in your document
          case: invoiceData.case, // Ensure this exists in your document
          due_date: invoiceData.due_date, // Ensure this exists in your document and is a Timestamp
          status: invoiceData.status, // Ensure this is a number
          client_id: invoiceData.client_id, // Ensure this exists in your document
          total_amount: invoiceData.total_amount, // Ensure this exists in your document
          clientName,
          clientEmail,
          clientAvatar,
          caseTitle,
        };
      });

      invoices.value = await Promise.all(invoicePromises);
    };

    onMounted(fetchInvoices);

    const filteredInvoices = computed(() => invoices.value.filter(invoice => invoice.number.toLowerCase().includes(searchTerm.value.toLowerCase()) || invoice.client_id.toLowerCase().includes(searchTerm.value.toLowerCase())));
    const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / itemsPerPage.value));
    const paginatedInvoices = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return filteredInvoices.value.slice(start, start + itemsPerPage.value);
    });

    const openAddInvoiceModal = () => showAddInvoiceModal.value = true;
    const openPreviewInvoiceModal = () => showPreviewInvoiceModal.value = true;
    const handleModalClose = () => {
      showAddInvoiceModal.value = false;
      showPreviewInvoiceModal.value = false;
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

    const prevPage = () => {
      // Implement previous page logic
    };

    const nextPage = () => {
      // Implement next page logic
    };

    const updatePage = (newPage: number) => {
      // Implement page update logic
    };

    const handleAddInvoiceCase = () => {
      // Implement add invoice case handling
    };

    const handlePreviewInvoiceCase = () => {
      // Implement preview invoice case handling
    };

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
      openPreviewInvoiceModal,
      handleModalClose,
      handleDropdownClick,
      handleDownloadClick,
      handleDeleteClick,
      prevPage,
      nextPage,
      updatePage,
      handleAddInvoiceCase,
      handlePreviewInvoiceCase,
      sortTime,
      notificationType,
      notificationHeader,
      notificationMessage,
      breadcrumbs,
      taxDueAmount,
      chartRef,
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
