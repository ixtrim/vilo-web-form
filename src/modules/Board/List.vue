<template>
  <div class="list">
    <div class="list__drag">
      <span>Drag & Drop the column to change the order</span>
    </div>
    <h3>{{ list.title }} <span>{{ list.cards.length }}</span></h3>
    <Card v-for="card in list.cards" :key="card.id" :card="card" @editTask="handleEditTask" @previewTask="handlePreviewTask" />
    <VButton :block="true" size="md" icon="right" icon-style="add-blue" styled="secondary" @click="emitAddTaskEvent" text="Create new task"></VButton>
  </div>
</template>

<script lang="ts">
import Card from '@/modules/Board/Card.vue';
import VButton from '@/components/v-button/VButton.vue';

export default {
  props: ['list'],
  components: {
    Card,
    VButton
  },
  methods: {
    emitAddTaskEvent() {
      this.$emit('addTask');
    },
    handleEditTask(taskId: string) {
      this.$emit('editTask', taskId);
    },
    handlePreviewTask(taskId: string) {
      this.$emit('previewTask', taskId);
    }
  }
};
</script>
