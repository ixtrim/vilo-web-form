<template>
  <div class="modal-body temporary-img">
    
    <img src="@/assets/template_view.svg" alt="Vilo Icon">
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

  const localUserName = ref('');
  const localUserEmail = ref('');
  const localUserCompany = ref('');
  const localUserPhone = ref('');
  const localUserAddress = ref('');
  const localUserPosition = ref('');

  type DropdownItem = {
    label: string;
  };

  const emit = defineEmits(['close-modal', 'save-clicked', 'role-changed', 'status-changed']);
  const userNotes = ref();
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
  const dropdownTeamTitle = ref('Matthew Bowman');
  function onTeamChanged(item: DropdownItem) {
    dropdownTeamTitle.value = item.label;
  }

  const dropdownClient = ref([
    { label: 'Valaria Roches' },
    { label: 'Cooper Houtbie'  },
    { label: 'Giusto Tomson'  },
    { label: 'General use'  },
  ]);
  const dropdownClientTitle = ref('General use');
  function onClientChanged(item: DropdownItem) {
    dropdownClientTitle.value = item.label;
  }

  function closeModal() {
    emit('close-modal');
  }

  function saveAndClose() {
    emit('save-clicked');
    closeModal();
  }
</script>

<style>
@import url(@/components/v-modal/v-modal.scss);
</style>