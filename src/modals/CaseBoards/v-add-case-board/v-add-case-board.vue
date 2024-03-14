<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Title" 
          placeholder="Vilo" 
          v-model="localTitle"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
        <VInput 
          label="Code" 
          placeholder="VILO" 
          v-model="localInvCode"
        />
        <small>4 digits for invoicing purpose</small>
      </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Client</label>
          <VDropdown :title="dropdownClientTitle" :items="dropdownClient" @item-clicked="onClientChanged" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VTextarea 
          label="Description" 
          placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints." 
          v-model="localDescription"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Add team members</label>
          <VMultiselect :items="allUsers" :selected="selectedTeamMembers" />
        </div>
      </div>
    </div>

  </div>
  <div class="modal-footer">
    <ul class="modal-footer__actions">
      <li>
        <v-button :block="false" size="md" styled="outlined" icon="left" icon-style="save" @click="saveAndClose" text="Save as draft"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="Primary" @click="saveAndClose" text="Create a case"></v-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { db } from '@/firebase.js';
  import { addDoc, doc, getDoc, updateDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
  import { onMounted, ref, watch, computed } from 'vue';
  import type { Ref } from 'vue';
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VMultiselect from '@/components/v-multiselect/VMultiselect.vue';

  interface DropdownItem {
    label: string;
    value: string;
  }

  interface User {
    full_name: string;
    id: string;
  }
  
  const localTitle = ref('');
  const localInvCode = ref('');
  const localDescription = ref('');
  const localClient = ref('0');
  const dropdownClient: Ref<DropdownItem[]> = ref([]);

  const fetchClients = async () => {
    const clientsQuery = query(collection(db, "users"), where("role", "in", [3, 4]));
    const querySnapshot = await getDocs(clientsQuery);
    dropdownClient.value = querySnapshot.docs.map(doc => ({
      label: doc.data().full_name as string,
      value: doc.id
    }));
  };

  const iconUrls = [
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2FAvatar-2.svg?alt=media&token=e79a0a6d-8421-4993-b152-ee542fd7e0ed',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2FAvatar-3.svg?alt=media&token=e87795eb-7045-40a1-94d7-59266b90973b',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2FAvatar-4.svg?alt=media&token=409fa9e4-efdf-4dfd-8d06-92accc7efb4f',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2FAvatar-5.svg?alt=media&token=04e731e6-cdba-4429-81ea-6ad753b2743c',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2FAvatar.svg?alt=media&token=5b5f5742-716b-4637-86c1-ba4bc5279c17',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Fanalysis.png?alt=media&token=51c3b46b-a970-4d38-a30e-bec1e43f5864',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Fsuitcase.png?alt=media&token=149c77dd-ebc6-4544-8888-64f6c9bedcb6',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Fstudy.png?alt=media&token=5d0cdb10-1b7a-4bdf-b0cc-59ca8bedae31',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Fprotective.png?alt=media&token=d3b62eca-2409-476d-97fe-a5bd7b76ee64',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Flayers.png?alt=media&token=7ee756de-b1e4-46de-8fd0-86d42f481876',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Flayer.png?alt=media&token=92ba9229-13f4-4f96-8a97-655b3f4ec208',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Fgavel.png?alt=media&token=e545238e-4d84-4743-b39a-9059c62cfdea',
    'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Fcase.png?alt=media&token=9b580423-3b72-4a73-9548-c8e120874f35',
  ];
  function getRandomIconUrl() {
    const randomIndex = Math.floor(Math.random() * iconUrls.length);
    return iconUrls[randomIndex];
  }

  const allUsers: Ref<DropdownItem[]> = ref([]);
  const selectedTeamMembers: Ref<DropdownItem[]> = ref([]);

  const fetchAllUsers = async () => {
    const usersQuery = query(collection(db, "users"), where("role", "in", [0, 1, 2]));
    const querySnapshot = await getDocs(usersQuery);
    allUsers.value = querySnapshot.docs.map(doc => ({
      label: doc.data().full_name as string,
      value: doc.id
    }));
  };

  onMounted(async () => {
    await fetchClients();
    await fetchAllUsers();
  });

  const props = defineProps({
    caseData: Object,
  });

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);
  const dropdownClientTitle = ref('General');

  watch(() => props.caseData, async (newValue) => {
    if (newValue) {
      localTitle.value = newValue.title;
      localInvCode.value = newValue.inv_code;
      localDescription.value = newValue.description;
      localClient.value = newValue.client_id;
      await fetchClients();
      const selectedClient = dropdownClient.value.find(client => client.value === newValue.client_id);
      if (selectedClient) {
        dropdownClientTitle.value = selectedClient.label;
      }
    }
  }, { immediate: true });

  watch(allUsers, () => {
    if (props.caseData) {
      selectedTeamMembers.value = props.caseData.team_members.map((memberId: string) => {
        const user = allUsers.value.find(user => user.value === memberId);
        return user ? { label: user.label, value: user.value } : null;
      }).filter(Boolean);
    }
  }, { immediate: true });

  function onClientChanged(item: DropdownItem) {
    dropdownClientTitle.value = item.label;
    localClient.value = item.value;
  }

  function closeModal() {
    emit('close-modal');
  }

  async function saveAsDraft(event: any) {
    event.stopPropagation();
    try {
      await addDoc(collection(db, "cases"), {
        title: localTitle.value,
        inv_code: localInvCode.value,
        description: localDescription.value,
        client_id: localClient.value === '0' ? '' : localClient.value,
        team_members: selectedTeamMembers.value.map(member => member.value),
        time_added: new Date(),
        status: 0,
        icon: 'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2Fcase-draft.png?alt=media&token=d65fe279-2ac4-4643-bab4-ae755903c19d',
      });

      emit('save-clicked');
      closeModal();
    } catch (error) {
      console.error("Failed to add new case:", error);
    }
  }

  async function saveAndClose(event: any) {
    event.stopPropagation();
    try {
      await addDoc(collection(db, "cases"), {
        title: localTitle.value,
        inv_code: localInvCode.value,
        description: localDescription.value,
        client_id: localClient.value === '0' ? '' : localClient.value,
        team_members: selectedTeamMembers.value.map(member => member.value),
        time_added: new Date(),
        status: 1,
        icon: getRandomIconUrl(),
      });

      emit('save-clicked');
      closeModal();
    } catch (error) {
      console.error("Failed to add new case:", error);
    }
  }

</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>