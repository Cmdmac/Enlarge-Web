import Vue from 'vue'
import App from './App.vue'
import { Button, Tree } from 'element-ui';

Vue.config.productionTip = false

Vue.use(Button);
Vue.use(Tree);

new Vue({
  render: h => h(App)
}).$mount('#app')
