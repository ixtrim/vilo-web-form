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

        <div class="recent-invoices__item">
          <div class="recent-invoices__item__number">
            <h4>INV-3066</h4>
          </div>
          <div class="recent-invoices__item__user">
            <VUser userName="Olivia Rhye" userEmail="olivia@untitledui.com" />
          </div>
          <div class="recent-invoices__item__status">
            <VBadge variant="warning">Pending</VBadge>
          </div>
        </div>

        <div class="recent-invoices__item">
          <div class="recent-invoices__item__number">
            <h4>INV-3065</h4>
          </div>
          <div class="recent-invoices__item__user">
            <VUser userName="Phoenix Baker" userEmail="phoenix@untitledui.com" />
          </div>
          <div class="recent-invoices__item__status">
            <VBadge variant="warning">Pending</VBadge>
          </div>
        </div>

        <div class="recent-invoices__item">
          <div class="recent-invoices__item__number">
            <h4>INV-3064</h4>
          </div>
          <div class="recent-invoices__item__user">
            <VUser userName="Lana Steiner" userEmail="lana@untitledui.com" />
          </div>
          <div class="recent-invoices__item__status">
            <VBadge variant="light">Draft</VBadge>
          </div>
        </div>
        
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