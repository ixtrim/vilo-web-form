<template>
  <div class="v-text-input-group">
    <div v-for="input in localInputs" :key="input.id" class="input-row">
      <VInput label="" placeholder="" v-model="input.value" />
      <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="removeInput(input.id)" text=""></VButton>
    </div>

    <VLink @click="addInput" icon="left" icon-style="add-blue">Add Item</VLink>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import type { PropType } from 'vue';
  import VInput from '@/components/v-input/VInput.vue';
  import VLink from '@/components/v-link/VLink.vue';
  import VButton from '@/components/v-button/VButton.vue';

  interface InputItem {
    value: string;
    id?: string;
  }

  const props = defineProps({
    inputs: {
      type: Array as PropType<InputItem[]>,
      default: () => []
    }
  });

  const emit = defineEmits(['update-inputs']);
  const localInputs = ref(props.inputs.map(input => ({ ...input, id: input.id || generateUniqueId() })));

  watch(() => props.inputs, (newInputs) => {
    localInputs.value = newInputs.map(input => ({ ...input, id: input.id || generateUniqueId() }));
  }, { deep: true });

  watch(localInputs, () => {
    emit('update-inputs', localInputs.value.map(({ id, ...rest }) => rest));
  }, { deep: true });

  const addInput = () => {
    localInputs.value.push({ value: '', id: generateUniqueId() });
  };

  const removeInput = (id: string) => {
    const index = localInputs.value.findIndex(input => input.id === id);
    if (index !== -1) {
      localInputs.value.splice(index, 1);
    }
  };

  function generateUniqueId() {
    const randomPart = Math.random().toString(36).substr(2, 9);
    const timePart = Date.now().toString(36);
    return `${timePart}-${randomPart}`;
  }
</script>

<style>
  @import url(./VTextInputGroup.scss);
</style>