<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import  HeroSectionVue from './views/HeroSection.vue';

</script>
<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6 p-0">
            <RouterView />

        </div>
        <div class="col-lg-6 p-0">
          <HeroSectionVue/>
        </div>
      </div>

      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> -->
    </div>

</template>
