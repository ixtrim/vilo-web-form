<template>
  <div class="v-email-input-group">
    <div v-for="(email, index) in inputs" :key="index" class="input-row">
      <VInput label="" placeholder="" type="email" v-model="inputs[index]" />
      <VButton
        :block="false"
        size="sm"
        :icon="'left'"
        :icon-style="'delete'"
        :styled="'simple-icon'"
        @click="removeInput(index)"
        :is-route-link="false"
        text=""
        v-bind="$attrs as any"
      ></VButton>
    </div>

    <VLink
      @click="addInput"
      styled="secondary"
      icon="left"
      icon-style="add"
      to="#"
    >Add Item</VLink>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { PropType } from 'vue';
import VInput from '@/components/v-input/VInput.vue';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';

const props = defineProps({
  inputs: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});

const emit = defineEmits(['update:emails']);
const inputs = ref([...props.inputs]);

watch(() => props.inputs, (newInputs) => {
  inputs.value = newInputs || [];
}, { deep: true });

watch(inputs, (newInputs) => {
  emit('update:emails', newInputs);
}, { deep: true });

const addInput = () => {
  inputs.value.push('');
};

const removeInput = (index: number) => {
  inputs.value.splice(index, 1);
};
</script>

<style>
@import url(./VEmailInputGroup.scss);
</style>
