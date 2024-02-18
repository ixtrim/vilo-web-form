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
            <VDropdown 
              :title="selectedRoleFilter !== null ? getRoleLabel(selectedRoleFilter) : 'All users'" 
              :items="dropdownRoleFilters" 
              @item-clicked="filterUsersByRole" 
            />
          </li>
          <li>
            <VButton :block="true" size="md" icon="left" icon-style="add-white" @click="openAddModal" text="Add user"></VButton>
          </li>
        </ul>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <div class="dashboard__users">

          <div class="dashboard__users__head">
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

            <div :class="{ 'dashboard__users__page__item': true, ['dashboard__users__page__item--' + user.role]: true }" v-for="user in paginatedUsers" :key="user.id">
              <div class="col col--sett-t-user">
                <VUser :userName="user.full_name" :userEmail="user.email" :userAvatar="user.avatar" />
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
        <VButton 
          v-if="currentPage > 1"
          :block="false" 
          size="sm" 
          icon="left" 
          icon-style="arrow-left" 
          styled="outlined" 
          @click="changePage(-1)" 
          text="Previous">
        </VButton>
      </div>
      <div class="col-lg-8 align-center">
        <v-pagination-list
          :total-pages="totalPages"
          :initial-page="currentPage"
          @update:currentPage="updatePage"
        />
      </div>
      <div class="col-lg-2 align-right">
        <VButton 
          v-if="currentPage < totalPages"
          :block="false" 
          size="sm" 
          icon="right" 
          icon-style="arrow-right" 
          styled="outlined" 
          @click="changePage(1)" 
          text="Next">
        </VButton>
      </div>
    </div>

    <VModal :show="showModal || showAddModal" :title="modalTitleEdit || modalTitle" @update:show="handleModalClose">
      <VEditUser
        v-if="showModal"
        :title="modalTitleEdit"
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
        :userAvatar="selectedUserAvatar"
        @close-modal="showModal = false"
        @save-clicked="handleSaveChanges"
      />
      <VAddUser v-if="showAddModal" :title="modalTitle" @close-modal="showAddModal = false" @save-clicked="handleAddUser" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
  import { db } from '@/firebase.js';
  import { getFunctions, httpsCallable } from 'firebase/functions';
  import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
  import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { debounce } from 'lodash';
  import { defineComponent, ref, computed, onMounted, reactive, } from 'vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VBadge from '@/components/v-badge/VBadge.vue';
  import TabsSettings from '@/modules/TabsSettings.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VUser from '@/components/v-user/v-user.vue';
  import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
  import VNotification from '@/components/v-notification/VNotification.vue';
  import VModal from '@/components/v-modal/v-modal.vue';
  import VEditUser from '@/modals/Team/v-edit-user/v-edit-user.vue';
  import VAddUser from '@/modals/Team/v-add-user/v-add-user.vue';

interface DropdownItem {
  label: string;
  value: number | null;
}

interface NotificationRef {
  showNotification: () => void;
}

