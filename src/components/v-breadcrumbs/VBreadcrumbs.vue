<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item" v-for="(item, index) in breadcrumbItems" :key="index">
        <a v-if="item.to" :href="item.to">{{ item.text }}</a>
        <span v-else>{{ item.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';

  export default defineComponent({
    props: {
      breadcrumbItems: {
        type: Array as PropType<Array<{ text: string; to?: string }>>,
        required: true,
      },
    },
  });
</script>

<style>
  @import url(./VBreadcrumbs.scss);
</style>