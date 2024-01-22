<template>
  <div class="vilo-nav">

    <div class="row">
      <div class="col-lg-12">
        <Logo />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <br/><br/>
      </div>
    </div>

    <div class="row fill-space">
      <div class="col-lg-12">
        <Menu />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <Settings />
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <User />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  import Logo     from '@/modules/Navigation/Logo.vue';
  import Search   from '@/modules/Navigation/Search.vue';
  import Menu     from '@/modules/Navigation/Menu.vue';
  import Settings from '@/modules/Navigation/Settings.vue';
  import User     from '@/modules/Navigation/User.vue';
</script>

<style>
  @import url(./styles/navigation.scss);
</style>