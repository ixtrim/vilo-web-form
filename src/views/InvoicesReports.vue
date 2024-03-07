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
                <h2>{{ formatCurrency(taxDueAmount) }}</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="clients-breakdown">
            <div class="row align-middle">
              <div class="col-lg-6 align-middle">
                <h3>Client’s Breakdown</h3>

                <div v-for="summary in invoiceSummaries" :key="summary.clientId" style="display: none;">
                  <h3>{{ summary.clientName }}</h3>
                  <p>Unpaid Invoices Total: ${{ summary.unpaidInvoicesTotal }}</p>
                  <p>Paid Invoices Total: ${{ summary.paidInvoicesTotal }}</p>
                </div>
              </div>
              <div class="col-lg-6 align-right">
                <VDropdown :title="dropdownTitle" :items="clientsList" @item-clicked="handleClientSelected" />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 mt-3">
                <canvas ref="chartRef" :key="canvasKey"></canvas>
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
                <p>{{ formatCurrency(invoice.total_amount) }}</p>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, nextTick, watch } from 'vue';
import type { Ref } from 'vue';
import { db } from '@/firebase.js';
import { collection, query, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import Chart from 'chart.js/auto';
import VStatus from '@/components/v-status/VStatus.vue';
import VButton from '@/components/v-button/VButton.vue';
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

interface ClientOption {
  label: string;
  value: string;
}

interface InvoiceSummary {
  clientId: string;
  clientName: string;
  unpaidInvoicesTotal: number;
  paidInvoicesTotal: number;
}

export default defineComponent({
  components: {
    VButton,
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
    const clientsList = ref<ClientOption[]>([]);
    const clientsMap: Record<string, ClientOption> = {};
    const invoiceSummaries = ref<InvoiceSummary[]>([]);
    const notificationType = ref('success');
    const notificationHeader = ref('Changes saved');
    const notificationMessage = ref('This account has been successfully edited.');
    const taxDueAmount = ref(0);
    const totalPaidAmount = ref(0);
    const totalUnpaidAmount = ref(0);
    const selectedClientId = ref<string | null>(null);
    const dropdownTitle = ref('Choose client');
    const canvasKey = ref(0);

    const breadcrumbs = computed(() => [
      { text: 'Invoices', to: '/invoices' },
      { text: 'Reports' || '/invoices-reports' }
    ]);

    const sortTime = ref([
      { label: 'All', value: 'all' },
      { label: 'Last year', value: 'lastYear' },
      { label: 'Last three months', value: 'lastThreeMonths' },
      { label: 'Last two months', value: 'lastTwoMonths' },
      { label: 'Last month', value: 'lastMonth' },
      { label: 'This week', value: 'thisWeek' },
    ]);
    const selectedTimeFrame = ref('all');

    const sortStatus = ref([
      { label: 'All', value: null },
      { label: 'Draft', value: 0 },
      { label: 'Paid', value: 2 },
      { label: 'Cancelled', value: 3 },
      { label: 'Refunded', value: 4 },
    ]);
    const selectedStatus = ref(null);

    const truncateEmail = (email: string) => email.length > 25 ? `${email.substring(0, 22)}...` : email;

    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const summaries: Record<string, InvoiceSummary> = {};
      let totalPaidInvoicesAmount = 0;
      let totalUnpaidInvoicesAmount = 0;
      
      const invoicePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const invoiceData = docSnapshot.data() as any;
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

          if (!clientsMap[invoiceData.client_id]) {
            clientsMap[invoiceData.client_id] = { label: clientName, value: invoiceData.client_id };
          }
        }

        const caseDocRef = doc(db, "cases", invoiceData.case);
        const caseDocSnap = await getDoc(caseDocRef);
        let caseTitle = "Unknown Case";

        if (caseDocSnap.exists()) {
          caseTitle = caseDocSnap.data().title || "Unknown Case";
        }
        
        querySnapshot.forEach((doc) => {
          const invoice = doc.data();
          
          if (invoice.status === 2) {
            totalPaidInvoicesAmount += invoice.total_amount;
          } else if (invoice.status === 1) {
            totalUnpaidInvoicesAmount += invoice.total_amount;
          }
        });

        for (const docSnapshot of querySnapshot.docs) {
          const invoiceData = docSnapshot.data() as any;
          const clientId = invoiceData.client_id;
          const status = invoiceData.status;
          const totalAmount = invoiceData.total_amount;

          if (!summaries[clientId]) {
            const clientDocSnap = await getDoc(doc(db, "users", clientId));
            let clientName = "Unknown";
            if (clientDocSnap.exists()) {
              const clientData = clientDocSnap.data();
              clientName = clientData.full_name || "Unknown";
            }

            summaries[clientId] = {
              clientId,
              clientName,
              unpaidInvoicesTotal: 0,
              paidInvoicesTotal: 0,
            };
          }

          if (status === 1) {
            summaries[clientId].unpaidInvoicesTotal += totalAmount;
          } else if (status === 2) {
            summaries[clientId].paidInvoicesTotal += totalAmount;
          }
        }

        taxDueAmount.value = totalPaidInvoicesAmount * 0.25;
        totalPaidAmount.value = totalPaidInvoicesAmount;
        totalUnpaidAmount.value = totalUnpaidInvoicesAmount;

        clientsList.value = Object.values(clientsMap) as { label: string; value: string }[];

        invoiceSummaries.value = Object.values(summaries);

        fetchInvoicesAndCalculateIncome();

        // Ensure all required properties are included
        return {
          id: docSnapshot.id,
          number: invoiceData.number,
          case: invoiceData.case,
          due_date: invoiceData.due_date,
          status: invoiceData.status,
          client_id: invoiceData.client_id,
          total_amount: invoiceData.total_amount,
          clientName,
          clientEmail,
          clientAvatar,
          caseTitle,
        };
      });

      invoices.value = await Promise.all(invoicePromises);
    };

    const chartRef: Ref<HTMLCanvasElement | null> = ref(null);
    const fetchInvoicesAndCalculateIncome = async () => {
      const data = [totalPaidAmount.value, totalUnpaidAmount.value];
      const labels = ['Paid invoices', 'Pending invoices'];

      await nextTick();

      if (chartRef.value) {
        const ctx = chartRef.value.getContext('2d');
        if (ctx) {
          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{
                label: 'Total Income',
                data: data,
                backgroundColor: [
                  '#444CE7',
                  '#F97066',
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
      }
    };

    onMounted(fetchInvoices);

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

    const totalPages = computed(() => {
      return Math.ceil(filteredInvoices.value.length / itemsPerPage.value);
    });
    const paginatedInvoices = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredInvoices.value.slice(start, end);
    });

    const handleClientSelected = (item: ClientOption) => {
      selectedClientId.value = item.value;
      dropdownTitle.value = item.label;

      const summary = invoiceSummaries.value.find(summary => summary.clientId === item.value);
      if (summary) {
        updateChartData([summary.paidInvoicesTotal, summary.unpaidInvoicesTotal]);
      } else {
        updateChartData([totalPaidAmount.value, totalUnpaidAmount.value]);
      }
    };


    let myChart: Chart | null = null;
    const updateChartData = (data: number[]) => {
      canvasKey.value++;

      nextTick(() => {
        if (chartRef.value) {
          const ctx = chartRef.value.getContext('2d');
          if (ctx) {
            if (myChart) {
              myChart.destroy();
              myChart = null;
            }

            myChart = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: ['Paid invoices', 'Unpaid invoices'],
                datasets: [{
                  label: 'Invoice Summary',
                  data: data,
                  backgroundColor: ['#444CE7', '#F97066'],
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
            }) as any;
          } else {
            console.error("Failed to get canvas context");
          }
        } else {
          console.error("Canvas ref is not available");
        }
      });
    };


    const handleFilterTime = (item: any) => {
      selectedTimeFrame.value = item.value;
    };

    const handleFilterStatus = (item: any) => {
      selectedStatus.value = item.value;
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

    const updateSearchTerm = (value: string) => {
      searchTerm.value = value;
    };

    function formatCurrency(amount: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }

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
      handleFilterTime,
      handleFilterStatus,
      handleDownloadClick,
      handleDeleteClick,
      changePage,
      updatePage,
      sortTime,
      sortStatus,
      notificationType,
      notificationHeader,
      notificationMessage,
      breadcrumbs,
      taxDueAmount,
      chartRef,
      clientsList,
      invoiceSummaries,
      selectedClientId,
      handleClientSelected,
      dropdownTitle,
      canvasKey,
      formatCurrency,
      updateSearchTerm,
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
