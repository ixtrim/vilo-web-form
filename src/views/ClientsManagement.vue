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
                <VUser :userName="user.full_name" :userEmail="user.email" :userAvatar="user.avatar" />
              </div>
              <div class="col col--cm-phone">
                <p>{{ user.phone }}</p>
              </div>
              <div class="col col--cm-position">
                <p>{{ user.position }}</p>
              </div>
              <div class="col col--cm-company">
                <p>{{ user.company || 'Individual Client' }}</p>
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
      <VEditClient :title="modalTitle" :userId="selectedUserId" :userName="selectedUserFullName" :userEmail="selectedUserEmail" :userPhone="selectedUserPhone" :userPosition="selectedUserPosition" :userCompany="selectedUserCompany" :userAddress="selectedUserAddress" :userNotes="selectedUserNotes" @close-modal="showModal = false" @save-clicked="handleSaveClicked" />
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
  import { db } from '@/firebase.js';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import VButton from '@/components/v-button/VButton.vue';
  import Search from '@/modules/Navigation/Search.vue';
  import VUser from '@/components/v-user/v-user.vue';
  import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
  import VModal from '@/components/v-modal/v-modal.vue';
  import VEditClient from '@/modals/ClientManagement/v-edit-client/v-edit-client.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';

  interface User {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company: string;
    position: string;
    client_type: string;
    address: string;
    notes: string;
    avatar: string;
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
        notificationHeader: 'Changes saved',
        notificationMessage: 'This account has been successfully edited.',
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
        // Handle the event when the notification is closed TO DO
      },
      async handleSaveClicked() {
        await this.fetchUsers();
        this.triggerNotification('success', 'Changes saved', 'Client updated successfully.');
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
      const modalTitle = ref('');
      const showModal = ref(false);

      const selectedUserId = ref<string>('');
      const selectedUserFullName = ref<string>('');
      const selectedUserEmail = ref<string>('');
      const selectedUserPhone = ref<string>('');
      const selectedUserPosition = ref<string>('');
      const selectedUserCompany = ref<string>('');
      const selectedUserAddress = ref<string>('');
      const selectedUserNotes = ref<string>('');

      const editUserAction = (user: User) => {
        modalTitle.value = 'Edit user';
        selectedUserId.value = user.id; 
        selectedUserFullName.value = user.full_name;
        selectedUserEmail.value = user.email;
        selectedUserPhone.value = user.phone;
        selectedUserPosition.value = user.position;
        selectedUserCompany.value = user.company;
        selectedUserAddress.value = user.address;
        selectedUserNotes.value = user.notes;
        showModal.value = true;
      };
      
      const paginatedUsers = computed(() => {
        let filteredUsers = users.value;

        if (searchTerm.value && typeof searchTerm.value === 'string') {
          filteredUsers = filteredUsers.filter(user => 
            (user.full_name && typeof user.full_name === 'string' && user.full_name.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
            (user.email && typeof user.email === 'string' && user.email.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
            (user.phone && typeof user.phone === 'string' && user.phone.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
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
          const usersCol = collection(db, "users");
          const q = query(usersCol, 
            where("status", "==", 2),
            where("role", "in", [3, 4])
          );
          const querySnapshot = await getDocs(q);
          users.value = querySnapshot.docs.map(doc => ({
            ...doc.data() as User,
            id: doc.id
          }));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      onMounted(fetchUsers);
      
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
        selectedUserId,
        selectedUserFullName,
        selectedUserEmail,
        selectedUserPhone,
        selectedUserPosition,
        selectedUserCompany,
        selectedUserAddress,
        selectedUserNotes,
        modalTitle,
        showModal,
        editUserAction,
        fetchUsers,
      };
    },
  });
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
