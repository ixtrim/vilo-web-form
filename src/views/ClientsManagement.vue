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
        <Search :value="searchTerm" @input="updateSearchTerm" />
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__users">

          <div class="dashboard__users__head">
            
            <div class="col col--cm-user">
              <h5>Name</h5>
            </div>
            <div class="col col--cm-phone">
              <h5>Phone</h5>
            </div>
            <div class="col col--cm-position">
              <h5>Position</h5>
            </div>
            <div class="col col--cm-company">
              <h5>Company</h5>
            </div>
            <div class="col col--cm-address">
              <h5>Address</h5>
            </div>
            <div class="col col--cm-action">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__users__page">

            <div class="dashboard__users__page__item" v-for="user in paginatedUsers" :key="user.id">

              <div class="col col--cm-user">
                <VUser :userName="user.full_name" :userEmail="user.email" />
              </div>
              <div class="col col--cm-phone">
                <p>{{ user.phone_no }}</p>
              </div>
              <div class="col col--cm-position">
                <p>{{ getPositionName(user.position) }}</p>
              </div>
              <div class="col col--cm-company">
                <p>{{ user.client_type }}</p>
              </div>
              <div class="col col--cm-address">
                <p>{{ user.address }}</p>
              </div>
              <div class="col col--cm-action">
                <v-button :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="handleButtonClick(user)" text=""></v-button>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    </div>

    <VModalSmall :title="'My Modal Title'" v-if="showModal">
      <p>Name:</p>
      <p>Email:</p>
    </VModalSmall>

    <div class="row bottom-pagination">
      <div class="col-lg-2 align-left">
        <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="prevPage" text="Previous"></v-button>
      </div>
      <div class="col-lg-8 align-center">
        <v-pagination-list :total-pages="totalPages" @update:currentPage="updatePage" />
      </div>
      <div class="col-lg-2 align-right">
        <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="nextPage" text="Next"></v-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
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
      userEmail: 'olivia@untitledui.com',
      selectedItem: null,
      showModal: false
    };
  },
  setup() {
    const users = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const searchTerm = ref('');
    const positions = ref([]);

    const fetchPositions = async () => {
      try {
        const response = await axios.get('https://api-vilo.nestvested.co/settings/positions/', {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk4MTU4MTY0LCJpYXQiOjE2OTgxNTQ1NjQsImp0aSI6IjBkZTg1ZTg0OTJjZDQ0MGE4N2JkNmU2NzRiMjlmNTZiIiwidXNlcl9pZCI6Mjd9.DQFDSgAoa1n0IzJBHdk8BMBSmxDC5qVyL_6NGlzFXeg'
          }
        });
        positions.value = response.data;
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    const paginatedUsers = computed(() => {
      let filteredUsers = users.value;

      if (searchTerm.value && typeof searchTerm.value === 'string') {
        filteredUsers = filteredUsers.filter(user => 
          (user.full_name && typeof user.full_name === 'string' && user.full_name.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
          (user.email && typeof user.email === 'string' && user.email.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
          (user.phone_no && typeof user.phone_no === 'string' && user.phone_no.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
          (user.position && typeof user.position === 'string' && user.position.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
          (user.client_type && typeof user.client_type === 'string' && user.client_type.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
          (user.address && typeof user.address === 'string' && user.address.toLowerCase().includes(searchTerm.value.toLowerCase()))
        );
      }

      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredUsers.slice(start, end);
    });

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api-vilo.nestvested.co/auth/clients/', {
          headers: {
            'accept': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk4MTU4MTY0LCJpYXQiOjE2OTgxNTQ1NjQsImp0aSI6IjBkZTg1ZTg0OTJjZDQ0MGE4N2JkNmU2NzRiMjlmNTZiIiwidXNlcl9pZCI6Mjd9.DQFDSgAoa1n0IzJBHdk8BMBSmxDC5qVyL_6NGlzFXeg'
          }
        });
        users.value = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    onMounted(() => {
      fetchUsers();
      fetchPositions();
    });

    const getPositionName = (positionId) => {
      const position = positions.value.find(pos => pos.id === positionId);
      return position ? position.position_name : 'Unknown';
    };

    const updateSearchTerm = (value: string) => {
      console.log("updateSearchTerm", value);
      searchTerm.value = value;
    };

    const nextPage = () => {
      if (currentPage.value * itemsPerPage.value < users.value.length) {
        currentPage.value++;
      }
    };

    const totalPages = computed(() => {
      return Math.ceil(users.value.length / itemsPerPage.value);
    });

    const updatePage = (newPage) => {
      currentPage.value = newPage;
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    return {
      paginatedUsers,
      nextPage,
      updatePage,
      prevPage,
      currentPage,
      totalPages,
      searchTerm,
      updateSearchTerm,
      getPositionName,
    };
  },
  methods: {
    handleButtonClick(item: any) {
      //this.selectedItem = item;
     // this.showModal = true;
    },
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
