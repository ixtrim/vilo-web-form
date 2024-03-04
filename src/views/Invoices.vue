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
            <div class="col col--checkbox">
              <input type="checkbox" />
            </div>
            <div class="col col--inv-invoice">
              <ul>
                <li>
                  <h4>Invoice</h4>
                </li>
                <li>
                  <VButton :block="false" size="sm" icon="left" icon-style="arrow-down" styled="simple-icon" @click="handleButtonClick" text=""></VButton>
                </li>
              </ul>
            </div>
            <div class="col col--inv-case">
              <h4>Case number</h4>
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
              v-for="(item, index) in items"
              :key="index" style="display: none;"
            >
              <div class="col col--checkbox">
                <input type="checkbox" />
              </div>
              <div class="col col--inv-invoice">
                <h5>{{ item.invoice }}</h5>
              </div>
              <div class="col col--inv-case">
                <p>{{ item.case }}</p>
              </div>
              <div class="col col--inv-date">
                <p>{{ item.date }}</p>
              </div>
              <div class="col col--inv-status">
                <VStatus :variant="item.status.toLowerCase()">{{ item.status }}</VStatus>
              </div>
              <div class="col col--inv-customer">
                <VUser :userName="item.customer.name" :userEmail="item.customer.email" />
              </div>
              <div class="col col--inv-reminder">
                <span v-if="item.reminder !== 'Set reminder'" class="v-reminder">{{ item.reminder }}</span>
                <VButton v-else :block="false" size="sm" styled="link" @click="handleSetReminder" text="Set reminder"></VButton>
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
import { defineComponent, ref, computed } from 'vue';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';
import Search   from '@/modules/Navigation/Search.vue';
import VUser from '@/components/v-user/v-user.vue';
import VStatus from '@/components/v-status/VStatus.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VAddInvoice from '@/modals/Invoices/v-add-invoice/v-add-invoice.vue';
import VPreviewInvoice from '@/modals/Invoices/v-preview-invoice/v-preview-invoice.vue';

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
    VStatus,
    VModal,
    VAddInvoice,
    VPreviewInvoice,
  },
  data() {
    return {
      showAddInvoiceModal: false,
      showPreviewInvoiceModal: false,
      modalAddInvoiceTitle: '',
      modalPreviewInvoiceTitle: '',
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      userName: 'Olivia Rhye',
      userEmail: 'olivia@untitledui.com',
      sortTime: [
        { label: 'All' },
        { label: 'Last year' },
        { label: 'Last three months' },
        { label: 'Last two months' },
        { label: 'Last month' },
        { label: 'This week' },
      ],
      sortCases: [
        { label: 'Internal user' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
        { label: 'Admin' },
      ],
      items: [
        // Generate 10 dummy data items
        ...Array.from({ length: 10 }, (_, i) => ({
          invoice: `INV-${3056 + i}`,
          case: Math.floor(Math.random() * 100),
          date: new Date(2022, 0, 6 + i).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          status: ['Paid', 'Draft', 'Refunded', 'Pending payment', 'Cancelled'][Math.floor(Math.random() * 5)],
          customer: {
            name: `Customer ${i}`,
            email: `customer${i}@example.com`
          },
          reminder: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'][Math.floor(Math.random() * 5)]
        }))
      ]
    };
  },
  setup() {
    const itemsPerPage = 10;
    const allItems = ref([
      { id: 1, name: 'Page 1' },
      { id: 2, name: 'Page 2' },
      { id: 3, name: 'Page 3' },
      { id: 4, name: 'Page 4' },
      { id: 5, name: 'Page 5' },
      { id: 6, name: 'Page 6' },
      { id: 7, name: 'Page 7' },
      { id: 8, name: 'Page 8' },
      { id: 9, name: 'Page 9' },
      { id: 10, name: 'Page 10' },
      { id: 11, name: 'Page 11' },
      { id: 12, name: 'Page 12' },
    ]);
    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(allItems.value.length / itemsPerPage));

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return allItems.value.slice(start, end);
    });

    const updatePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    return {
      paginatedItems,
      totalPages,
      currentPage,
      updatePage
    };
  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    openAddInvoiceModal() {
      this.modalAddInvoiceTitle = 'Create new Invoice';
      this.showAddInvoiceModal = true;
    },
    handleAddInvoiceCase() {
      this.showAddInvoiceModal = false;
      this.triggerNotification('success', 'Changes saved', 'Case board modified successfully.');
    },
    openPreviewInvoiceModal() {
      this.modalPreviewInvoiceTitle = 'INVOICE';
      this.showPreviewInvoiceModal = true;
    },
    handlePreviewInvoiceCase() {
      this.showPreviewInvoiceModal = false;
      this.triggerNotification('success', 'You successfully created new task', 'Your task will be added to Vilo board.');
    },
    handleModalClose(value: boolean) {
      this.showAddInvoiceModal = false;
      this.showPreviewInvoiceModal = false;
    },
    handleButtonClick() {
      
    },
    handleDropdownClick() {
      console.log('Dropdown clicked');
    },
    handleSetReminder() {
      // Handle set reminder click
    },
    handlePreviewClick() {
      // Handle preview click
    },
    handleDownloadClick() {
      // Handle download click
    },
    handleDeleteClick() {
      // Handle delete click
    },
    handleEditClick() {
      // Handle edit click
    }
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
