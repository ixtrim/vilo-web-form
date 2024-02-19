<template>
  <div class="pending-documents">
    <div class="row">
      <div class="col-lg-8">
        <h3>Pending documents</h3>
      </div>
      <div class="col-lg-4 align-right">
        <VLink to="/library" isRouteLink styled="secondary">View all</VLink>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__table">

          <div class="dashboard__table__head">
            <div class="col col--l-document">
              <h4>Document name</h4>
            </div>
            <div class="col col--l-status">
              <h4>Status</h4>
            </div>
            <div class="col col--l-uploaded"> 
              <h4>Date uploaded</h4>
            </div>
            <div class="col col--l-updated">
              <h4>Last updated</h4>
            </div>
            <div class="col col--l-created">
              <h4>Created by</h4>
            </div>
            <div class="col col--l-sign">
              &nbsp;
            </div>
          </div>

          <div class="dashboard__table__page">

            

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
import VUser from '@/components/v-user/v-user.vue';
import VButton from '@/components/v-button/VButton.vue';
import VFile from '@/components/v-file/VFile.vue';

export default defineComponent({
  components: {
    VLink,
    VBadge,
    VUser,
    VButton,
    VFile,
  },
});
</script>

<style>
  @import url(./PendingDocuments.scss);
</style>