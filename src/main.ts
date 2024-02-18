import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Ensure Firebase is initialized before the Vue app
import './firebase' // Adjust this path if your Firebase initialization file is located elsewhere

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'

const app = createApp(App)

app.use(router)

app.mount('#app')
