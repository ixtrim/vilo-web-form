<template>
  <div class="module-invoices">
    <div class="row">
      <div class="col-lg-8">
        <h3>Recent Invoices</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink @click="" styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 align-center">
        <img src="@/assets/temporary/income-chart.svg" alt="Total income" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VLink from '@/components/v-link/VLink.vue';


export default defineComponent({
  components: {
    VLink,
  },
});
</script>

<style>
  @import url(./Invoices.scss);
</style>