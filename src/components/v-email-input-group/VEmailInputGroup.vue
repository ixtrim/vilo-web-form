<template>
  <div class="v-email-input-group">
    <div v-for="(input, index) in inputs" :key="index" class="input-row">
      <VInput label="" placeholder="" type="email" v-model="input.value" />
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
import { defineComponent, ref, watch, toRefs } from 'vue';
import type { PropType } from 'vue';
import VInput from '@/components/v-input/VInput.vue';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';

const props = defineProps({
  inputs: Array
});

const emit = defineEmits(['update:emails']);
const inputs = ref([{ value: '' }]);

watch(inputs, (newInputs) => {
  emit('update:emails', newInputs.map(input => input.value));
}, { deep: true });

const addInput = () => {
  inputs.value.push({ value: '' });
};

const removeInput = (index: number) => {
  inputs.value.splice(index, 1);
};
</script>

<style>
@import url(./VEmailInputGroup.scss);
</style>
