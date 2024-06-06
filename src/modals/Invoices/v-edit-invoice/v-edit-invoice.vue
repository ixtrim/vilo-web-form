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
      <div class="col-lg-6">
        <strong>Billed by:</strong>
        <div v-if="custom_company_name">
          <span>{{ custom_company_name }}<br/>
          Bank name: {{ custom_bank_name }}<br/>
          Account number: {{ custom_account_number }}<br/>
          Branch: {{ custom_branch }}<br/>
          Address: {{ custom_address }}<br/>
          Sort code: {{ custom_sort_code }}<br/></span>
        </div>
        <div v-else><span>{{ appName }}<br/>{{ bankName }} | {{ swiftIban }}<br/>{{ accountNumber }}</span></div>
      </div>
      <div class="col-lg-6">
        <strong>Billed to:</strong>
        <span>{{ clientName }}<br/>{{ clientEmail }} | {{ clientPhone }}<br/>{{ clientAddress }}</span>
      </div>
    </div>

    <div class="invoice__table">
      <!-- Inside your <template> tag, within the <div class="invoice__table"> -->
      <table class="table table-bordered">
        <tbody>
          <tr v-for="(item, index) in invoiceItems" :key="item.id">
            <td>
              <div class="form-group">
                <label>Item</label>
                <input v-model="item.item" type="text" class="form-control" />
              </div>
            </td>
            <td style="width: 70px">
              <div class="form-group">
                <label>Qty</label>
                <input v-model="item.quantity" type="number" class="form-control" @change="validateQuantity(item, index)" />
              </div>
            </td>
            <td style="width: 90px">
              <div class="form-group">
                <label>Price</label>
                <input v-model="item.price" type="number" class="form-control" @change="validatePrice(item, index)" />
              </div>
            </td>
            <td style="width: 90px">
              <div class="form-group">
                <label>Discount (%)</label>
                <input v-model="item.discount" type="number" class="form-control" @change="validateDiscount(item, index)" />
              </div>
            </td>
            <td style="width: 90px">
              <div class="form-group">
                <label>Total price</label>
                {{ calculateAmount(item) }}
              </div>
            </td>
            <td style="width: 16px; padding: 10px 0 0;">
              <v-button v-if="invoiceItems.length > 1" :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="removeItem(index)" text=""></v-button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4"></td>
            <td colspan="2">
              <VLink @click="addItem" styled="primary" icon="left" icon-style="add-blue" to="#">Add Item</VLink>
          </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="row">
      <div class="col-lg-5">
        <div class="form-group">
          <label>{{ taxLabel }}  Tax (%)</label>
          <input type="number" class="form-control" v-model.number="taxRate" />
        </div>
      </div>
      <div class="col-lg-7">
        <div class="invoice__summary">
          <div class="row">
            <div class="col-lg-9">
              <span>Sub total:</span>
            </div>
            <div class="col-lg-3">
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
          </div>
          <div class="row" v-if="totalDiscount > 0">
            <div class="col-lg-9">
              <span>Total discount:</span>
            </div>
            <div class="col-lg-3">
              <span>{{ formatCurrency(totalDiscount) }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-9">
              <span>{{ taxLabel }}  Tax:</span>
            </div>
            <div class="col-lg-3">
              <span>{{ formatCurrency(salesTaxes) }}</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-9">
              <strong>Amount due:</strong>
            </div>
            <div class="col-lg-3">
              <strong>{{ formatCurrency(totalAmount) }}</strong>
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
  import { updateDoc, doc, Timestamp, collection, writeBatch, getDocs } from 'firebase/firestore';
  import { defineEmits, defineProps, ref, watch, computed } from 'vue';
  import type { PropType } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import VButton from '@/components/v-button/VButton.vue';
  import VLink from '@/components/v-link/VLink.vue';

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
  const invoiceCreated = ref(props.invoice?.created.toDate() || new Date());
  const invoiceDueDate = ref(props.invoice?.due_date.toDate() || new Date());
  const invoiceSalesTaxes = computed(() => props.invoice?.sales_taxes || 'Unknown');
  const invoiceSubtotalAmount = computed(() => props.invoice?.subtotal_amount || 'Unknown');
  const invoiceTotalAmount = computed(() => props.invoice?.total_amount || 'Unknown');
  const invoiceTotalDiscount = computed(() => props.invoice?.total_discount || 'Unknown');
  const taxRate = ref(25);
  const custom_company_name = computed(() => props.invoice?.custom_company_name || '');
  const custom_bank_name = computed(() => props.invoice?.custom_bank_name || '');
  const custom_branch = computed(() => props.invoice?.custom_branch || '');
  const custom_account_number = computed(() => props.invoice?.custom_account_number || '');
  const custom_address = computed(() => props.invoice?.custom_address || '');
  const custom_sort_code = computed(() => props.invoice?.custom_sort_code || '');

  const emit = defineEmits(['close-modal', 'save-changes']);

  const invoiceItems = ref(props.invoice ? [...props.invoice.invoiceItems] : []);

  const addItem = () => {
    invoiceItems.value.push({
      id: generateUniqueId(),
      item: '',
      quantity: 1,
      price: 0,
      discount: 0,
      amount: 0,
    });
  };

  const removeItem = (index: number) => {
    invoiceItems.value.splice(index, 1);
  };

  const subtotal = computed(() => {
    return invoiceItems.value.reduce((acc, item) => {
      const itemTotal = (item.quantity * item.price) - ((item.quantity * item.price) * (item.discount / 100));
      return acc + itemTotal;
    }, 0);
  });

  const totalDiscount = computed(() => {
    return invoiceItems.value.reduce((acc, item) => {
      const discountAmount = (item.quantity * item.price) * (item.discount / 100);
      return acc + discountAmount;
    }, 0);
  });

  const salesTaxes = computed(() => {
    return subtotal.value * (taxRate.value / 100);
  });

  const totalAmount = computed(() => {
    return subtotal.value + salesTaxes.value - totalDiscount.value;
  });

  function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  function validateQuantity(item: InvoiceItem, index: number) {
    if (item.quantity < 1) {
      item.quantity = 1;
      invoiceItems.value[index] = { ...item };
    }
  }

  function validatePrice(item: InvoiceItem, index: number) {
    if (item.price < 0) {
      item.price = 0;
      invoiceItems.value[index] = { ...item };
    }
  }

  function validateDiscount(item: InvoiceItem, index: number) {
    if (item.discount < 0) {
      item.discount = 0;
      invoiceItems.value[index] = { ...item };
    }
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

  function calculateAmount(item: InvoiceItem): string {
    const amount = (item.quantity * item.price) - ((item.quantity * item.price) * (item.discount / 100));
    return formatCurrency(amount);
  }

  function closeModal() {
    emit('close-modal');
  }

  async function statusChanges() {
    // Check if props.invoice is defined and has an id
    const invoiceId = props.invoice?.id;
    if (!invoiceId) {
      console.error("Invoice data is not available.");
      return;
    }

    // Proceed with recalculations and Firestore operations
    const recalculatedSubtotal = invoiceItems.value.reduce((acc, item) => acc + (item.quantity * item.price) - (item.quantity * item.price * item.discount / 100), 0);
    const recalculatedTotalDiscount = invoiceItems.value.reduce((acc, item) => acc + (item.quantity * item.price * item.discount / 100), 0);
    const recalculatedSalesTaxes = recalculatedSubtotal * (taxRate.value / 100);
    const recalculatedTotalAmount = recalculatedSubtotal + recalculatedSalesTaxes - recalculatedTotalDiscount;

    const updatedInvoiceData = {
      created: Timestamp.fromDate(new Date(invoiceCreated.value)),
      due_date: Timestamp.fromDate(new Date(invoiceDueDate.value)),
      sales_taxes: Number(recalculatedSalesTaxes),
      subtotal_amount: Number(recalculatedSubtotal),
      total_amount: Number(recalculatedTotalAmount),
      total_discount: Number(recalculatedTotalDiscount),
    };

    const batch = writeBatch(db);

    // Update the main invoice document using invoiceId
    const invoiceRef = doc(db, "invoices", invoiceId);
    batch.update(invoiceRef, updatedInvoiceData);

    // Delete existing invoice items using invoiceId
    const existingItemsRef = collection(db, `invoices/${invoiceId}/invoice_items`);
    const existingItemsSnapshot = await getDocs(existingItemsRef);
    existingItemsSnapshot.forEach((docSnapshot) => {
      batch.delete(doc(db, `invoices/${invoiceId}/invoice_items`, docSnapshot.id));
    });

    // Add new/updated invoice items using invoiceId
    invoiceItems.value.forEach((item) => {
      const itemAmount = (item.quantity * item.price) - (item.quantity * item.price * (item.discount / 100));
      const newItemRef = doc(collection(db, `invoices/${invoiceId}/invoice_items`));
      batch.set(newItemRef, {
        item: item.item,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        amount: itemAmount,
      });
    });

    try {
      await batch.commit();
      emit('save-changes', {
        ...props.invoice,
        ...updatedInvoiceData,
        invoiceItems: invoiceItems.value,
      });
      closeModal();
    } catch (error) {
      console.error("Error saving changes to Firestore: ", error);
    }
  }


  function saveAndClose() {
    closeModal();
  }
</script>

<style>
  @import url(@/components/v-modal/v-modal.scss);
  @import url(./v-edit-invoice.scss);
</style>