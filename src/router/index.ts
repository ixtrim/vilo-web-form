import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getCurrentUser } from '@/firebase.js';
import { useUserStore } from '@/stores/userStore';

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
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/case-boards',
      name: 'case-boards',
      component: () => import('../views/CaseBoards.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/case-board',
      name: 'case-board',
      component: () => import('../views/CaseBoardsItem.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/clients-management',
      name: 'clients-management',
      component: () => import('../views/ClientsManagement.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/Library.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/library-templates',
      name: 'library-templates',
      component: () => import('../views/LibraryTemplates.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/library-document',
      name: 'library-document',
      component: () => import('../views/LibraryDocument.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/invoices',
      name: 'invoices',
      component: () => import('../views/Invoices.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/invoices-reports',
      name: 'invoices-reports',
      component: () => import('../views/InvoicesReports.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/Calendar.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar-weekly',
      name: 'calendar-weekly',
      component: () => import('../views/CalendarWeekly.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar-shared',
      name: 'calendar-shared',
      component: () => import('../views/CalendarShared.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/Chat.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings-team',
      name: 'settings-team',
      component: () => import('../views/SettingsTeam.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings-notifications',
      name: 'settings-notifications',
      component: () => import('../views/SettingsNotifications.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings-invoice',
      name: 'settings-invoice',
      component: () => import('../views/SettingsInvoice.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings-calendar',
      name: 'settings-calendar',
      component: () => import('../views/SettingsCalendar.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings-billing',
      name: 'settings-billing',
      component: () => import('../views/SettingsBilling.vue'),
      meta: { requiresAuth: true }
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
  // Wait for the authentication system to be initialized
  if (!authInitialized) {
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        unsubscribe(); // Stop listening once we get the auth state
        resolve(); // Proceed with the routing
      });
    });
  }

  // Fetch the current user and their role, if needed
  const userStore = useUserStore();
  await userStore.fetchUserRoleIfNeeded();

  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isClient = currentUser && [3, 4].includes(userStore.user.value?.role as number);

  // Redirect unauthenticated users from protected routes to the sign-in page
  if (requiresAuth && !currentUser) {
    return next('/sign-in');
  }

  // Redirect clients directly to invoices page after login and restrict access to only invoices view
  if (isClient) {
    if (to.path !== '/invoices') {
      return next('/invoices');
    }
  } else {
    // For non-client users, check if they are trying to access admin-only pages
    const restrictedToAdmin = ['/settings', '/settings-team', '/settings-notifications', '/settings-invoice', '/settings-calendar', '/settings-billing'].includes(to.path);
    if (restrictedToAdmin && userStore.user.value?.role !== 0) {
      // Redirect non-admin users trying to access admin-only pages
      return next('/dashboard'); // Or any other appropriate page
    }
  }

  // If none of the above conditions are met, proceed with the navigation
  next();
});



export default router
