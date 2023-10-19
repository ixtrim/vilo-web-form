<template>
  <div class="container-fluid">
    
    <div class="row">
      <div class="col-lg-12">
        <TabsSettings />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-9">
        <div class="dashboard__heading">
          <h1>Team management</h1>
          <p>Manage your team members and their account permissions here.</p>
        </div>
      </div>
      <div class="col-lg-2">
        <ul class="settings__team-actions">
          <li>
            
          </li>
          <li>
            <v-button :block="true" size="md" icon="left" icon-style="add-white" @click="handleButtonClick" text="Add user"></v-button>
          </li>
        </ul>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__users">

          <div class="dashboard__users__head">
            
            <div class="col col--checkbox">
              <input type="checkbox" id="remember" class="mr-8p">
            </div>
            <div class="col col--sett-t-user">
              <h5>Name</h5>
            </div>
            <div class="col col--sett-t-status">
              <h5>Status</h5>
            </div>
            <div class="col col--sett-t-position">
              <h5>Position</h5>
            </div>
            <div class="col col--sett-t-role">
              <h5>Role</h5>
            </div>
            <div class="col col--cm-action">
              &nbsp;
            </div>
            <div class="col col--cm-action">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__users__page">

            <div class="dashboard__users__page__item">

              <div class="col col--checkbox">
                <input type="checkbox" id="remember" class="mr-8p">
              </div>
              <div class="col col--sett-t-user">
                <VUser :userName="userName" :userEmail="userEmail" />
              </div>
              <div class="col col--sett-t-status">
                <p>+1 6754 6678 66</p>
              </div>
              <div class="col col--sett-t-position">
                <p>Sales</p>
              </div>
              <div class="col col--sett-t-role">
                <p>Individual</p>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>

            </div>

            <div class="dashboard__users__page__item">

              <div class="col col--checkbox">
                <input type="checkbox" id="remember" class="mr-8p">
              </div>
              <div class="col col--sett-t-user">
                <VUser :userName="userName" :userEmail="userEmail" />
              </div>
              <div class="col col--sett-t-status">
                <p>+1 6754 6678 66</p>
              </div>
              <div class="col col--sett-t-position">
                <p>Sales</p>
              </div>
              <div class="col col--sett-t-role">
                <p>Individual</p>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>
              
            </div>

            <div class="dashboard__users__page__item">

              <div class="col col--checkbox">
                <input type="checkbox" id="remember" class="mr-8p">
              </div>
              <div class="col col--sett-t-user">
                <VUser :userName="userName" :userEmail="userEmail" />
              </div>
              <div class="col col--sett-t-status">
                <p>+1 6754 6678 66</p>
              </div>
              <div class="col col--sett-t-position">
                <p>Sales</p>
              </div>
              <div class="col col--sett-t-role">
                <p>Individual</p>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>

            </div>

            <div class="dashboard__users__page__item">

              <div class="col col--checkbox">
                <input type="checkbox" id="remember" class="mr-8p">
              </div>
              <div class="col col--sett-t-user">
                <VUser :userName="userName" :userEmail="userEmail" />
              </div>
              <div class="col col--sett-t-status">
                <p>+1 6754 6678 66</p>
              </div>
              <div class="col col--sett-t-position">
                <p>Sales</p>
              </div>
              <div class="col col--sett-t-role">
                <p>Individual</p>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>

            </div>

          </div>
          

        </div>
      </div>
    </div>

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
import TabsSettings from '@/modules/TabsSettings.vue';
import VButton from '@/components/v-button/VButton.vue';
import VUser from '@/components/v-user/v-user.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';

export default defineComponent({
  components: {
    VButton,
    VUser,
    VPaginationList,
  },
  data() {
    return {
      userName: 'Olivia Rhye',
      userEmail: 'olivia@untitledui.com',
      selectedItem: null,
      showModal: false
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
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
