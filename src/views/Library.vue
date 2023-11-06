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
        <VButton :block="true" size="md" icon="left" icon-style="add-white" styled="primary" @click="handleButtonClick" text="Add new document"></VButton>
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

        <div class="dashboard__table">

          <div class="dashboard__table__head">
            <div class="col col--checkbox">
              <input type="checkbox" />
            </div>
            <div class="col col--l-document">
              <h4>Document name</h4>
            </div>
            <div class="col col--l-status">
              <h4>Status</h4>
            </div>
            <div class="col col--l-uploaded">
              <h4>Date uploaded</h4>
            </div>
            <div class="col col--l-updated">
              <h4>Last updated</h4>
            </div>
            <div class="col col--l-created">
              <h4>Created by</h4>
            </div>
            <div class="col col--l-delete">
              &nbsp;
            </div>
            <div class="col col--l-edit">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__table__page">

            <div class="dashboard__table__page">
              <div class="dashboard__table__page__item" v-for="document in documents" :key="document.id">
                <div class="col col--checkbox">
                  <input type="checkbox" :id="'checkbox-' + document.id" />
                  <label :for="'checkbox-' + document.id"></label>
                </div>
                <div class="col col--l-document">
                  <VFile :file-extension="document.fileExtension" :file-name="document.fileName" :file-size="document.fileSize" />
                </div>
                <div class="col col--l-status">
                  <VBadge :variant="document.badgeVariant">{{ document.status }}</VBadge>
                </div>
                <div class="col col--l-uploaded">
                  <p>{{ document.uploadedDate }}</p>
                </div>
                <div class="col col--l-updated">
                  <p>{{ document.updatedDate }}</p>
                </div>
                <div class="col col--l-created">
                  <VUser :userName="document.userName" :userEmail="document.userEmail" />
                </div>
                <div class="col col--l-delete">
                  <VLink to="#" styled="secondary">Delete</VLink>
                </div>
                <div class="col col--l-edit">
                  <VLink to="#" styled="primary">Edit</VLink>
                </div>
              </div>
            </div>

          </div>

          <div class="dashboard__table__pagination">
            <div class="dashboard__table__pagination__prev">
              <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="prevPage" text="Previous"></v-button>
            </div>
            <div class="dashboard__table__pagination__pages">
              <v-pagination-list :total-pages="totalPages" @update:currentPage="updatePage" />
            </div>
            <div class="dashboard__table__pagination__next">
              <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="nextPage" text="Next"></v-button>
            </div>
          </div>

        </div>

      </div>
    </div>

    <VModalSmall :title="'My Modal Title'">
      <p>Content for the modal goes here...</p>
    </VModalSmall>

    

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
import VFile from '@/components/v-file/VFile.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import TabsLibrary from '@/modules/TabsLibrary.vue';

export default defineComponent({
  components: {
    Search,
    VLink,
    VButton,
    VUser,
    VPaginationList,
    VModalSmall,
    VDropdown,
    VFile,
    VBadge,
    TabsLibrary,
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
      documents: [
        {
          id: 1,
          fileExtension: 'pdf',
          fileName: 'Mergers_Acquisitions_Report_2022.pdf',
          fileSize: '5 MB',
          badgeVariant: 'warning',
          status: 'Review',
          uploadedDate: 'Feb 12, 2023',
          updatedDate: 'Mar 5, 2023',
          userName: 'Adrian Stone',
          userEmail: 'adrian@lawfirm.com',
        },
        {
          id: 2,
          fileExtension: 'docx',
          fileName: 'Client_Contract_John_Doe.docx',
          fileSize: '2 MB',
          badgeVariant: 'success',
          status: 'Signed',
          uploadedDate: 'Jan 20, 2023',
          updatedDate: 'Jan 22, 2023',
          userName: 'Brenda Walsh',
          userEmail: 'brenda@lawfirm.com',
        },
        {
          id: 3,
          fileExtension: 'docx',
          fileName: 'Case_Expenses_2023.docx',
          fileSize: '1 MB',
          badgeVariant: 'primary',
          status: 'Updated',
          uploadedDate: 'Mar 1, 2023',
          updatedDate: 'Mar 1, 2023',
          userName: 'Carlos Diaz',
          userEmail: 'carlos@lawfirm.com',
        },
        {
          id: 4,
          fileExtension: 'doc',
          fileName: 'Litigation_Strategies_2023.doc',
          fileSize: '6 MB', 
          badgeVariant: 'light',
          status: 'Draft',
          uploadedDate: 'Apr 10, 2023',
          updatedDate: 'Apr 15, 2023',
          userName: 'Diana Reed',
          userEmail: 'diana@lawfirm.com',
        },
        {
          id: 5,
          fileExtension: 'pdf',
          fileName: 'Non_Disclosure_Agreement_Globex.pdf',
          fileSize: '2.5 MB', 
          badgeVariant: 'danger',
          status: 'Urgent',
          uploadedDate: 'Feb 28, 2023',
          updatedDate: 'Mar 2, 2023',
          userName: 'Evan Wright',
          userEmail: 'evan@lawfirm.com',
        },
        {
          id: 6,
          fileExtension: 'docx',
          fileName: 'Settlement_Agreement_Case_4321.docx',
          fileSize: '3 MB', 
          badgeVariant: 'success',
          status: 'Final',
          uploadedDate: 'Jan 5, 2023',
          updatedDate: 'Jan 6, 2023',
          userName: 'Fiona Grant',
          userEmail: 'fiona@lawfirm.com',
        },
        {
          id: 7,
          fileExtension: 'pdf',
          fileName: 'Meeting_Minutes_030323.pdf',
          fileSize: '512 KB', 
          badgeVariant: 'success',
          status: 'Completed',
          uploadedDate: 'Mar 3, 2023',
          updatedDate: 'Mar 4, 2023',
          userName: 'George Hanson',
          userEmail: 'george@lawfirm.com',
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
