<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading">
          <h1>Client management</h1>
          <p>Manage your team members and their account permissions here.</p>
        </div>
      </div>
      <div class="col-lg-2">
        <Search />
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__users">

          <div class="row dashboard__users__head">
            <div class="col-lg-2 first-col">
              <input type="checkbox" id="remember" class="mr-8p">
              <h5>Name</h5>
            </div>
            <div class="col-lg-2">
              <h5>Phone</h5>
            </div>
            <div class="col-lg-2">
              <h5>Position</h5>
            </div>
            <div class="col-lg-2">
              <h5>Company</h5>
            </div>
            <div class="col-lg-2">
              <h5>Address</h5>
            </div>
          </div>

          <div class="dashboard__users__page">

            <div class="row dashboard__list__page__item">
              <div class="col-lg-2 first-col">
                <input type="checkbox" id="user1" class="mr-8p">
                <VUser :userName="userName" :userEmail="userEmail" />

              </div>
              <div class="col-lg-2">
                <p>+1 6754 6678 66</p>
              </div>
              <div class="col-lg-2">
                <p>Sales</p>
              </div>
              <div class="col-lg-2">
                <p>Individual</p>
              </div>
              <div class="col-lg-2">
                <p>132, My Street, Kingston, New York 12401, USA</p>
              </div>
              <div class="col-lg-1">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
      Open Modal
    </button>
              </div>
            </div>

          </div>
          

        </div>
      </div>
    </div>

    <VModalSmall :title="'My Modal Title'">
      <p>Content for the modal goes here...</p>
    </VModalSmall>

    <div class="row bottom-pagination">
      <div class="col-lg-2 align-left">
        <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="handleButtonClick" text="Previous"></v-button>
      </div>
      <div class="col-lg-8 align-center">
        <v-pagination-list :total-pages="6" @update:currentPage="updatePage" />
      </div>
      <div class="col-lg-2 align-right">
        <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="handleButtonClick" text="Next"></v-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';
import Search   from '@/modules/Navigation/Search.vue';
import VUser from '@/components/v-user/v-user.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';

export default defineComponent({
  components: {
    Search,
    VLink,
    VButton,
    VUser,
    VPaginationList,
    VModalSmall,
  },
  data() {
    return {
      userName: 'Olivia Rhye',
      userEmail: 'olivia@untitledui.com'
    };
  },
  setup() {
    const itemsPerPage = 10;
    const allItems = ref([
      { id: 1, name: 'Page 1' },
      { id: 2, name: 'Page 2' },
      { id: 3, name: 'Page 3' },
      { id: 4, name: 'Page 4' },
      { id: 5, name: 'Page 5' },
      { id: 6, name: 'Page 6' },
      { id: 7, name: 'Page 7' },
      { id: 8, name: 'Page 8' },
      { id: 9, name: 'Page 9' },
      { id: 10, name: 'Page 10' },
      { id: 11, name: 'Page 11' },
      { id: 12, name: 'Page 12' },
    ]);
    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(allItems.value.length / itemsPerPage));

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return allItems.value.slice(start, end);
    });

    const updatePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    return {
      paginatedItems,
      totalPages,
      currentPage,
      updatePage
    };
  },
  methods: {
    handleButtonClick() {
      
    },
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
