<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading">
          <h1>Calendar</h1>
          <p> Create and manage your meetings and events.</p>
        </div>
      </div>
      <div class="col-lg-2" style="display: none;">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" @click="handleButtonClick" text="Add new event"></VButton>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Europe%2FMadrid&src=c2tvemluc2thd2ViQGdtYWlsLmNvbQ&src=Y2Q3NDhjODliZmNlNmQyY2E1YTZkM2Y3ZTZhYWU5OWQ1ZmI0ZWI5YWFjMTQ0ZmMxYjcxZjU2NTFhYTIxZjI2OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OHVnM3NoN3FpbDVlODlkdDYyNzJuajBiMWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=b3RhMGRwdTNwdXEzdWduNDQxcmd2YmN1dmNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uc3BhaW4jaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039BE5&color=%23AD1457&color=%239E69AF&color=%23E4C441&color=%2333B679&color=%230B8043" style="border-width:0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>
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
