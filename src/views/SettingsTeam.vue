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
      <div class="col-lg-3">
        <ul class="settings__team-actions">
          <li>
            <VDropdown :title="'All users'" :items="dropdownRoleItems" @item-clicked="dropdownRoleChange" />
          </li>
          <li>
            <VButton :block="true" size="md" icon="left" icon-style="add-white" @click="handleButtonClick" text="Add user"></VButton>
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

            <div class="dashboard__users__page__item" v-for="user in users" :key="user.id">

              <div class="col col--checkbox">
                <input type="checkbox" id="remember" class="mr-8p">
              </div>
              <div class="col col--sett-t-user">
                <VUser :userName="user.full_name" :userEmail="user.email" />
              </div>
              <div class="col col--sett-t-status">
                <VBadge :variant="getStatusLabelAndVariant(user.status).variant">
                  {{ getStatusLabelAndVariant(user.status).label }}
                </VBadge>
              </div>
              <div class="col col--sett-t-position">
                <p>{{ user.position }}</p>
              </div>
              <div class="col col--sett-t-role">
                <VDropdown :title="getRoleLabel(user.role)" :items="dropdownRoleItems" @item-clicked="item => dropdownRoleChange(user.id, item)" />
              </div>
              <div class="col col--cm-action">
                <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="() => deleteUser(user.id)" text=""></VButton>
              </div>
              <div class="col col--cm-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditModal(user)" text=""></VButton>
              </div>

            </div>

          </div>
          
        </div>
      </div>
    </div>

    <div class="row bottom-pagination">
      <div class="col-lg-2 align-left">
        <VButton :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="handleButtonClick" text="Previous"></VButton>
      </div>
      <div class="col-lg-8 align-center">
        <v-pagination-list :total-pages="6" @update:currentPage="updatePage" />
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="handleButtonClick" text="Next"></VButton>
      </div>
    </div>

    <VModal :show="showModal" :title="modalTitle" @update:show="(value: boolean) => showModal = value">
      <VEditUser
        :title="modalTitle"
        :userId="selectedUserId"
        :userName="selectedUserFullName"
        :userEmail="selectedUserEmail"
        :userPhone="selectedUserPhone"
        :userAddress="selectedUserAddress"
        :userPosition="selectedUserPosition"
        :userCompany="selectedUserCompany"
        :dropdownRoleItems="dropdownRoleItems"
        :userRole="Number(selectedUserRole)"
        :dropdownStatusItems="dropdownStatusItems"
        :userStatus="Number(selectedUserStatus)"
        :userNotes="selectedUserNotes"
        @close-modal="showModal = false"
        @save-clicked="handleSaveClicked"
      />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
  import { db } from '@/firebase.js';
  import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
  import { debounce } from 'lodash';
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VBadge from '@/components/v-badge/VBadge.vue';
  import TabsSettings from '@/modules/TabsSettings.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VUser from '@/components/v-user/v-user.vue';
  import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';
  import VModal from '@/components/v-modal/v-modal.vue';
  import VEditUser from '@/modals/Team/v-edit-user/v-edit-user.vue';

interface DropdownItem {
  label: string;
}

interface NotificationRef {
  showNotification: () => void;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  company: string;
  role: number;
  status: number;
  notes: string;
}

interface UpdatedUserData {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userAddress: string;
    userPosition: string;
    userCompany: string;
    userRole: number;
    userStatus: number;
    userNotes: string;
  }

