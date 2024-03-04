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
            <VUser :userAvatar="invoice.clientAvatar" :userName="invoice.clientName" :userEmail="invoice.clientEmail" />
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
import { doc, getDoc, query, collection, orderBy, limit, getDocs } from 'firebase/firestore';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import VUser from '@/components/v-user/v-user.vue';

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  clientAvatar: string;
  status: number;
}

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VUser,
  },
  setup() {
    const invoices = ref<Invoice[]>([]);

    const fetchInvoices = async () => {
      const invoicesQuery = query(collection(db, "invoices"), orderBy("due_date", "desc"), limit(3));
      const querySnapshot = await getDocs(invoicesQuery);
      const invoicesWithClientInfo = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const invoiceData = docSnapshot.data();
        const clientDocRef = doc(db, "users", invoiceData.client_id);
        const clientDocSnap = await getDoc(clientDocRef);
        let clientName = "Unknown Client";
        let clientEmail = "No Email";
        let clientAvatar = "https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/vilo_app%2Favatar.png?alt=media&token=05cebcce-137e-42f2-bd6d-7d8b1ad76b67";
        if (clientDocSnap.exists()) {
          const clientData = clientDocSnap.data();
          clientName = clientData.full_name;
          clientEmail = clientData.email;
          clientAvatar = clientData.avatar;
        }
        return {
          id: docSnapshot.id,
          number: invoiceData.number,
          clientName,
          clientEmail,
          clientAvatar,
          status: invoiceData.status,
        };
      }));

      invoices.value = invoicesWithClientInfo;
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
