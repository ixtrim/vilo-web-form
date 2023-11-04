<template>
  <div class="container-fluid">

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


    <h1>This is an dashboard page</h1>
  </div>
</template>

<style>
@import url(./styles/dashboard.scss);
</style>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Search   from '@/modules/Navigation/Search.vue';

export default defineComponent({
  components: {
    Search,
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>