export default defineComponent({
  components: {
    TabsSettings,
    VButton,
    VUser,
    VPaginationList,
    VBadge,
    VDropdown,
    VNotification,
    VModal,
    VEditUser,
  },
  data() {
    return {
      showModal: false,
      modalTitle: '',
      selectedUserId: '',
      selectedUserFullName: '',
      selectedUserEmail: '',
      selectedUserPhone: '',
      selectedUserAddress: '',
      selectedUserCompany: '',
      selectedUserPosition: '',
      selectedUserRole: '',
      selectedUserStatus: '',
      selectedUserNotes: '',
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      dropdownRoleItems: [
        { label: 'Internal user' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
        { label: 'Admin' },
      ],
      dropdownStatusItems: [
        { label: 'Draft' },
        { label: 'Pending' },
        { label: 'Activated' }
      ],
    };
  },
  setup() {
    const users = ref<User[]>([]);
    const itemsPerPage = 10;
    const allItems = ref([
      { id: 1, name: 'Page 1' },
    ]);
    const currentPage = ref(1);

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      users.value = querySnapshot.docs.map(doc => ({
        ...doc.data() as User,
        id: doc.id,
      }));
    };

    onMounted(fetchUsers);

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
      users,
      paginatedItems,
      totalPages,
      currentPage,
      updatePage
    };
  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    getStatusLabelAndVariant(statusCode: number) {
      const statusMapping: { [key: number]: { label: string; variant: string } } = {
        0: { label: 'Draft', variant: 'light' },
        1: { label: 'Pending', variant: 'warning' },
        2: { label: 'Activated', variant: 'success' },
      };

      return statusMapping[statusCode] || { label: 'Unknown', variant: 'error' };
    },
    getRoleLabel(roleCode: number) {
      const roleMapping: { [key: number]: string } = {
        0: 'Admin',
        1: 'Internal user',
        2: 'Client (individual)',
        3: 'Client (company)',
      };

      return roleMapping[roleCode] || 'Unknown';
    },
    async dropdownRoleChange(userId: string, item: DropdownItem) {
      console.log('Dropdown item clicked:', item.label);

      const roleCodeMapping: { [key: string]: number } = {
        'Admin': 0,
        'Internal user': 1,
        'Client (individual)': 2,
        'Client (company)': 3,
      };
      const newRoleCode = roleCodeMapping[item.label];

      if (newRoleCode !== undefined) {
        try {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            role: newRoleCode
          });
          console.log('Role updated successfully');

          // Find the user in the local state and update their role
          const userIndex = this.users.findIndex(user => user.id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].role = newRoleCode;
          }
        } catch (error) {
          console.error('Error updating role:', error);
        }
      } else {
        console.error('Invalid role selected');
      }
    },
    async deleteUser(userId: string) {
      try {
        await deleteDoc(doc(db, "users", userId));
        console.log('User deleted successfully');

        // Remove the user from the local state
        this.users = this.users.filter(user => user.id !== userId);
        this.triggerNotification('success', 'Changes saved', 'User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        this.triggerNotification('error', 'Error!', 'Couldnt delete user.');
      }
    },
    async handleSaveClicked(updatedUserData: UpdatedUserData) {
      alert(updatedUserData.userId);
      alert(updatedUserData.userAddress);
      try {
        const userRef = doc(db, "users", updatedUserData.userId);
        await updateDoc(userRef, {
          full_name: updatedUserData.userName,
          email: updatedUserData.userEmail,
          phone: updatedUserData.userPhone,
          address: updatedUserData.userAddress,
          position: updatedUserData.userPosition,
          company: updatedUserData.userCompany,
          role: updatedUserData.userRole,
          status: updatedUserData.userStatus,
          notes: updatedUserData.userNotes,
        });
        console.log('User updated successfully');

        // Update the user in the local state
        const userIndex = this.users.findIndex(user => user.id === updatedUserData.userId);
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], ...updatedUserData };
        }
        this.triggerNotification('success', 'Changes saved', 'User updated successfully.');
      } catch (error) {
        console.error('Error updating user:', error);
        this.triggerNotification('error', 'Error!', 'Could not update user.');
      }
    },
    openEditModal(user: User) {
      this.selectedUserId = user.id.toString();
      this.selectedUserFullName = user.full_name;
      this.selectedUserEmail = user.email;
      this.selectedUserPhone = user.phone;
      this.selectedUserAddress = user.address;
      this.selectedUserPosition = user.position;
      this.selectedUserCompany = user.company;
      this.selectedUserRole = user.role.toString();
      this.selectedUserStatus = user.status.toString();
      this.selectedUserNotes = user.notes;
      this.showModal = true;
    },
    handleButtonClick() {
     console.log('Button clicked');
    }
  },
});
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
