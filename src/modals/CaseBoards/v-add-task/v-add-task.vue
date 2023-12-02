<template>
  <div class="modal-body">

    <div class="row">
      <div class="col-lg-12">
        <VInput 
          label="Title" 
          placeholder="New task" 
          v-model="localUserName"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <VTextarea 
          label="Description" 
          placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints." 
          v-model="computedUserNotes"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6">
        <div class="form-group">
          <label>Priority</label>
          <VDropdown :title="dropdownPriorityTitle" :items="dropdownPriority" @item-clicked="onPriorityChanged" />
        </div>
      </div>
      <div class="col-lg-6">
        <div class="form-group">
          <VInput 
            label="Due Date" 
            placeholder="02.12.2023" 
            v-model="localUserName"
          />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Assign to</label>
          <VDropdown :title="dropdownAssignToTitle" :items="dropdownAssignTo" @item-clicked="onAssignToChanged" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Reporter</label>
          <VDropdown :title="dropdownReporterTitle" :items="dropdownReporter" @item-clicked="onReporterChanged" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="form-group">
          <label>Attach file</label>
          <VDropdown :title="dropdownReporterTitle" :items="dropdownReporter" @item-clicked="onReporterChanged" />
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
Team
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

  const dropdownReporter = ref([
    { label: 'Sara Kozinska' },
    { label: 'Matthew Bowman' },
    { label: 'Bessy Hourigan'  },
    { label: 'Fiona Rainton'  },
    
  ]);
  const dropdownReporterTitle = ref('Matthew Bowman');
  function onReporterChanged(item: DropdownItem) {
    dropdownReporterTitle.value = item.label;
  }

  const dropdownAssignTo = ref([
    { label: 'Sara Kozinska' },
    { label: 'Matthew Bowman' },
    { label: 'Bessy Hourigan'  },
    { label: 'Fiona Rainton'  },
    
  ]);
  const dropdownAssignToTitle = ref('Matthew Bowman');
  function onAssignToChanged(item: DropdownItem) {
    dropdownAssignToTitle.value = item.label;
  }

  const dropdownPriority = ref([
    { label: 'Low' },
    { label: 'Medium'  },
    { label: 'High'  },
  ]);
  const dropdownPriorityTitle = ref('Low');
  function onPriorityChanged(item: DropdownItem) {
    dropdownPriorityTitle.value = item.label;
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