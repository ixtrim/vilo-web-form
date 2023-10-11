<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import HeroSectionVue from './modules/UserAuthentication/HeroSection.vue';
import Navigation from './modules/Navigation.vue';

const route = useRoute();

const showInitialContent = computed(() => {
  return route.path === '/sign-in' || route.path === '/sign-up' || route.path === '/forgot-password' || route.path === '/email-verification' || route.path === '/set-new-password' || route.path === '/password-changed' || route.path === '/';
});

</script>
<template>
  <div class="container-fluid">

    <div v-if="showInitialContent" class="row">

      <div class="col-lg-6 p-0">
        <div class="form-container">
          <header>
            <div class="row">
              <div class="col-lg-12">
                <div class="logo-wrap"> <img src="@/assets/logo-icon.svg" alt="vilo icon">
                  <h1>Vilo</h1>
                </div>
              </div>
            </div>
          </header>
          <RouterView />
          <footer>
            <div class="row">
              <div class="col-lg-6">© Vilo Inc. 2023</div>
              <div class="col-lg-6 text-end">
                <div class="footer-email-wrap"><img src="@/assets/mail.svg" /><span>help@vilo.com</span></div>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <div class="col-lg-6 p-0">
        <HeroSectionVue />
      </div>

    </div>

    <div v-else class="col-lg-12 p-0">

      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-2 p-0 text-center h-100 min-vh-100">
            <Navigation />
          </div>
          <div class="col-lg-10 p-0 text-center h-100 min-vh-100">
            <div class="dashboard">
              <RouterView />
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style lang="scss">
  @import './components/styles/variables/fonts.scss';

  .form-container {
    padding: 32px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .logo-wrap {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      h1 {
        font-family: var(--v-font-inter-semi-bold);
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 30px;
        margin-bottom: 0;
        margin-left: 16px;
      }
    }

    .footer-email-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;

      span {
        margin-left: 8px;
      }
    }
  }
</style>