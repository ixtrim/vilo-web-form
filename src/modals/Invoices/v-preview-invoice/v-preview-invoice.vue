<template>
  <div class="modal-body invoice">
    <div class="row invoice__meta">
      <div class="col-lg-12">
        <h4>Billed to:</h4>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>{{ clientName }}</span>
      </div>
      <div class="col-lg-5">
        <span>Invoice number: {{ invoiceNumber }}</span>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>{{ clientEmail }} | {{ clientPhone }}</span>
      </div>
      <div class="col-lg-5">
        <span>Invoice Date: {{ formatDate(invoiceCreated) }}</span>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>{{ clientAddress }}</span>
      </div>
      <div class="col-lg-5">
        <span>Due: {{ formatDate(invoiceDueDate) }}</span>
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
            <td>{{ formatCurrency(calculateItemAmount(item)) }}</td>
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
              <span>{{ taxLabel }} Tax:</span>
            </div>
            <div class="col-lg-3">
              <span>{{ typeof invoiceSalesTaxes === 'number' ? formatCurrency(invoiceSalesTaxes) : invoiceSalesTaxes }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-9">
              <strong>Amount due on {{ formatDate(invoiceDueDate) }}:</strong>
            </div>
            <div class="col-lg-3">
              <strong>{{ typeof invoiceTotalAmount === 'number' ? formatCurrency(invoiceTotalAmount) : invoiceTotalAmount }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row invoice__payment">
      <div class="col-lg-12">
        <h5>PAYMENT INSTRUCTIONS</h5>
        <p v-if="custom_company_name || custom_bank_name || custom_account_number || custom_branch || custom_address || custom_sort_code">
          {{ custom_company_name }}<br/>
          Bank name: {{ custom_bank_name }}<br/>
          Account number: {{ custom_account_number }}<br/>
          Branch: {{ custom_branch }}<br/>
          Address: {{ custom_address }}<br/>
          Sort code: {{ custom_sort_code }}<br/>
        </p>
        <p v-else>{{ appName }}<br/>
          Bank name: {{ bankName }}<br/>
          SWIFT/IBAN: {{ swiftIban }}<br/>
          Account number: {{ accountNumber }}<br/>
        </p>
        <p>For any questions please contact us at <a href="mailto:hi@vilo.com">hi@vilo.com</a></p>
      </div>
    </div>
  </div>
  <div class="modal-footer" v-if="(userRole === 0 || userRole === 2)  && invoiceStatus === '0'">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="green" @click="statusChangeToPending" text="Send To Client"></v-button>
      </li>
    </ul>
  </div>
  <div class="modal-footer" v-if="(userRole === 0 || userRole === 2) && invoiceStatus === 1">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="green" @click="statusChangeToPaid" text="Mark as paid"></v-button>
      </li>
    </ul>
  </div>
  <div class="modal-footer" v-if="(userRole === 0 || userRole === 2) && invoiceStatus === 2">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="orange" @click="statusChangeToRefunded" text="Mark as refunded"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="red" @click="statusChangeToCancelled" text="Mark as cancelled"></v-button>
      </li>
    </ul>
  </div>
  <div class="modal-footer align-center" v-if="(userRole === 0 || userRole === 2) && (invoiceStatus === 3 || invoiceStatus === 4)">
    <ul class="modal-footer__actions align-center">
      <li>&nbsp;</li>
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>&nbsp;</li>
    </ul>
  </div>
  <div class="modal-footer align-center" v-if="userRole === 1 || userRole === 3 || userRole === 4">
    <ul class="modal-footer__actions align-center">
      <li>&nbsp;</li>
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>&nbsp;</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, computed, watch } from 'vue';
import { Timestamp } from 'firebase/firestore';
import type { PropType } from 'vue';
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
  custom_company_name: string;
  custom_bank_name: string;
  custom_branch: string;
  custom_account_number: string;
  custom_address: string;
  custom_sort_code: string;
};

interface InvoiceItem {
  id: string;
  item: string;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
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
  userRole: Number,
  taxLabel: String,
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
const invoiceCreated = computed(() => props.invoice?.created || undefined);
const invoiceDueDate = computed(() => props.invoice?.due_date || undefined);
const invoiceSalesTaxes = computed(() => props.invoice?.sales_taxes || 'Unknown');
const invoiceSubtotalAmount = computed(() => props.invoice?.subtotal_amount || 'Unknown');
const invoiceTotalAmount = computed(() => props.invoice?.total_amount || 'Unknown');
const invoiceTotalDiscount = computed(() => props.invoice?.total_discount || 'Unknown');
const custom_company_name = computed(() => props.invoice?.custom_company_name || '');
const custom_bank_name = computed(() => props.invoice?.custom_bank_name || '');
const custom_branch = computed(() => props.invoice?.custom_branch || '');
const custom_account_number = computed(() => props.invoice?.custom_account_number || '');
const custom_address = computed(() => props.invoice?.custom_address || '');
const custom_sort_code = computed(() => props.invoice?.custom_sort_code || '');

const emit = defineEmits(['close-modal', 'invoice-pending', 'invoice-paid', 'invoice-refunded', 'invoice-cancelled']);

// Watcher to react to changes in the invoice prop
watch(() => props.invoice, (newInvoice) => {
  console.log("Invoice prop updated", newInvoice);
}, { deep: true });

function calculateItemAmount(item: any) {
  const amount = (item.price * item.quantity) - (item.price * item.quantity * item.discount / 100);
  return amount;
}

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

function statusChangeToPending() {
  emit('invoice-pending', props.invoice?.id);
  closeModal();
}

function statusChangeToPaid() {
  emit('invoice-paid', props.invoice?.id);
  closeModal();
}

function statusChangeToRefunded() {
  emit('invoice-refunded', props.invoice?.id);
  closeModal();
}

function statusChangeToCancelled() {
  emit('invoice-cancelled', props.invoice?.id);
  closeModal();
}

function saveAndClose() {
  closeModal();
}
</script>


<style>
  @import url(@/components/v-modal/v-modal.scss);
  @import url(./v-preview-invoice.scss);
</style>