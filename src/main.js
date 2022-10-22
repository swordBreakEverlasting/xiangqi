import Vue from 'vue'
import App from './App.vue'
import router from './router';
import './plugins/element.js'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from "./store/index.js"

Vue.use(ElementUI);


axios.defaults.baseURL = "server";
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
