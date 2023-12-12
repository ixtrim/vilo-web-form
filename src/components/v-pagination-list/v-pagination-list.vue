<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination-list">
      <li v-for="number in totalPages" :key="number" class="page-item" :class="{ 'active': currentPage === number }">
        <a class="page-link" href="#" @click.prevent="changePage(number)">{{ number }}</a>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'VPaginationList',
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    initialPage: {
      type: Number,
      default: 1
    }
  },
  emits: ['update:currentPage'],
  setup(props, { emit }) {
    const currentPage = ref(props.initialPage);

    const changePage = (pageNumber: number) => {
      currentPage.value = pageNumber;
      emit('update:currentPage', pageNumber);
    };

    // Watch for changes in initialPage prop and update currentPage
    watch(() => props.initialPage, (newVal) => {
      currentPage.value = newVal;
    });

    // Emit update:currentPage event when currentPage changes
    watch(currentPage, (newVal) => {
      emit('update:currentPage', newVal);
    });

    return {
      currentPage,
      changePage
    };
  }
});
</script>

<style>
  @import url(./v-pagination-list.scss);
</style>
