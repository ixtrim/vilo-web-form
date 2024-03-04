<template>
  <div class="recent-invoices">
    <div class="row">
      <div class="col-lg-8">
        <h3>Recent Invoices</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/invoices" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 align-center">
        <div v-for="invoice in invoices" :key="invoice.id" class="recent-invoices__item">
          <div class="recent-invoices__item__number">
            <h4>{{ invoice.number }}</h4>
          </div>
          <div class="recent-invoices__item__user">
            <!-- Assuming you have a method to fetch user details by client_id -->
            <VUser :userName="invoice.clientName" :userEmail="invoice.clientEmail" />
          </div>
          <div class="recent-invoices__item__status">
            <VBadge :variant="invoice.status === 1 ? 'warning' : 'light'">{{ invoice.status === 1 ? 'Pending' : 'Draft' }}</VBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { db } from '@/firebase.js';
import { query, collection, orderBy, limit, getDocs } from 'firebase/firestore';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import VUser from '@/components/v-user/v-user.vue';

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  status: number;
}

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VUser,
  },
  setup() {
    const invoices = ref<Invoice[]>([]); // Use the Invoice interface here

    const fetchInvoices = async () => {
      const invoicesQuery = query(collection(db, "invoices"), orderBy("due_date", "desc"), limit(3));
      const querySnapshot = await getDocs(invoicesQuery);
      invoices.value = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Replace the placeholders with your actual logic to fetch client name and email
        return {
          id: doc.id,
          number: data.number,
          clientName: "Client Name", // Placeholder
          clientEmail: "client@email.com", // Placeholder
          status: data.status,
        };
      });
    };

    onMounted(fetchInvoices);

    return {
      invoices,
    };
  },
});
</script>

<style>
  @import url(./RecentInvoices.scss);
</style>
