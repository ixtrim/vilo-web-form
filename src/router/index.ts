import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getCurrentUser } from '@/firebase.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/SignIn.vue')
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
      path: '/email-activation',
      name: 'email-activation',
      component: () => import('../views/EmailActivation.vue')
    },
    {
      path: '/set-new-password/:token1/:token2',
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
      path: '/case-boards',
      name: 'case-boards',
      component: () => import('../views/CaseBoards.vue')
    },
    {
      path: '/case-board',
      name: 'case-board',
      component: () => import('../views/CaseBoardsItem.vue')
    },
    {
      path: '/clients-management',
      name: 'clients-management',
      component: () => import('../views/ClientsManagement.vue')
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/Library.vue')
    },
    {
      path: '/library-templates',
      name: 'library-templates',
      component: () => import('../views/LibraryTemplates.vue')
    },
    {
      path: '/library-document',
      name: 'library-document',
      component: () => import('../views/LibraryDocument.vue')
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: () => import('../views/Invoices.vue')
    },
    {
      path: '/invoices-reports',
      name: 'invoices-reports',
      component: () => import('../views/InvoicesReports.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/Calendar.vue')
    },
    {
      path: '/calendar-weekly',
      name: 'calendar-weekly',
      component: () => import('../views/CalendarWeekly.vue')
    },
    {
      path: '/calendar-shared',
      name: 'calendar-shared',
      component: () => import('../views/CalendarShared.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/Chat.vue')
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
    }
  ]
});

let authInitialized = false; // Flag to track auth initialization

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  authInitialized = true; // Set the flag when the auth state is determined
  if (user) {
    // Optional: Store user info in a global state (e.g., Vuex) if needed
  }
});

router.beforeEach(async (to, from, next) => {
  // Wait for auth to be initialized
  if (!authInitialized) {
    await new Promise<void>((resolve) => { // Explicitly type the Promise as Promise<void>
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe(); // Unsubscribe after getting the auth state
        resolve(); // Resolve the promise without any value
      });
    });
  }

  const currentUser = auth.currentUser;
  const requiresAuth = !['/', '/sign-in', '/sign-up', '/forgot-password', '/email-verification', '/email-activation', '/set-new-password/:token1/:token2', '/password-changed'].includes(to.path);

  if (requiresAuth && !currentUser) {
    next('/sign-in');
  } else {
    next();
  }
});

export default router
