<template>
  <div class="my-tasks">
    <div class="row">
      <div class="col-lg-8">
        <h3>My Tasks</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/case-boards" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 align-center">
        <div class="my-tasks__wrapper">

          <ul class="my-tasks__wrapper__summary">
            <li>
              <VBadge variant="primary">In Progress (10)</VBadge>
            </li>
            <li>
              <VBadge variant="light">In Review (5)</VBadge>
            </li>
            <li>
              <VBadge variant="warning">Pending (0)</VBadge>
            </li>
          </ul>

          <div class="my-tasks__wrapper__item">
            <div class="my-tasks__wrapper__item__top">
              <h4>Create contract template for Employment Assignment</h4>
              <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" @click="" text=""></VButton>
            </div>
            <ul class="my-tasks__wrapper__item__bottom">
              <li>
                <VTimestamp variant="danger">21.10.2023</VTimestamp>
              </li>
              <li>
                <VLink to="/case-board" isRouteLink styled="secondary" icon="left" icon-style="tag">Sisyphus</VLink>
              </li>
            </ul>
          </div>

          <div class="my-tasks__wrapper__item">
            <div class="my-tasks__wrapper__item__top">
              <h4>Create contract template for Employment Assignment</h4>
              <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" @click="" text=""></VButton>
            </div>
            <ul class="my-tasks__wrapper__item__bottom">
              <li>
                <VTimestamp variant="success">16.11.2023</VTimestamp>
              </li>
              <li>
                <VLink to="/case-board" isRouteLink styled="secondary" icon="left" icon-style="tag">Morcpharm</VLink>
              </li>
            </ul>
          </div>

          <div class="my-tasks__wrapper__item">
            <div class="my-tasks__wrapper__item__top">
              <h4>Create contract template for Employment Assignment</h4>
              <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" @click="" text=""></VButton>
            </div>
            <ul class="my-tasks__wrapper__item__bottom">
              <li>
                <VTimestamp variant="light">07.11.2023</VTimestamp>
              </li>
              <li>
                <VLink to="/case-board" isRouteLink styled="secondary" icon="left" icon-style="tag">Lana Steiner</VLink>
              </li>
            </ul>
          </div>

          <div class="my-tasks__wrapper__item">
            <div class="my-tasks__wrapper__item__top">
              <h4>Create contract template for Employment Assignment</h4>
              <VButton :block="false" size="sm" icon="left" icon-style="preview" styled="simple-icon" @click="" text=""></VButton>
            </div>
            <ul class="my-tasks__wrapper__item__bottom">
              <li>
                <VTimestamp variant="warning">26.11.2023</VTimestamp>
              </li>
              <li>
                <VLink to="/case-board" isRouteLink styled="secondary" icon="left" icon-style="tag">Olivia Rhye</VLink>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VLink from '@/components/v-link/VLink.vue';
import VBadge from '@/components/v-badge/VBadge.vue';
import VTimestamp from '@/components/v-timestamp/VTimestamp.vue';
import VButton from '@/components/v-button/VButton.vue';

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VButton,
    VTimestamp
  },
});
</script>

<style>
  @import url(./MyTasks.scss);
</style>