<template>
  <div class="modal-body invoice">
    <div class="row invoice__meta">
      <div class="col-lg-12">
        <h4>Billed to:</h4>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>John Doe</span>
      </div>
      <div class="col-lg-5">
        <span>Invoice number: INV-0002</span>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>johndoe@vilo.com | +64 123 1234 123</span>
      </div>
      <div class="col-lg-5">
        <span>Invoice Date: 02 Jan 2023</span>
      </div>
    </div>
    <div class="row invoice__meta">
      <div class="col-lg-7">
        <span>132, My Street, Kingston, New York 12401, USA</span>
      </div>
      <div class="col-lg-5">
        <span>Due: 20 Jan 2023</span>
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

    <div class="row" style="opacity: 0;">
      <div class="col-lg-5"></div>
      <div class="col-lg-7">
        <div class="invoice__summary">
          <div class="row">
            <div class="col-lg-9">
              <span>Sub total:</span>
            </div>
            <div class="col-lg-3">
              <span>$6,000.00</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-9">
              <span>Sales Taxes:</span>
            </div>
            <div class="col-lg-3">
              <span>$60.00</span>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-9">
              <strong>Amount due on 20 Jan 2023:</strong>
            </div>
            <div class="col-lg-3">
              <strong>$6,060.00</strong>
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
  <div class="modal-footer">
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
  import type { PropType } from 'vue';
  import VButton from '@/components/v-button/VButton.vue';

  const props = defineProps({
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
    }
  });

  const appName = computed(() => props.generalSettings?.app_name || 'Default App Name');
  const bankName = computed(() => props.billingSettings?.bank_name || 'Default Bank Name');
  const swiftIban = computed(() => props.billingSettings?.swift_iban || 'Default SWIFT/IBAN');
  const accountNumber = computed(() => props.billingSettings?.account_number || 'Default Account Number');

  const emit = defineEmits(['close-modal', 'mark-paid']);

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