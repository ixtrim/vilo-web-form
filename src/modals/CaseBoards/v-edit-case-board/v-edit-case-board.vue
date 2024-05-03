<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
        <VInput 
          label="Title" 
          placeholder="Vilo" 
          v-model="localTitle"
        />
        <p v-if="errorTitle" class="error-message">{{ errorTitle }}</p>
      </div>
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
        <p v-if="errorCode" class="error-message">{{ errorCode }}</p>
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
          <VMultiselect :items="filteredUsers" :selected="selectedTeamMembers" />
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
  import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
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
    role?: number;
  }

  interface User {
    full_name: string;
    id: string;
  }
  
  const localTitle = ref('');
  const localInvCode = ref('');
  const localDescription = ref('');
  const localClient = ref('');
  const errorTitle = ref('');
  const errorCode = ref('');
  const dropdownClient: Ref<DropdownItem[]> = ref([]);
  const adminUsers: Ref<DropdownItem[]> = ref([]);
  const filteredUsers: Ref<DropdownItem[]> = ref([]);

  const fetchClients = async () => {
    const clientsQuery = query(collection(db, "users"), where("role", "in", [3, 4]));
    const querySnapshot = await getDocs(clientsQuery);
    dropdownClient.value = [{ label: "General", value: "" }];
    dropdownClient.value.push(...querySnapshot.docs.map(doc => ({
      label: doc.data().full_name as string,
      value: doc.id
    })));
  };

  const allUsers: Ref<DropdownItem[]> = ref([]);
  const selectedTeamMembers: Ref<DropdownItem[]> = ref([]);

  const fetchAllUsers = async () => {
    const usersQuery = query(collection(db, "users"));
    const querySnapshot = await getDocs(usersQuery);
    allUsers.value = querySnapshot.docs.map(doc => ({
      label: doc.data().full_name,
      value: doc.id,
      role: doc.data().role
    }));
    adminUsers.value = allUsers.value.filter(user => user.role === 0);
    filteredUsers.value = allUsers.value.filter(user => user.role !== 0);
  };

  onMounted(async () => {
    await fetchClients();
    await fetchAllUsers();
  });

  const props = defineProps({
    caseData: Object,
  });

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);
  const dropdownClientTitle = ref('');

  watch(() => props.caseData, async (newValue) => {
    if (newValue) {
      localTitle.value = newValue.title;
      localInvCode.value = newValue.inv_code;
      localDescription.value = newValue.description;
      localClient.value = newValue.client_id;
      await fetchClients();
      if (!newValue.client_id || newValue.client_id === "0") {
        dropdownClientTitle.value = "General";
      } else {
        const selectedClient = dropdownClient.value.find(client => client.value === newValue.client_id);
        if (selectedClient) {
          dropdownClientTitle.value = selectedClient.label;
        }
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

  async function saveAndClose() {
    // Reset error messages
    errorTitle.value = '';
    errorCode.value = '';

    // Validation
    if (!localTitle.value.trim()) {
      errorTitle.value = 'Title is required!';
    }
    if (!localInvCode.value.trim()) {
      errorCode.value = 'Code is required!';
    }

    if (errorTitle.value || errorCode.value) {
      // Prevent saving if there are errors
      return;
    }
    
    if (props.caseData) {
      try {
        const caseRef = doc(db, "cases", props.caseData.id);
        await updateDoc(caseRef, {
          title: localTitle.value,
          inv_code: localInvCode.value,
          description: localDescription.value,
          client_id: localClient.value,
          team_members: selectedTeamMembers.value.map(member => member.value),
        });

        emit('save-clicked');
        closeModal();
      } catch (error) {
        console.error("Failed to save case:", error);
      }
    }
  }

</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>