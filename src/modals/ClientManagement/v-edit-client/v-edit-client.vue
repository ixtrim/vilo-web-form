<template>
  <div class="modal fade modal-edit" ref="editClientModal" id="editClientModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          

        </div>
        <div class="modal-footer">
          <ul class="modal-footer__actions">
            <li>
              <v-button :block="false" size="md" styled="outlined" @click="closeModal" text="Close"></v-button>
            </li>
            <li>
              <v-button :block="false" size="md" styled="Primary" text="Save"></v-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Modal } from 'bootstrap';
import VButton from '@/components/v-button/VButton.vue';


const props = defineProps({
  title: String,
  user: Object as PropType<User | null>,
  show: Boolean
});

const emits = defineEmits(['close']);

const editClientModalRef = ref<HTMLElement | null>(null);
let modalInstance: Modal | null = null;

onMounted(async () => {
  await nextTick();
  console.log(editClientModalRef.value); // Should not be null if the element exists in the DOM
  if (editClientModalRef.value) {
    modalInstance = new Modal(editClientModalRef.value, {
      backdrop: 'static',
      keyboard: false
    });

    editClientModalRef.value.addEventListener('hidden.bs.modal', () => {
      emits('close');
    });
  }
});

console.log('CLREF3' + editClientModalRef.value);

const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide();
  }
  emits('close');
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (modalInstance) {
        modalInstance.show();
      }
    });
  } else {
    if (modalInstance) {
      modalInstance.hide();
    }
  }
});

onUnmounted(() => {
  if (modalInstance) {
    modalInstance.dispose();
  }
});
</script>

<style>
  @import url(@/components/v-modal/v-modal.scss);
</style>