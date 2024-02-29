<template>
  <div class="multiselect">
    
    <div class="multiselect-selected-items">
      <span v-for="item in selected" :key="item.value">
        {{ item.label }}
        <button @click="removeItem(item)"></button>
      </span>
    </div>

    <select @change="addItem($event)" multiple>
      <option v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRefs } from 'vue';

interface DropdownItem {
  label: string;
  value: string;
}

// Define props with types
const props = defineProps({
  items: {
    type: Array as () => DropdownItem[],
    default: () => []
  },
  selected: {
    type: Array as () => DropdownItem[],
    default: () => []
  }
});

// Convert props to refs
const { items, selected } = toRefs(props);

// Method to add an item to the selected list
function addItem(event: Event) {
  const target = event.target as HTMLSelectElement; // Safely cast the event target
  if (target && target.value) {
    const item = items.value.find(i => i.value === target.value);
    if (item && !selected.value.find(i => i.value === target.value)) {
      selected.value.push(item);
      emit('update:selected', selected.value);
    }
  }
}

// Method to remove an item from the selected list
function removeItem(itemToRemove: DropdownItem) {
  selected.value = selected.value.filter(item => item.value !== itemToRemove.value);
  // Emit an update event for parent components
  emit('update:selected', selected.value);
}

// Emit function needs to be defined for emitting events to parent
const emit = defineEmits(['update:selected']);
</script>

<style>
  @import url(./VMultiselect.scss);
</style>

