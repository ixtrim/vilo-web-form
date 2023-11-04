<template>
  <div class="container-fluid ">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading mb-0">
          <h1>Dashboard</h1>
          <p>Your current working summary and activity.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <Search :value="searchTerm" @input="updateSearchTerm" />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__separator">
        &nbsp;
      </div>
    </div>

    <div class="row">
      <div class="col-lg-7">
        <Income />
      </div>
      <div class="col-lg-5">
        <Invoices />
      </div>
    </div>

    

    

  </div>
</template>

<style>
@import url(./styles/dashboard.scss);
</style>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Search   from '@/modules/Navigation/Search.vue';
import VLink from '@/components/v-link/VLink.vue';
import Income from '@/modules/Home/Income/Income.vue';
import Invoices from '@/modules/Home/Invoices/Invoices.vue';

export default defineComponent({
  components: {
    Search,
    VLink,
    Income,
    Invoices
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>