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
        <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
      </li>
      <li>
        <v-button :block="false" size="md" styled="Primary" @click="saveAndClose" text="Save"></v-button>
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

  const allUsers: Ref<DropdownItem[]> = ref([]);
  const selectedTeamMembers: Ref<DropdownItem[]> = ref([]);

  const fetchAllUsers = async () => {
    const usersQuery = query(collection(db, "users"));
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

  async function saveAndClose(event: any) {
    event.stopPropagation();
    try {
      await addDoc(collection(db, "cases"), {
        title: localTitle.value,
        description: localDescription.value,
        client_id: localClient.value === '0' ? '' : localClient.value,
        team_members: selectedTeamMembers.value.map(member => member.value),
        time_added: new Date(),
        status: 1,
        icon: 'https://firebasestorage.googleapis.com/v0/b/vilo-ebc86.appspot.com/o/cases_icons%2FAvatar-5.svg?alt=media&token=04e731e6-cdba-4429-81ea-6ad753b2743c'
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