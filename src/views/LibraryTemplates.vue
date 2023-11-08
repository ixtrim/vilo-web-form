<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading mb-0">
          <h1>Library</h1>
          <p> Create and manage your team documents and templates.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="handleButtonClick" text="Add new template"></VButton>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__separator">
        &nbsp;
      </div>
    </div>

    <div class="row mt5">
      <div class="col-lg-12">
        <TabsLibrary />
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
              <ul class="dashboard__actions">
                <li>
                  <VDropdown :title="'Sort by date'" :items="sortTime" @item-clicked="handleDropdownClick" />
                </li>
                <li>
                  <VDropdown :title="'All templates'" :items="sortTime" @item-clicked="handleDropdownClick" />
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="row fill-space mt-3">
      <div class="col-lg-12">
        
        <div class="row">
          <div class="col-md-4 col-lg-4" v-for="template in templates" :key="template.id">
            <FileTemplateCard
              :icon="template.icon"
              :title="template.title"
              :createdDate="template.createdDate"
              :creatorName="template.creatorName"
              @preview="handlePreview(template.id)"
              @create-new-document="handleCreateNewDocument(template.id)"
              @delete-template="handleDelete(template.id)"
              @edit-template="handleEdit(template.id)"
              @duplicate-template="handleDuplicate(template.id)"
            />
          </div>
        </div>

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
import TabsLibrary from '@/modules/TabsLibrary.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import FileTemplateCard from '@/modules/Library/FileTemplateCard/FileTemplateCard.vue';

export default defineComponent({
  components: {
    Search,
    VLink,
    VButton,
    VUser,
    VPaginationList,
    VModalSmall,
    TabsLibrary,
    VDropdown,
    FileTemplateCard,
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
      templates: [
      {
        id: 1,
        icon: 'red',
        title: 'Employment Contract Template',
        createdDate: '2023-04-12',
        creatorName: 'John Doe'
      },
      {
        id: 2,
        icon: 'red',
        title: 'Non-Disclosure Agreement (NDA) Template',
        createdDate: '2023-03-05',
        creatorName: 'Jane Smith'
      },
      {
        id: 3,
        icon: 'blue',
        title: 'Merger Acquisition Checklist',
        createdDate: '2023-02-20',
        creatorName: 'Edward Norman'
      },
      {
        id: 4,
        icon: 'red',
        title: 'Intellectual Property Rights Presentation',
        createdDate: '2023-01-15',
        creatorName: 'Nancy Drew'
      },
      {
        id: 5,
        icon: 'blue',
        title: 'Client Case History Log',
        createdDate: '2023-05-10',
        creatorName: 'Oliver Twist'
      }
      ]
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

      // Handle preview action
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
    handleDropdownClick(item: any) { 
    },
    handlePreview(id: number) {
    },
    handleCreateNewDocument(id: number) {
    },
    handleDelete(id: number) {
    },
    handleEdit(id: number) {
    },
    handleDuplicate(id: number) {
    },
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
