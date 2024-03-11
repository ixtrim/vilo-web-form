<template>
  <div class="modal-body invoice">
    <div class="row invoice__meta">
      <div class="col-lg-12">
        <h4>Edit Invoice number: {{ invoiceNumber }}</h4>
      </div>
    </div>
    <div class="row invoice__meta mt-2 mb-2">
      <div class="col-lg-6">
        <div class="form-group">
          <label>Invoice Date: </label>
          <VueDatePicker v-model="invoiceCreated" format="yyyy-MM-dd"></VueDatePicker>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <label>Due Date: </label>
          <VueDatePicker v-model="invoiceDueDate" format="yyyy-MM-dd"></VueDatePicker>
        </div>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-12">
        <strong>Billed to:</strong>
        <span>{{ clientName }}<br/>{{ clientEmail }} | {{ clientPhone }}<br/>{{ clientAddress }}</span>
      </div>
    </div>
    

    <div class="invoice__table">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col" class="align-center">Qty</th>
            <th scope="col">Price</th>
            <th scope="col">Discount</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="item in invoice?.invoiceItems" :key="item.id">
            <td>{{ item.item }}</td>
            <td class="align-center">{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ formatCurrency(item.discount) }}</td>
            <td>{{ formatCurrency(item.amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row">
      <div class="col-lg-5"></div>
      <div class="col-lg-7">
        <div class="invoice__summary">
          <div class="row">
            <div class="col-lg-9">
              <span>Sub total:</span>
            </div>
            <div class="col-lg-3">
              <span>{{ typeof invoiceSubtotalAmount === 'number' ? formatCurrency(invoiceSubtotalAmount) : invoiceSubtotalAmount }}</span>
            </div>
          </div>
          <div class="row" v-if="Number(invoiceTotalDiscount) > 0">
            <div class="col-lg-9">
              <span>Total discount:</span>
            </div>
            <div class="col-lg-3">
              <span>{{ typeof invoiceTotalDiscount === 'number' ? formatCurrency(invoiceTotalDiscount) : invoiceTotalDiscount }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-9">
              <span>Sales Taxes:</span>
            </div>
            <div class="col-lg-3">
              <span>{{ typeof invoiceSalesTaxes === 'number' ? formatCurrency(invoiceSalesTaxes) : invoiceSalesTaxes }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-9">
              <strong>Amount due:</strong>
            </div>
            <div class="col-lg-3">
              <strong>{{ typeof invoiceTotalAmount === 'number' ? formatCurrency(invoiceTotalAmount) : invoiceTotalAmount }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <div class="modal-footer">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="green" @click="statusChanges" text="Save Changes"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import { db } from '@/firebase.js';
  import { updateDoc, doc, Timestamp } from 'firebase/firestore';
  import { defineEmits, defineProps, ref, watch, computed } from 'vue';
  import type { PropType } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import VButton from '@/components/v-button/VButton.vue';

  type Invoice = {
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
  };

  interface InvoiceItem {
    id: string;
    item: string;
    quantity: number;
    price: number;
    discount: number;
    amount: number;
  }

  interface DropdownItem {
    label: string;
    value: string;
  }

  const props = defineProps({
    invoice: Object as PropType<Invoice>,
    generalSettings: {
      type: Object as PropType<{
        app_name?: string;
      }>,
      default: () => ({})
    },
    billingSettings: {
      type: Object as PropType<{
        bank_name?: string;
        swift_iban?: string;
        account_number?: string;
      }>,
      default: () => ({})
    },
    userRole: Number
  });

  const appName = computed(() => props.generalSettings?.app_name || 'Default App Name');
  const bankName = computed(() => props.billingSettings?.bank_name || 'Default Bank Name');
  const swiftIban = computed(() => props.billingSettings?.swift_iban || 'Default SWIFT/IBAN');
  const accountNumber = computed(() => props.billingSettings?.account_number || 'Default Account Number');
  const clientName = computed(() => props.invoice?.clientName || 'Unknown');
  const clientEmail = computed(() => props.invoice?.clientEmail || 'Unknown');
  const clientPhone = computed(() => props.invoice?.clientPhone || 'Unknown');
  const clientAddress = computed(() => props.invoice?.clientAddress || 'Unknown');
  const invoiceNumber = computed(() => props.invoice?.number || 'Unknown');
  const invoiceStatus = computed(() => props.invoice?.status || '0');
  const invoiceCreated = ref(props.invoice?.created.toDate() || new Date());
  const invoiceDueDate = ref(props.invoice?.due_date.toDate() || new Date());
  const invoiceSalesTaxes = computed(() => props.invoice?.sales_taxes || 'Unknown');
  const invoiceSubtotalAmount = computed(() => props.invoice?.subtotal_amount || 'Unknown');
  const invoiceTotalAmount = computed(() => props.invoice?.total_amount || 'Unknown');
  const invoiceTotalDiscount = computed(() => props.invoice?.total_discount || 'Unknown');

  const emit = defineEmits(['close-modal', 'save-changes']);

  function formatDate(timestamp: Timestamp | undefined) {
    return timestamp ? timestamp.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown Date';
  }

  function formatCurrency(amount: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }

  function closeModal() {
    emit('close-modal');
  }

  function statusChanges() {
    if (!props.invoice) {
      console.error("Invoice data is not available.");
      return;
    }

    // Convert JavaScript Date to Firestore Timestamp
    const updatedCreated = Timestamp.fromDate(new Date(invoiceCreated.value));
    const updatedDueDate = Timestamp.fromDate(new Date(invoiceDueDate.value));

    // Firestore document reference
    const invoiceRef = doc(db, "invoices", props.invoice.id);

    // Update the document
    updateDoc(invoiceRef, {
      created: updatedCreated,
      due_date: updatedDueDate,
    }).then(() => {
      emit('save-changes', {
        ...props.invoice,
        created: updatedCreated,
        due_date: updatedDueDate,
      });
      closeModal();
    }).catch((error) => {
      console.error("Error updating document: ", error);
    });
  }

  function saveAndClose() {
    closeModal();
  }
</script>

<style>
  @import url(@/components/v-modal/v-modal.scss);
  @import url(./v-edit-invoice.scss);
</style>