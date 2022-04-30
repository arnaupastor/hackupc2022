import Vue from 'vue'
import App from './App.vue'
import router from "./routes";
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import axios from "axios";
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
axios.defaults.baseURL = 'http://localhost:3000/api'

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')
