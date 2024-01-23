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
                  <VDropdown :title="'All cases'" :items="sortCases" @item-clicked="handleDropdownClick" />
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

            <div class="dashboard__table__page__item" v-for="caseItem in cases" :key="caseItem.id">
              <div class="col col--cb-case">
                <ul>
                  <li>
                    <img :src="caseItem.icon" :alt="caseItem.title" />
                  </li>
                  <li>
                    <h4 class="active" @click="navigateToCaseBoard(1)">{{ caseItem.title }}</h4>
                  </li>
                </ul>
              </div>
              <div class="col col--cb-client">
                <template v-if="caseItem.client_id && usersMap[caseItem.client_id]">
                  <VUser :userName="usersMap[caseItem.client_id].full_name" :userAvatar="usersMap[caseItem.client_id].avatar" />
                </template>
                <span v-else class="col--cb-client__general">General {{ caseItem.client_id }}</span>
              </div>
              <div class="col col--cb-about">
                <span class="col--cb-about__description">{{ caseItem.description }}</span>
              </div>
              <div class="col col--cb-users">
                <img src="@/assets/temporary/case-boards-users.png" alt="" />
              </div>
              <div class="col col--cb-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditModal" text=""></VButton>
              </div>
            </div>

            <div class="dashboard__table__page__item">
              <div class="col col--cb-case">
                <ul>
                  <li>
                    <img src="@/assets/temporary/Avatar-2.svg" alt="" />
                  </li>
                  <li>
                    <h4 class="active" @click="navigateToCaseBoard(1)">Capsule</h4>
                  </li>
                </ul>
              </div>
              <div class="col col--cb-client">
                <VUser userName="Olivia Rhye" />
              </div>
              <div class="col col--cb-about">
                <span class="col--cb-about__title">Design software</span>
                <span class="col--cb-about__description">Super lightweight design app</span>
              </div>
              <div class="col col--cb-users">
                <img src="@/assets/temporary/case-boards-users.png" alt="" />
              </div>
              <div class="col col--cb-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditModal" text=""></VButton>
              </div>
            </div>

            <div class="dashboard__table__page__item">
              <div class="col col--cb-case">
                <ul>
                  <li>
                    <img src="@/assets/temporary/Avatar-3.svg" alt="" />
                  </li>
                  <li>
                    <h4 class="active" @click="navigateToCaseBoard(1)">Smith v. Jones, New York State Court</h4>
                  </li>
                </ul>
              </div>
              <div class="col col--cb-client">
                <VUser userName="John Norbit" />
              </div>
              <div class="col col--cb-about">
                <span class="col--cb-about__title">Data prediction</span>
                <span class="col--cb-about__description">AI and machine learning data</span>
              </div>
              <div class="col col--cb-users">
                <img src="@/assets/temporary/case-boards-users.png" alt="" />
              </div>
              <div class="col col--cb-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditModal" text=""></VButton>
              </div>
            </div>

            <div class="dashboard__table__page__item">
              <div class="col col--cb-case">
                <ul>
                  <li>
                    <img src="@/assets/temporary/Avatar-4.svg" alt="" />
                  </li>
                  <li>
                    <h4 class="active" @click="navigateToCaseBoard(1)">Hourglass</h4>
                  </li>
                </ul>
              </div>
              <div class="col col--cb-client">
                <span class="col--cb-client__general">General</span>
              </div>
              <div class="col col--cb-about">
                <span class="col--cb-about__title">Productivity app</span>
                <span class="col--cb-about__description">Time management and productivity</span>
              </div>
              <div class="col col--cb-users">
                <img src="@/assets/temporary/case-boards-users.png" alt="" />
              </div>
              <div class="col col--cb-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditModal" text=""></VButton>
              </div>
            </div>

            <div class="dashboard__table__page__item">
              <div class="col col--cb-case">
                <ul>
                  <li>
                    <img src="@/assets/temporary/Avatar-5.svg" alt="" />
                  </li>
                  <li>
                    <h4 class="active" @click="navigateToCaseBoard(1)">Layers</h4>
                  </li>
                </ul>
              </div>
              <div class="col col--cb-client">
                <VUser userName="Ben Konopsky" />
              </div>
              <div class="col col--cb-about">
                <span class="col--cb-about__title">Web app integrations</span>
                <span class="col--cb-about__description">Connect web apps seamlessly</span>
              </div>
              <div class="col col--cb-users">
                <img src="@/assets/temporary/case-boards-users.png" alt="" />
              </div>
              <div class="col col--cb-action">
                <VButton :block="false" size="sm" icon="left" icon-style="edit" styled="simple-icon" @click="openEditModal" text=""></VButton>
              </div>
            </div>

          </div>

          <div class="dashboard__table__pagination">
            <div class="dashboard__table__pagination__prev">
              <v-button :block="false" size="sm" icon="left" icon-style="arrow-left" styled="outlined" @click="prevPage"
                text="Previous"></v-button>
            </div>
            <div class="dashboard__table__pagination__pages">
              <v-pagination-list :total-pages="totalPages" @update:currentPage="updatePage" />
            </div>
            <div class="dashboard__table__pagination__next">
              <v-button :block="false" size="sm" icon="right" icon-style="arrow-right" styled="outlined" @click="nextPage"
                text="Next"></v-button>
            </div>
          </div>

        </div>

      </div>
    </div>

    <VModal :show="showEditModal || showAddModal" :title="modalEditTitle || modalAddTitle" @update:show="handleModalClose">
      <VEditCaseBoard v-if="showEditModal" :title="modalEditTitle" @close-modal="showEditModal = false" @save-clicked="handleEditCase" />
      <VAddCaseBoard v-if="showAddModal" :title="modalAddTitle" @close-modal="showAddModal = false" @save-clicked="handleAddCase" />
    </VModal>

    <VNotification ref="notificationRef" :type="notificationType" :header="notificationHeader" :message="notificationMessage" :duration="7000" />

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase.js';
import firebase from 'firebase/app';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';
import Search from '@/modules/Cases/Search.vue';
import VUser from '@/components/v-user/v-user.vue';
import VPaginationList from '@/components/v-pagination-list/v-pagination-list.vue';
import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
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
  time_added: Timestamp; // Use Firestore Timestamp
}

