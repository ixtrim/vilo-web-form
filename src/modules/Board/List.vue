<template>
  <div class="list">
    <h3>{{ list.title }} <span>{{ list.cards.length }}</span></h3>
    <Card v-for="card in list.cards" :key="card.id" :card="card" />
  </div>
</template>

<script lang="ts">
import Card from '@/modules/Board/Card.vue';

export default {
  props: ['list'],
  components: {
    Card
  }
};
</script>
