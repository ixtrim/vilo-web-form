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
          <VMultiselect :items="allUsers" v-model:selected="selectedTeamMembers" />
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
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';
  import VMultiselect from '@/components/v-multiselect/VMultiselect.vue';
  

  const localTitle = ref('');
  const localDescription = ref('');
  const localClient = ref('');
  const dropdownClient = ref<DropdownItem[]>([]);

  const fetchClients = async () => {
  const clientsQuery = query(collection(db, "users"), where("role", "in", [3, 4]));
  const querySnapshot = await getDocs(clientsQuery);
  dropdownClient.value = querySnapshot.docs.map(doc => ({
      label: doc.data().full_name, // Assuming you want to display the client's full name
      value: doc.id // Storing the client's ID for later use
    }));
  };

  const allUsers = ref<DropdownItem[]>([]);
  const selectedTeamMembers = ref<DropdownItem[]>([]);

  const fetchAllUsers = async () => {
    const usersQuery = query(collection(db, "users"));
    const querySnapshot = await getDocs(usersQuery);
    allUsers.value = querySnapshot.docs.map(doc => ({
      label: doc.data().full_name,
      value: doc.id
    }));
  };

  onMounted(() => {
    fetchClients();
    fetchAllUsers();
  });

  const props = defineProps({
    caseData: Object,
  });

  type DropdownItem = {
    label: string;
    value: string;
  };

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);

  const dropdownTeam = ref([
    { label: 'Sara Kozinska' },
    { label: 'Matthew Bowman' },
    { label: 'Bessy Hourigan'  },
    { label: 'Fiona Rainton'  },
    
  ]);
  const dropdownTeamTitle = ref('Bessy Hourigan');
  function onTeamChanged(item: DropdownItem) {
    dropdownTeamTitle.value = item.label;
  }
  const dropdownClientTitle = ref('Giusto Tomson');

  watch(() => props.caseData, async (newValue) => {
    if (newValue) {
      localTitle.value = newValue.title;
      localDescription.value = newValue.description;
      localClient.value = newValue.client_id;
      // Fetch clients to ensure dropdownClient is populated
      await fetchClients();
      // Find the client in dropdownClient to set the title
      const selectedClient = dropdownClient.value.find(client => client.value === newValue.client_id);
      if (selectedClient) {
        dropdownClientTitle.value = selectedClient.label;
      }
      selectedTeamMembers.value = newValue.team_members.map((memberId: string) => {
        const user = allUsers.value.find(user => user.value === memberId);
        return user ? user : { label: "Unknown", value: memberId };
      });
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
    if (props.caseData) {
      try {
        const caseRef = doc(db, "cases", props.caseData.id);
        await updateDoc(caseRef, {
          title: localTitle.value,
          description: localDescription.value,
          client_id: localClient.value,
          team_members: selectedTeamMembers.value.map(member => member.value),
          // Include other fields that need to be updated
        });

        emit('save-clicked');
        closeModal();
      } catch (error) {
        console.error("Failed to save case:", error);
        // Handle the error appropriately
      }
    }
  }

</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>