interface User {
  full_name: string;
  avatar: string;
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
    VLink,
    VButton,
    VUser,
    VPaginationList,
    VModalSmall,
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
        { label: 'My cases' },
        { label: 'Drafts cases' },
        { label: 'Archived cases' },
        { label: 'Hidden cases' },
      ],
    };
  },
  setup() {
    const cases = ref<Case[]>([]);
    const usersMap = ref<{ [key: string]: User }>({});

    const fetchCases = async () => {
      const querySnapshot = await getDocs(collection(db, "cases"));
      cases.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Case);
      cases.value.forEach(caseItem => {
        if (caseItem.client_id) {
          fetchUser(caseItem.client_id);
        }
      });
    };

    const fetchUser = async (userId: string) => {
      if (!usersMap.value[userId]) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          // Using Vue.set for reactivity in Vue 3
          usersMap.value = { ...usersMap.value, [userId]: userDoc.data() as User };
        }
      }
    };

    onMounted(fetchCases);

    watch(cases, (newCases) => {
      newCases.forEach(caseItem => {
        if (caseItem.client_id && !usersMap.value[caseItem.client_id]) {
          fetchUser(caseItem.client_id);
        }
      });
    });

    const formatDate = (timestamp: Timestamp): string => {
      return timestamp.toDate().toLocaleDateString();
    };

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

    const router = useRouter();
    const navigateToCaseBoard = (caseId: number) => {
      //router.push(`/case-board/${caseId}`);
      router.push(`/case-board`);
    };

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
      cases,
      usersMap,
      fetchUser,
      formatDate,
      paginatedItems,
      totalPages,
      currentPage,
      navigateToCaseBoard,
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
    handleDropdownClick(item: any) {
      console.log('Dropdown item clicked', item);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    openEditModal() {
      this.modalEditTitle = 'Edit case board';
      this.showEditModal = true;
    },
    handleEditCase() {
      this.showEditModal = false;
      this.triggerNotification('success', 'Changes saved', 'Case board modified successfully.');
    },
    openAddModal() {
      this.modalAddTitle = 'Create New Case';
      this.showAddModal = true;
    },
    handleAddCase() {
      this.showAddModal = false;
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
