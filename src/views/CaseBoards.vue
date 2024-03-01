<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading mb-0">
          <h1>Cases</h1>
          <p>Manage your cases boards and tasks.</p>
        </div>
      </div>
      <div class="col-lg-2 align-right">
        <VButton :block="true" size="md" icon="left" icon-style="add" styled="outlined" @click="openAddModal"
          text="Add new case"></VButton>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12 dashboard__line">
        <hr />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__filters">

          <div class="row">
            <div class="col-lg-3">
              <div class="dashboard__filters">
                <Search :value="searchTerm" @update-search="updateSearchTerm" />
              </div>
            </div>
            <div class="col-lg-6"></div>
            <div class="col-lg-3">
              <ul class="dashboard__actions">
                <li>
                  <VDropdown :title="'Filter by date'" :items="filterTime" @item-clicked="handleFilterTime" />
                </li>
                <li>
                  <VDropdown :title="currentDropdownTitle" :items="sortCases" @item-clicked="handleFilterStatus" />
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
            <div class="col col--cb-case">
              <h4>Case</h4>
            </div>
            <div class="col col--cb-client">
              <h4>Client</h4>
            </div>
            <div class="col col--cb-about">
              <h4>About</h4>
            </div>
            <div class="col col--cb-users">
              <h4>Users</h4>
            </div>
            <div class="col col--cb-action">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__table__page">

            <div class="dashboard__table__page__item" v-for="caseItem in processedCases" :key="caseItem.id">
              <div class="col col--cb-case">
                <ul>
                  <li>
                    <img :src="caseItem.icon" :alt="caseItem.title" />
                  </li>
                  <li>
                    <h4 class="active" @click="navigateToCaseBoard(caseItem.id)">{{ caseItem.title }}</h4>
                  </li>
                </ul>
              </div>
              <div class="col col--cb-client">
                <template v-if="caseItem.client_id && usersMap[caseItem.client_id]">
                  <VUser :userName="usersMap[caseItem.client_id].full_name" :userAvatar="usersMap[caseItem.client_id].avatar" />
                </template>
                <span v-else class="col--cb-client__general">General</span>
              </div>
              <div class="col col--cb-about">
                <span class="col--cb-about__description">{{ caseItem.description }}</span>
              </div>
              <div class="col col--cb-users">
                <ul>
                  <li v-for="memberId in caseItem.displayedMembers" :key="memberId">
                    <template v-if="usersMap[memberId]">
                      <VUser :userAvatar="usersMap[memberId].avatar" />
                    </template>
                  </li>
                  <li class="users-rest" v-if="caseItem.extraMembersCount > 0">
                    <span>+{{ caseItem.extraMembersCount }}</span>
                  </li>
                </ul>
              </div>
              <div class="col col--cb-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditModal(caseItem)" text=""></VButton>
              </div>
            </div>

          </div>

          <div class="dashboard__table__pagination">
            <div class="dashboard__table__pagination__prev">
              <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="changePage(-1, $event)" text="Previous" v-if="currentPage > 1"></v-button>
            </div>
            <div class="dashboard__table__pagination__pages">
              <v-pagination-list :total-pages="totalPages" :initial-page="currentPage" @update:currentPage="updatePage" />
            </div>
            <div class="dashboard__table__pagination__next">
              <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="changePage(1, $event)" text="Next" v-if="currentPage < totalPages"></v-button>
            </div>
          </div>

        </div>

      </div>
    </div>

    <VModal :show="showEditModal || showAddModal" :title="modalEditTitle || modalAddTitle" @update:show="handleModalClose">
      <VEditCaseBoard v-if="showEditModal" :title="modalEditTitle" :caseData="selectedCase" @close-modal="showEditModal = false" @save-clicked="handleEditCase" />
      <VAddCaseBoard v-if="showAddModal" :title="modalAddTitle" @close-modal="showAddModal = false" @save-clicked="handleAddCase" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs, doc, getDoc, Timestamp, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebase.js';
import VButton from '@/components/v-button/VButton.vue';
import Search from '@/modules/Cases/Search.vue';
import VUser from '@/components/v-user/v-user.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VDropdown from '@/components/v-dropdown/VDropdown.vue';
import VNotification from '@/components/v-notification/VNotification.vue';
import VModal from '@/components/v-modal/v-modal.vue';
import VEditCaseBoard from '@/modals/CaseBoards/v-edit-case-board/v-edit-case-board.vue';
import VAddCaseBoard from '@/modals/CaseBoards/v-add-case-board/v-add-case-board.vue';

