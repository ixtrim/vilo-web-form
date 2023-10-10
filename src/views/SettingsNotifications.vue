<template>
  <div class="container-fluid">
    
    <div class="row">
      <div class="col-lg-12">
        <TabsSettings />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="dashboard__heading">
          <h1>Notification settings</h1>
          <p>We may still send you important notifications about your account outside of your notification settings.</p>
        </div>
        
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import TabsSettings from '@/modules/TabsSettings.vue';
</script>

<style>
  @import url(./styles/settings.scss);
  @import url(./styles/dashboard.scss);
</style>
