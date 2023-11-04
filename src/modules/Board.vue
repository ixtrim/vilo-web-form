<template>
  <div class="board">
    <List v-for="list in lists" :key="list.id" :list="list" />
  </div>
</template>

<script lang="ts">
import { Sortable } from '@shopify/draggable';
import List from '@/modules/Board/List.vue';

export default {
  components: {
    List
  },
  data() {
    return {
      lists: [
        // Sample data
        { id: 1, title: 'To Do', cards: [{ id: 'c1', title: 'Task 1' }] },
        { id: 1, title: 'To Do 2', cards: [{ id: 'c1', title: 'Task 1' }] },
        { id: 1, title: 'To Do 3', cards: [{ id: 'c1', title: 'Task 1' }] },
        // ... add more lists
      ]
    };
  },
  mounted() {
    const sortable = new Sortable(document.querySelectorAll('.list'), {
      draggable: '.card'
    });

    sortable.on('sortable:stop', (event) => {
      // Logic to update your data based on the drag-and-drop result
    });
  }
};
</script>

<style>
  @import url(./styles/board.scss);
</style>