interface Case {
  id: string;
  title: string;
  description: string;
  client_id: string;
  icon: string;
  owner: string;
  team_members: string[];
  time_added: Timestamp;
  status: number; 
}

interface User {
  full_name: string;
  avatar: string;
}

interface ProcessedCase extends Case {
  displayedMembers: string[];
  extraMembersCount: number;
}

interface DropdownItem {
  label: string;
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
    VDropdown,
    VNotification,
    VModal,
    VEditCaseBoard,
    VAddCaseBoard,
  },
  data() {
    return {
      showEditModal: false,
      showAddModal: false,
      modalEditTitle: '',
      modalAddTitle: '',
      notificationType: 'success',
      notificationHeader: 'Changes saved',
      notificationMessage: 'This account has been successfully edited.',
      sortCases: [
        { label: 'All cases' },
        { label: 'Active cases' },
        { label: 'Drafts cases' },
        { label: 'Archived cases' },
        { label: 'Hidden cases' },
      ],
      selectedStatus: null,
      currentDropdownTitle: 'All cases',
      searchTerm: '',
      selectedCase: undefined,
    };
  },
  setup() {
    const originalCases = ref<Case[]>([]);
    const cases = ref<Case[]>([]);
    const usersMap = ref<{ [key: string]: User }>({});
    const searchTerm = ref<string>('');

    const filterTime = ref([
      { label: 'All' },
      { label: 'Last year' },
      { label: 'Last three months' },
      { label: 'Last two months' },
      { label: 'Last month' },
      { label: 'This week' },
    ]);

    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const selectedStatus = ref<number | null>(null);
    const currentDropdownTitle = ref('All cases');

    const fetchCases = async () => {
      // Check if there's a logged-in user
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Create a query that filters cases where the team_members array contains the current user's ID
        const casesQuery = query(collection(db, "cases"), where("team_members", "array-contains", currentUser.uid));
        const querySnapshot = await getDocs(casesQuery);
        originalCases.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Case);
        cases.value = [...originalCases.value];
        cases.value.forEach(caseItem => {
          if (caseItem.client_id) {
            fetchUser(caseItem.client_id);
          }
          caseItem.team_members.forEach(memberId => {
            fetchUser(memberId);
          });
        });
      } else {
        // Handle the case where there is no logged-in user
        console.log("No user logged in");
        // Optionally clear or set cases to a default state
        cases.value = [];
      }
    };

    const sortCasesByTimeAdded = (days: number) => {
      const currentTime = new Date().getTime();
      const cutoffTime = currentTime - days * 24 * 60 * 60 * 1000;

      cases.value.sort((a, b) => {
        const aTime = a.time_added.toMillis();
        const bTime = b.time_added.toMillis();

        if (aTime > cutoffTime && bTime > cutoffTime) {
          // Both cases are within the specified time range, use the original order
          return aTime - bTime;
        } else if (aTime > cutoffTime) {
          // Only case a is within the time range
          return -1;
        } else if (bTime > cutoffTime) {
          // Only case b is within the time range
          return 1;
        } else {
          // Both cases are outside the time range, use the original order
          return aTime - bTime;
        }
      });
    };

    const handleFilterTime = (item: any) => {
      const currentTime = new Date().getTime();

      switch (item.label) {
        case 'All':
          cases.value = [...originalCases.value]; // Restore original unfiltered data
          break;
        case 'Last year':
          cases.value = originalCases.value.filter(caseItem => caseItem.time_added.toMillis() > currentTime - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'Last three months':
          cases.value = originalCases.value.filter(caseItem => caseItem.time_added.toMillis() > currentTime - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'Last two months':
          cases.value = originalCases.value.filter(caseItem => caseItem.time_added.toMillis() > currentTime - 60 * 24 * 60 * 60 * 1000);
          break;
        case 'Last month':
          cases.value = originalCases.value.filter(caseItem => caseItem.time_added.toMillis() > currentTime - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'This week':
          cases.value = originalCases.value.filter(caseItem => caseItem.time_added.toMillis() > currentTime - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          break;
      }

      // Other logic you may need to perform when the dropdown is clicked
      console.log('Dropdown item clicked', item.label);
    };

    const handleFilterStatus = (item: DropdownItem) => {
      switch (item.label) {
        case 'All cases':
          selectedStatus.value = null;
          break;
        case 'Drafts cases':
          selectedStatus.value = 0;
          break;
        case 'Active cases':
          selectedStatus.value = 1;
          break;
        case 'Hidden cases':
          selectedStatus.value = 2;
          break;
        case 'Archived cases':
          selectedStatus.value = 3;
          break;
        default:
          selectedStatus.value = null;
      }
      currentDropdownTitle.value = item.label;
    };

    const updateSearchTerm = (value: string) => {
      searchTerm.value = value;
    };

    const handleFilterSearch = () => {
      cases.value = originalCases.value.filter(caseItem => {
        const caseTitle = caseItem.title.toLowerCase();
        const caseDescription = caseItem.description.toLowerCase();
        const searchTermValue = searchTerm.value.toLowerCase();

        return caseTitle.includes(searchTermValue) || caseDescription.includes(searchTermValue);
      });
    };

    watch(searchTerm, handleFilterSearch);

    const fetchUser = async (userId: string) => {
      if (!usersMap.value[userId]) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          usersMap.value = { ...usersMap.value, [userId]: userDoc.data() as User };
        }
      }
    };

    watch([searchTerm, selectedStatus], () => {
      currentPage.value = 1; // Reset to first page when filters change
    }, { deep: true });

    const actions = ref({
      fetchCases,
    });

    onMounted(fetchCases);

    watch(cases, (newCases) => {
      newCases.forEach(caseItem => {
        if (caseItem.client_id && !usersMap.value[caseItem.client_id]) {
          fetchUser(caseItem.client_id);
        }
      });
    });

    watch(selectedStatus, () => {
      currentPage.value = 1;
    });

    const formatDate = (timestamp: Timestamp): string => {
      return timestamp.toDate().toLocaleDateString();
    };

    const router = useRouter();
    const navigateToCaseBoard = (caseId: string) => {
      router.push({ name: 'CaseBoard', params: { caseId: caseId.toString() } });
    };

    const paginatedCases = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return cases.value.slice(start, end);
    });

    const processedCases = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return cases.value
        .filter(caseItem => selectedStatus.value === null || caseItem.status === selectedStatus.value)
        .filter(caseItem => caseItem.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
        .slice(start, end)
        .map(caseItem => {
          const extraMembersCount = caseItem.team_members.length > 5 ? caseItem.team_members.length - 5 : 0;
          return {
            ...caseItem,
            displayedMembers: caseItem.team_members.slice(0, 5),
            extraMembersCount
          };
        });
    });

    const totalPages = computed(() => {
      const filteredCases = cases.value
        .filter(caseItem => selectedStatus.value === null || caseItem.status === selectedStatus.value)
        .filter(caseItem => caseItem.title.toLowerCase().includes(searchTerm.value.toLowerCase()));
      return Math.ceil(filteredCases.length / itemsPerPage.value);
    });

    const updatePage = (newPage: number) => {
      currentPage.value = newPage;
    };

    const changePage = (step: number, event: Event) => {
      const newPage = currentPage.value + step;
      if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage;
      } else {
        console.log(`Page change out of bounds: ${newPage}`);
      }
      event.preventDefault();
    };

    return {
      actions,
      cases,
      usersMap,
      fetchUser,
      formatDate,
      paginatedCases,
      totalPages,
      currentPage,
      updatePage,
      changePage,
      navigateToCaseBoard,
      processedCases,
      selectedStatus,
      currentDropdownTitle,
      handleFilterStatus,
      sortCasesByTimeAdded,
      handleFilterTime,
      filterTime,
      handleFilterSearch,
      searchTerm,
      updateSearchTerm,
    };
  },
  methods: {
    triggerNotification(type: string, header: string, message: string) {
      this.notificationType = type;
      this.notificationHeader = header;
      this.notificationMessage = message;
      (this.$refs.notificationRef as NotificationRef).showNotification();
    },
    openEditModal(caseItem: any) {
      this.selectedCase = caseItem;
      this.modalEditTitle = 'Edit case board';
      this.showEditModal = true;
    },
    async handleEditCase() {
      this.showEditModal = false;
      await this.actions.fetchCases();
      this.triggerNotification('success', 'Changes saved', 'Case board modified successfully.');
    },
    openAddModal() {
      this.modalAddTitle = 'Create New Case';
      this.showAddModal = true;
    },
    async handleAddCase() {
      this.showAddModal = false;
      await this.actions.fetchCases();
      this.triggerNotification('success', 'Changes saved', 'Case board added successfully.');
    },
    handleModalClose(value: boolean) {
      this.showEditModal = false;
      this.showAddModal = false;
    },
    handleButtonClick() {
    },
  },
});
</script>

<style>@import url(./styles/dashboard.scss);</style>
