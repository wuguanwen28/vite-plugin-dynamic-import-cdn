import Vue from 'vue'
import App from './App.vue'
import router from './router'

const app = new Vue({
  router: router,
  render: (h) => h(App)
})

app.$mount('#app')
