<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading mb-0">
          <h1>Invoices</h1>
          <p>Create and manage your team documents and templates.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="openAddInvoiceModal" text="Add new invoice"></VButton>
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
            <div class="col col--inv-case">
              <h4>Case</h4>
            </div>
            <div class="col col--inv-date">
              <h4>Date</h4>
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
            <div class="col col--inv-action">
              &nbsp;
            </div>
            <div class="col col--inv-action">
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
                <p>{{  }}</p>
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
                <VUser userName="" userEmail="" />
              </div>
              <div class="col col--inv-reminder">
                
              </div>
              <!-- Assuming you have different methods for different buttons -->
              <div class="col col--inv-action">
                <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" @click="openPreviewInvoiceModal" text=""></VButton>
              </div>
              <div class="col col--inv-action">
                <VButton :block="false" size="sm" icon="left" icon-style="download" styled="simple-icon" @click="handleDownloadClick" text=""></VButton>
              </div>
              <div class="col col--inv-action">
                <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="handleDeleteClick" text=""></VButton>
              </div>
              <div class="col col--inv-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openAddInvoiceModal" text=""></VButton>
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import { db } from '@/firebase.js';
import { collection, query, getDocs } from 'firebase/firestore';
import VStatus from '@/components/v-status/VStatus.vue';
import VButton from '@/components/v-button/VButton.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VAddInvoice from '@/modals/Invoices/v-add-invoice/v-add-invoice.vue';
import VPreviewInvoice from '@/modals/Invoices/v-preview-invoice/v-preview-invoice.vue';

interface Invoice {
  id: string;
  number: string;
  case: string;
  due_date: firebase.firestore.Timestamp;
  status: string;
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
  },
  setup() {
    const invoices = ref<Invoice[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const searchTerm = ref('');

    const fetchInvoices = async () => {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      invoices.value = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          number: data.number,
          case: data.case,
          due_date: data.due_date,
          status: data.status,
          client_id: data.client_id,
        };
      });
    };

    onMounted(fetchInvoices);

    const filteredInvoices = computed(() => {
      return invoices.value.filter(invoice => {
        return invoice.number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
               invoice.client_id.toLowerCase().includes(searchTerm.value.toLowerCase());
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

    return {
      currentPage,
      itemsPerPage,
      paginatedInvoices,
      totalPages,
      searchTerm,
      fetchInvoices,
    };
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return '';
      // Convert Firestore Timestamp to Date and format it
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    statusText(status) {
      const statusMap = {
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
