<template>
  <div class="v-text-input-draggable-group" ref="draggableContainer">
    
    <div v-for="(input, index) in inputs" :key="index" class="input-row draggable-item">
      <div class="input-area">
        <VInput label="" placeholder="" v-model="input.value" />
        <div class="drag-handle"></div>
      </div>
      <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="removeInput(index)" text=""></VButton>
    </div>

    <VLink to="#" @click.prevent="addInput" icon="left" icon-style="add-blue">Add Item</VLink>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Sortable } from '@shopify/draggable';
import type { DraggableOptions } from '@shopify/draggable'; // Type-only import
import VInput from '@/components/v-input/VInput.vue';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';

const inputs = ref([{ value: '' }]);
const draggableContainer = ref<HTMLElement | null>(null); // Define the type of ref

// Define the type for sortable as Sortable or null
let sortable: Sortable | null = null;

onMounted(() => {
  if (draggableContainer.value) { // Check if the ref is not null
    sortable = new Sortable(draggableContainer.value, {
      draggable: '.draggable-item',
      handle: '.drag-handle'
    } as DraggableOptions);

    sortable.on('sortable:stop', (event) => {
      // Logic after dragging has stopped
    });
  }
});

onBeforeUnmount(() => {
  sortable?.destroy(); // Use optional chaining
});

const addInput = () => {
  inputs.value.push({ value: '' });
};

const removeInput = (index: number) => {
  inputs.value.splice(index, 1);
};
</script>

<style>
@import url(./VTextInputDraggableGroup.scss);
</style>
