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

    <div class="invoice__table" style="opacity: 0;">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Qty</th>
            <th scope="col">Price</th>
            <th scope="col">Discount</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Legal Advising</td>
            <td>1</td>
            <td>2000.00</td>
            <td>0.00</td>
            <td>2,000.00</td>
          </tr>
          <tr>
            <td>Expert Consulting</td>
            <td>1</td>
            <td>2000.00</td>
            <td>0.00</td>
            <td>2,000.00</td>
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
        <p>{{ appName }}<br/>
          Bank name: {{ bankName }}<br/>
          SWIFT/IBAN: {{ swiftIban }}<br/>
          Account number: {{ accountNumber }}<br/>
        </p>
        <p>For any questions please contact us at <a href="mailto:hi@vilo.com">hi@vilo.com</a></p>
      </div>
    </div>

  </div>
  <div class="modal-footer" v-if="userRole !== 3 && userRole !== 4">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="green" @click="saveAndClose" text="Mark as paid"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, ref, watch, computed } from 'vue';
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
  };

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
  const invoiceStatus = computed(() => props.invoice?.status || 'Unknown');
  const invoiceCreated = computed(() => props.invoice?.created || undefined);
  const invoiceDueDate = computed(() => props.invoice?.due_date || undefined);
  const invoiceSalesTaxes = computed(() => props.invoice?.sales_taxes || 'Unknown');
  const invoiceSubtotalAmount = computed(() => props.invoice?.subtotal_amount || 'Unknown');
  const invoiceTotalAmount = computed(() => props.invoice?.total_amount || 'Unknown');
  const invoiceTotalDiscount = computed(() => props.invoice?.total_discount || 'Unknown');

  const emit = defineEmits(['close-modal', 'mark-paid']);

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

  function saveAndClose() {
    emit('mark-paid');
    closeModal();
  }
</script>

<style>
  @import url(@/components/v-modal/v-modal.scss);
  @import url(./v-preview-invoice.scss);
</style>