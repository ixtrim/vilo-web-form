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

    <div class="row" v-if="userInfo.role === 0">
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
  import { computed, ref, onMounted } from 'vue';
  import { getAuth, signOut } from 'firebase/auth';
  import { useUserStore } from '@/stores/userStore';
  import { useRouter } from 'vue-router';

  import Logo     from '@/modules/Navigation/Logo.vue';
  import Menu     from '@/modules/Navigation/Menu.vue';
  import Settings from '@/modules/Navigation/Settings.vue';
  import User     from '@/modules/Navigation/User.vue';

  const auth = getAuth();
  const { user } = useUserStore();
  const router = useRouter();

  const userInfo = computed(() => {
    return {
      role: user.value?.role ?? '',
    };
  });
</script>

<style>
  @import url(./styles/navigation.scss);
</style>