<template>
  <div class="modal-body invoice">
    <div class="row invoice__meta">
      <div class="col-lg-12">
        <h4>Add New Invoice: {{ invoiceNumber }}</h4>
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
    <div class="row">
      <div class="col-lg-6">
        <div class="form-group">
          <label>Billed to:</label>
          <VDropdown :title="dropdownClientTitle" :items="dropdownClient" @item-clicked="onClientChanged" />
        </div>
      </div>
      <div class="col-lg-6" v-if="localClient !== '0'">
        <div class="form-group">
          <label>Case:</label>
          <VDropdown :title="dropdownCaseTitle" :items="dropdownCase" @item-clicked="onCaseChanged" />
        </div>
      </div>
    </div>
    <div class="row" v-if="errorClientCase">
      <div class="col-lg-12">
        <p class="error-message" >{{ errorClientCase }}</p>
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
      <p class="error-message" v-if="errorItems">{{ errorItems }}</p>
    </div>

    <div class="row">
      <div class="col-lg-5">
        <div class="form-group">
          <label>Tax (%)</label>
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
              <span>Sales Taxes:</span>
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
        <v-button :block="false" size="md" styled="green" @click="addInvoice" text="Add Invoice"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import { db } from '@/firebase.js';
  import { updateDoc, getDoc, doc, Timestamp, collection, writeBatch, getDocs, query, where, addDoc } from 'firebase/firestore';
  import { defineEmits, defineProps, ref, watch, computed, onMounted, } from 'vue';
  import type { Ref } from 'vue';
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

  interface User {
    full_name: string;
    id: string;
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

  const invoiceNumber = ref('');
  const invoiceCreated = ref(props.invoice?.created.toDate() || new Date());
  const invoiceDueDate = ref(props.invoice?.due_date.toDate() || new Date());
  const taxRate = ref(25);
  const dropdownClientTitle = ref('Your clients');
  const localClient = ref('0');
  const dropdownClient: Ref<DropdownItem[]> = ref([]);
  const dropdownCaseTitle = ref('You need to choose a case');
  const localCase = ref('0');
  const dropdownCase: Ref<DropdownItem[]> = ref([]);

  const errorClientCase = ref('');
  const errorItems = ref('');
  

  const fetchClients = async () => {
    const clientsQuery = query(collection(db, "users"), where("role", "in", [3, 4]));
    const querySnapshot = await getDocs(clientsQuery);
    dropdownClient.value = querySnapshot.docs.map(doc => ({
      label: doc.data().full_name as string,
      value: doc.id
    }));
  };

  const fetchCases = async () => {
    if (localClient.value === '0') {
      dropdownCase.value = [];
      return;
    }

    //const casesQuery = query(collection(db, "users"), where("role", "in", [3, 4]));
    const casesQuery = query(collection(db, "cases"), where("client_id", "==", localClient.value));
    const querySnapshot = await getDocs(casesQuery);
    dropdownCase.value = querySnapshot.docs.map(doc => ({
      label: doc.data().title as string,
      value: doc.id
    }));
  };

  async function onClientChanged(item: DropdownItem) {
    dropdownClientTitle.value = item.label;
    localClient.value = item.value;

    // Reset case selection
    localCase.value = '0';
    dropdownCaseTitle.value = 'You need to choose a case';

    if (localClient.value !== '0') {
      await fetchCases();
      await generateInvoiceNumber();
    }
  }

  async function generateInvoiceNumber() {
    if (localClient.value === '0' || localCase.value === '0') {
      invoiceNumber.value = '';
      return;
    }

    let clientInvCode = '';
    let caseInvCode = '';

    // Fetch the client's inv_code
    const clientDocRef = doc(db, "users", localClient.value);
    const clientDocSnap = await getDoc(clientDocRef);
    if (clientDocSnap.exists()) {
      clientInvCode = clientDocSnap.data().inv_code || '';
    }

    // Fetch the case's inv_code
    const caseDocRef = doc(db, "cases", localCase.value);
    const caseDocSnap = await getDoc(caseDocRef);
    if (caseDocSnap.exists()) {
      caseInvCode = caseDocSnap.data().inv_code || '';
    }

    // Generate the invoice number
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    invoiceNumber.value = `${clientInvCode}-${caseInvCode}-${formattedDate}`;
  }

  async function onCaseChanged(item: DropdownItem) {
    dropdownCaseTitle.value = item.label;
    localCase.value = item.value;

    errorClientCase.value = '';

    if (localCase.value !== '0') {
      await generateInvoiceNumber();
    }
  }

  function isFormValid() {
    errorClientCase.value = '';
    errorItems.value = '';

    if (localClient.value === '0' || localCase.value === '0') {
      errorClientCase.value = 'Please select a client and a case.';
      return false;
    }

    for (const item of invoiceItems.value) {
      if (!item.item.trim() || item.quantity <= 0 || item.price < 0) {
        errorItems.value = 'Please fill in all item fields correctly.';
        return false;
      }
    }

    return true;
  }

  onMounted(async () => {
    addItem();
    await fetchClients();
  });

  const emit = defineEmits(['close-modal', 'add-invoice']);

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
    errorClientCase.value = '';
    errorItems.value = '';
    emit('close-modal');
  }

  async function addInvoice() {
    if (!isFormValid()) {
      return;
    }

    errorClientCase.value = '';
    errorItems.value = '';

    // Prepare the invoice data
    const newInvoiceData = {
      client_id: localClient.value, // Assuming you've set this from dropdown
      case: localCase.value, // Assuming you've set this from dropdown
      created: Timestamp.fromDate(new Date(invoiceCreated.value)),
      due_date: Timestamp.fromDate(new Date(invoiceDueDate.value)),
      number: String(invoiceNumber.value),
      status: 0, // Assuming 0 is the default status for new invoices
      sales_taxes: Number(salesTaxes.value),
      subtotal_amount: Number(subtotal.value),
      total_amount: Number(totalAmount.value),
      total_discount: Number(totalDiscount.value),
      // Add any other fields you need
    };

    try {
      // Add the new invoice document to Firestore
      const invoiceRef = await addDoc(collection(db, "invoices"), newInvoiceData);

      // Add invoice items to the new invoice's subcollection
      const batch = writeBatch(db);
      invoiceItems.value.forEach((item) => {
        const itemRef = doc(collection(db, `invoices/${invoiceRef.id}/invoice_items`));
        batch.set(itemRef, {
          item: item.item,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          amount: (item.quantity * item.price) - (item.quantity * item.price * (item.discount / 100)),
        });
      });
      await batch.commit();

      emit('add-invoice', newInvoiceData); // You might want to adjust what you emit here
      closeModal();
    } catch (error) {
      console.error("Error adding new invoice to Firestore: ", error);
    }
  }

  function saveAndClose() {
    closeModal();
  }
</script>

<style>
  @import url(@/components/v-modal/v-modal.scss);
  @import url(./v-add-invoice.scss);
</style>