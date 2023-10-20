<template>
  <div class="v-text-input-group">
    <div v-for="(input, index) in inputs" :key="index" class="input-row">
      <VInput label="" placeholder="" v-model="input.value" />
      <VButton :block="false" size="sm" icon="left" icon-style="delete" styled="simple-icon" @click="removeInput(index)"
        text=""></VButton>
    </div>

    <VLink @click="addInput" icon="left" icon-style="add-blue">Add Item</VLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VInput from '@/components/v-input/VInput.vue';
import VLink from '@/components/v-link/VLink.vue';
import VButton from '@/components/v-button/VButton.vue';

const inputs = ref([{ value: '' }]);

const addInput = () => {
  inputs.value.push({ value: '' });
};

const removeInput = (index: number) => {
  inputs.value.splice(index, 1);
};
</script>

<style>
@import url(./VTextInputGroup.scss);
</style>
