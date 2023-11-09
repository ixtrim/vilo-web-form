import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api-vilo.nestvested.co/', // Replace with your API URL
  timeout: 10000
})

export default {
  fetchusers() {
    return apiClient.get('/auth/users/') // Replace with your API endpoint
  },
  fetchorganizations() {
    return apiClient.get('/settings/organizations/')
  },
  fetchpositions() {
    return apiClient.get('/settings/positions/')
  }
  // Other API methods
}
