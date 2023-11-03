<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading mb-0">
          <h1>Case Boards</h1>
          <p>Manage your boards and tasks.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="true" size="sm" icon="left" icon-style="add" styled="outlined" @click="handleButtonClick" text="Add new case"></VButton>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__line">
        <hr />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__filters">

          <div class="row">
            <div class="col-lg-3">
              <div class="dashboard__filters">
                <Search />
              </div>
            </div>
            <div class="col-lg-6"></div>
            <div class="col-lg-3">
              <ul class="settings__team-actions">
                <li>
                  <VDropdown :title="'Sort by date'" :items="sortTime" @item-clicked="handleDropdownClick" />
                </li>
                <li>
                  <VDropdown :title="'All cases'" :items="sortTime" @item-clicked="handleDropdownClick" />
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        
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
import VDropdown from '@/components/v-dropdown/VDropdown.vue';

export default defineComponent({
  components: {
    Search,
    VLink,
    VButton,
    VUser,
    VPaginationList,
    VModalSmall,
    VDropdown,
  },
  data() {
    return {
      userName: 'Olivia Rhye',
      userEmail: 'olivia@untitledui.com',
      sortTime: [
        { label: 'All' },
        { label: 'Last year' },
        { label: 'Last three months' },
        { label: 'Last two months' },
        { label: 'Last month' },
        { label: 'This week' },
      ],
      sortCases: [
        { label: 'Internal user' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
        { label: 'Admin' },
      ],
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