interface User {
  id: string;
  avatar: string;
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
    userAvatar: string;
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
    VAddUser,
  },
  data() {
    return {
      showModal: false,
      showAddModal: false,
      modalTitle: '',
      modalTitleEdit: '',
      selectedUserId: '',
      selectedUserAvatar: '',
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
        { label: 'Admin' },
        { label: 'General' },
        { label: 'Finance' },
        { label: 'Client (individual)' },
        { label: 'Client (company)' },
      ],
      dropdownRoleFilters: [
        { label: 'All users', value: null },
        { label: 'Admin', value: 0 },
        { label: 'General', value: 1 },
        { label: 'Finance', value: 2 },
        { label: 'Client (individual)', value: 3 },
        { label: 'Client (company)', value: 4 },
      ],
      dropdownStatusItems: [
        { label: 'Draft' },
        { label: 'Pending' },
        { label: 'Activated' }
      ],
      selectedRoleFilter: null as number | null,
    };
  },
  setup() {
    const users = ref<User[]>([]);
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const totalUsers = ref(0);
    const selectedRoleFilter = ref<number | null>(null);

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      let allUsers = querySnapshot.docs.map(doc => ({
        ...doc.data() as User,
        id: doc.id,
      }));

      if (selectedRoleFilter.value !== null) {
        allUsers = allUsers.filter(user => user.role === selectedRoleFilter.value);
      }
      users.value = allUsers;

      totalUsers.value = users.value.length;
    };

    onMounted(fetchUsers);

    const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage));

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return users.value.slice(start, end);
    });

    const updatePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    const changePage = (step: number) => {
      const newPage = currentPage.value + step;
      if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage;
      }
    };

    const filterUsersByRole = (item: DropdownItem) => {
      if (item.value !== null) {
        selectedRoleFilter.value = item.value;
      } else {
        selectedRoleFilter.value = null;
      }
      currentPage.value = 1;
      fetchUsers();
    };

    return {
      users,
      paginatedUsers,
      totalPages,
      currentPage,
      updatePage,
      changePage,
      fetchUsers,
      selectedRoleFilter,
      filterUsersByRole,
    };
  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    async refreshData() {
      await this.fetchUsers();
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
        1: 'General',
        2: 'Finance',
        3: 'Client (individual)',
        4: 'Client (company)',
      };

      return roleMapping[roleCode] || 'Unknown';
    },
    async dropdownRoleChange(userId: string, item: DropdownItem) {
      console.log('Dropdown item clicked:', item.label);

      const roleCodeMapping: { [key: string]: number } = {
        'Admin': 0,
        'General': 1,
        'Finance': 2,
        'Client (individual)': 3,
        'Client (company)': 4,
      };
      const newRoleCode = roleCodeMapping[item.label];

      if (newRoleCode !== undefined) {
        try {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            role: newRoleCode
          });
          
          // Find the user in the local state and update their role
          const userIndex = this.users.findIndex(user => user.id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].role = newRoleCode;
          }
          this.triggerNotification('success', 'Changes saved', 'User role updated successfully.');
        } catch (error) {
          this.triggerNotification('error', 'Error!', 'Error updating role.');
        }
      } else {
        this.triggerNotification('error', 'Error!', 'Invalid role selected.');
      }
    },
    async deleteUser(userId: string) {
      try {
        await deleteDoc(doc(db, "users", userId));

        // Remove the user from the local state
        this.users = this.users.filter(user => user.id !== userId);
        this.triggerNotification('success', 'Changes saved', 'User deleted successfully.');

        setTimeout(() => {
          this.refreshData();
        }, 1000);
      } catch (error) {
        this.triggerNotification('error', 'Error!', 'Couldnt delete user.');
      }
    },
    async handleSaveChanges(updatedUserData: UpdatedUserData) {
      try {
        const userRef = doc(db, "users", updatedUserData.userId);
        await updateDoc(userRef, {
          avatar: updatedUserData.userAvatar,
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

        // Update the user in the local state
        const userIndex = this.users.findIndex(user => user.id === updatedUserData.userId);
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], ...updatedUserData };
        }
        this.triggerNotification('success', 'Changes saved', 'User updated successfully.');

        setTimeout(() => {
          this.refreshData();
        }, 1000);
      } catch (error) {
        this.triggerNotification('error', 'Error!', 'Could not update user.');
      }
    },
    openEditModal(user: User) {
      this.modalTitleEdit = 'Edit user data';
      this.selectedUserId = user.id.toString();
      this.selectedUserAvatar = user.avatar;
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
    openAddModal() {
      this.modalTitle = 'Add New User';
      this.showAddModal = true;
    },
    async handleAddUser(newUserDetails: any) {
      const functions = getFunctions();
      const addNewUser = httpsCallable(functions, 'addNewUser');
      const storage = getStorage();

      try {
        // Handle avatar upload if present
        if (newUserDetails.avatarBlob) {
          const avatarFileName = `${newUserDetails.email.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
          const avatarRef = storageRef(storage, `avatars/${avatarFileName}`);
          const avatarUploadResult = await uploadBytes(avatarRef, newUserDetails.avatarBlob);
          const avatarUrl = await getDownloadURL(avatarUploadResult.ref);
          newUserDetails.avatar = avatarUrl; // Set the avatar URL in newUserDetails
        }

        // Remove the avatarBlob from newUserDetails as it's not JSON serializable
        delete newUserDetails.avatarBlob;

        const result = await addNewUser(newUserDetails);
        console.log(result);

        this.triggerNotification('success', 'User added', 'The new user has been successfully added.');
        this.showAddModal = false;
        setTimeout(() => {
          this.refreshData();
        }, 300);
      } catch (error) {
        console.error(error);
        const message = (error as Error).message;
        this.triggerNotification('error', 'Error adding user', message);
      }
    },
    handleModalClose(value: boolean) {
      this.showModal = false;
      this.showAddModal = false;
    },
  },
});
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
