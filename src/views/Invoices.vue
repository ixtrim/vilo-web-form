<template>
  
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
