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

        
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import VUser from '@/components/v-user/v-user.vue';

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VUser,
  },
});
</script>

<style>
  @import url(./RecentInvoices.scss);
</style>