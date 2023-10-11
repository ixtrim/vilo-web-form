import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/SignIn.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignIn.vue')
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import('../views/SignUp.vue')
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPassword.vue')
    },
    {
      path: '/email-verification',
      name: 'email-verification',
      component: () => import('../views/EmailVerification.vue')
    },
    {
      path: '/set-new-password',
      name: 'set-new-password',
      component: () => import('../views/SetNewPassword.vue')
    },
    {
      path: '/password-changed',
      name: 'password-changed',
      component: () => import('../views/PasswordChanged.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue')
    },
    {
      path: '/settings-team',
      name: 'settings-team',
      component: () => import('../views/SettingsTeam.vue')
    },
    {
      path: '/settings-notifications',
      name: 'settings-notifications',
      component: () => import('../views/SettingsNotifications.vue')
    },
    {
      path: '/settings-invoice',
      name: 'settings-invoice',
      component: () => import('../views/SettingsInvoice.vue')
    },
    {
      path: '/settings-calendar',
      name: 'settings-calendar',
      component: () => import('../views/SettingsCalendar.vue')
    },
    {
      path: '/settings-billing',
      name: 'settings-billing',
      component: () => import('../views/SettingsBilling.vue')
    },
    {
      path: '/clients-management',
      name: 'clients-management',
      component: () => import('../views/ClientsManagement.vue')
    }
  ]
})

export default router
