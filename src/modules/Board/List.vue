<template>
  <div class="list">
    <h3>{{ list.title }}</h3>
    <Card v-for="card in list.cards" :key="card.id" :card="card" />
  </div>
</template>

<script>
import Card from '@/modules/Board/Card.vue';

export default {
  props: ['list'],
  components: {
    Card
  }
};
</script>
