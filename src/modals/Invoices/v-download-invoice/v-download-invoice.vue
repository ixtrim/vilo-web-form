<template>

  <div class="modal-body invoice" id="invoice-content" style="font-size: 13px;">
    <div class="row invoice__meta">
      <div class="col-lg-12">
        <h4>Billed to:</h4>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <strong style="font-size: 13px;">{{ clientName }}</strong>
      </div>
      <div class="col-lg-5">
        <span><strong>Invoice number:</strong> {{ invoiceNumber }}</span>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>{{ clientEmail }} | {{ clientPhone }}</span>
      </div>
      <div class="col-lg-5">
        <span><strong>Invoice Date:</strong> {{ formatDate(invoiceCreated) }}</span>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>{{ clientAddress }}</span>
      </div>
      <div class="col-lg-5">
        <span><strong>Due:</strong> {{ formatDate(invoiceDueDate) }}</span>
      </div>
    </div>
    <div class="invoice__table" style="margin: 88px 0 21px;">
      <table class="table table-bordered" style="border: 1px solid #D0D5DD; font-size: 13px;">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col" style="text-align: center;">Qty</th>
            <th scope="col">Price</th>
            <th scope="col">Discount</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="item in invoice?.invoiceItems" :key="item.id">
            <td>{{ item.item }}</td>
            <td style="text-align: center;">{{ item.quantity }}</td>
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
        <div class="invoice__summary" style="border-radius: 3px; background: #F9FAFB; padding: 12px 16px; font-size: 13px; line-height: 25px;">
          <div class="row">
            <div class="col-lg-9">
              <span> Sub total:</span>
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
              <span>{{ taxLabel }} Taxes:</span>
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
    <div class="row invoice__payment" style="margin: 40px 0 0; padding: 24px 10px; background: #F9FAFB; border-radius: 3px;">
      <div class="col-lg-12">
        <h5 style="font-size: 13px; color: #3538CD; font-weight: 500;">PAYMENT INSTRUCTIONS</h5>
        <p v-if="custom_app_name">
          {{ custom_app_name }}<br/>{{ custom_bank_name }} | {{ custom_swift_iban }}<br/>{{ custom_account_number }}<br/>
        </p>
        <p v-else>{{ appName }}<br/>
          Bank name: {{ bankName }}<br/>
          SWIFT/IBAN: {{ swiftIban }}<br/>
          Account number: {{ accountNumber }}<br/>
        </p>
        <p>For any questions please contact us at <a href="mailto:hi@vilo.com" style="color: #3538CD;">hi@vilo.com</a></p>
      </div>
    </div>
  </div>

  <div class="modal-footer align-center">
    <ul class="modal-footer__actions align-center">
      <li>&nbsp;</li>
      <li>
        <v-button :block="false" size="md" styled="outlined" @click="downloadPDF" text="Download Invoice"></v-button>
      </li>
      <li>&nbsp;</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import html2pdf from 'html2pdf.js';
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
    invoiceItems: InvoiceItem[];
    custom_app_name: string;
    custom_bank_name: string;
    custom_swift_iban: string;
    custom_account_number: string;
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
  const custom_app_name = computed(() => props.invoice?.custom_app_name || '');
  const custom_bank_name = computed(() => props.invoice?.custom_bank_name || '');
  const custom_swift_iban = computed(() => props.invoice?.custom_swift_iban || '');
  const custom_account_number = computed(() => props.invoice?.custom_account_number || '');

  const emit = defineEmits(['close-modal', 'invoice-pending', 'invoice-paid', 'invoice-refunded', 'invoice-cancelled']);

  function formatDate(timestamp: Timestamp | undefined) {
    return timestamp ? timestamp.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown Date';
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  const downloadPDF = () => {
    const element = document.getElementById('invoice-content');
    const options = {
      margin:       1,
      filename:     `Invoice-${invoiceNumber.value}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf() to process the content and download the PDF
    html2pdf().set(options).from(element).save();
  };

  function closeModal() {
    emit('close-modal');
  }
</script>

<style>
  @import url(@/components/v-modal/v-modal.scss);
  @import url(./v-download-invoice.scss);
</style>