<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-lg-12">
        BREADCRUMBS
      </div>
    </div>

    <div class="row">
      <div class="col-lg-10">
        <div class="dashboard__heading">
          <h1>Vilo Board</h1>
          <p>Time tracking, invoicing and expenses.</p>
        </div>
      </div>
      <div class="col-lg-2">
        <v-button :block="false" size="sm" icon="left" icon-style="edit--2" styled="outlined" @click="handleButtonClick" text="Edit"></v-button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        USER
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <Board />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import VButton from '@/components/v-button/VButton.vue';
import VModalSmall from '@/components/v-modal-small/v-modal-small.vue';
import Board from '@/modules/Board.vue';

export default defineComponent({
  components: {
    VButton,
    VModalSmall,
    Board
  },
  methods: {
    handleButtonClick() {
      
    },
  },
});
</script>

<style>
  @import url(./styles/dashboard.scss);
</style>
