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
          <VDropdown :title="dropdownTeamTitle" :items="dropdownTeam" @item-clicked="onTeamChanged" />
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
  import { doc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
  import { ref, watch, computed } from 'vue';
  import type { PropType } from 'vue';
  import { defineEmits, defineProps } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VTextarea from '@/components/v-textarea/v-textarea.vue';
  import VDropdown from '@/components/v-dropdown/VDropdown.vue';
  import VButton from '@/components/v-button/VButton.vue';

  const localTitle = ref('');
  const localDescription = ref('');
  const localClient = ref('');

  const props = defineProps({
    caseData: Object,
  });

  type DropdownItem = {
    label: string;
  };

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);
  const userNotes = ref('The plaintiff, Emily Smith, filed a lawsuit against the defendant, David Jones, alleging that Jones negligently caused a car accident on December 1, 2022, resulting in significant damage to Smiths vehicle and personal injuries. Smith claims that Jones ran a red light at the intersection of 5th Avenue and Main Street in New York City, colliding with her vehicle.');
  const computedUserNotes = computed({
    get: () => userNotes.value === 'string' ? '' : userNotes.value,
    set: (val) => userNotes.value = val
  });

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

  const dropdownClient = ref([
    { label: 'Valaria Roches' },
    { label: 'Cooper Houtbie'  },
    { label: 'Giusto Tomson'  },
    { label: 'General use'  },
  ]);
  const dropdownClientTitle = ref('Giusto Tomson');

  watch(() => props.caseData, (newValue) => {
    if (newValue) {
      localTitle.value = newValue.title;
      localDescription.value = newValue.description;
      localClient.value = newValue.client_id;
    }
  }, { immediate: true });

  function onClientChanged(item: DropdownItem) {
    dropdownClientTitle.value = item.label;
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