<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading">
          <h1>Client management</h1>
          <p>Manage your team members and their account permissions here.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
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
                <v-button :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="editUserAction(user)" text=""></v-button>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    </div>

    <v-button :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="handleButtonClick()" text="ddddd"></v-button>

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

    <VModal :show="showModal" :title="modalTitle" @update:show="showModal = $event">
      <VEditClient :userId="selectedUserId" :userName="selectedUserFullName" :userEmail="selectedUserEmail" :userPhone="selectedUserPhone" :userAddress="selectedUserAddress" :userNotes="selectedUserNotes" @close-modal="showModal = false" @save-clicked="handleSaveClicked" />
    </VModal>

    <VNotification 
      ref="notificationRef"
      :type="notificationType"
      :header="notificationHeader"
      :message="notificationMessage"
      :duration="7000"
      @closed="handleNotificationClosed"
      @save-clicked="handleSaveClicked"
    />

  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import VButton from '@/components/v-button/VButton.vue';
  import Search from '@/modules/Navigation/Search.vue';
  import VUser from '@/components/v-user/v-user.vue';
  import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
  import VModal from '@/components/v-modal/v-modal.vue';
  import VEditClient from '@/modals/ClientManagement/v-edit-client/v-edit-client.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';

  interface User {
    id: number;
    full_name: string;
    email: string;
    phone_no: string;
    position: number;
    client_type: string;
    address: string;
  }

  interface Position {
    id: number;
    position_name: string;
  }

  interface NotificationRef {
    showNotification: () => void;
  }

  export default defineComponent({
    components: {
      Search,
      VButton,
      VUser,
      VPaginationList,
      VModal,
      VEditClient,
      VNotification,
    },
    data() {
      return {
        notificationType: 'success',
        notificationHeader: 'Header',
        notificationMessage: 'This is a message',
      };
    },
    methods: {
      triggerNotification(type: string, header: string, message: string) {
        this.notificationType = type;
        this.notificationHeader = header;
        this.notificationMessage = message;
        (this.$refs.notificationRef as NotificationRef).showNotification();
      },
      handleNotificationClosed() {
        // Handle the event when the notification is closed
        // For example, reset some properties or log an event
      },
      handleSaveClicked() {
        setTimeout(() => {
          this.triggerNotification('success', 'Changes saved', 'This account has been successfully edited.');
        }, 1000);
      },
      handleButtonClick() {
        this.triggerNotification('error', 'Error!', 'Something went wrong.');
      },
    },
    setup() {
      const users = ref<User[]>([]);
      const currentPage = ref(1);
      const itemsPerPage = ref(10);
      const searchTerm = ref('');
      const positions = ref<Position[]>([]);
      const modalTitle = ref('');
      const showModal = ref(false);
      const notificationComponentRef = ref(null);

      const selectedUserId = ref(null);
      const selectedUserFullName = ref(null);
      const selectedUserEmail = ref(null);
      const selectedUserRole = ref(null);
      const selectedUserPhone = ref(null);
      const selectedUserAddress = ref(null);
      const selectedUserNotes = ref(null);
      const selectedUserOrganisation = ref(null);
      const selectedUserPosition = ref(null);

      const editUserAction = (user) => {
        modalTitle.value = 'Edit user';
        selectedUserId.value = user.id;
        selectedUserFullName.value = user.full_name;
        selectedUserEmail.value = user.email;
        selectedUserPhone.value = user.phone_no;
        selectedUserAddress.value = user.address;
        selectedUserNotes.value = user.notes;
        showModal.value = true;
      };
      
      const getPositionName = () => {
        return Math.random() < 0.5 ? 'Sales' : 'Retainer';
      };

      const paginatedUsers = computed(() => {
        let filteredUsers = users.value;

        if (searchTerm.value && typeof searchTerm.value === 'string') {
          filteredUsers = filteredUsers.filter(user => 
            (user.full_name && typeof user.full_name === 'string' && user.full_name.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
            (user.email && typeof user.email === 'string' && user.email.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
            (user.phone_no && typeof user.phone_no === 'string' && user.phone_no.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
            user.position === Number(searchTerm.value) ||
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
              'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwNDc1MzA2LCJpYXQiOjE3MDA0NzE3MDYsImp0aSI6IjI4MTQ3ZWVmNTM3MjQ1NTg5ZDFjYjMzYjA3YzZjMmJhIiwidXNlcl9pZCI6MjF9.Imzo6TdQH3qXBJzjOH_Eo5IJXDs7bEchOilg3vo7Cw4'
            }
          });
          users.value = response.data;
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      onMounted(() => {
        fetchUsers();
      });
      
      const updateSearchTerm = (value: string) => {
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

      const updatePage = (newPage: number) => {
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
        selectedUserId,
        selectedUserFullName,
        selectedUserEmail,
        selectedUserPhone,
        selectedUserAddress,
        selectedUserNotes,
        modalTitle,
        showModal,
        editUserAction
      };
    },
  });
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
