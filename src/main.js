import '../theme/index.css'

import Vue from 'vue'
import App from './App.vue'
import { Button, Tree, Table, TableColumn, Dialog, Input } from 'element-ui';

Vue.config.productionTip = false

Vue.use(Button);
Vue.use(Tree);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Input);

new Vue({
  render: h => h(App)
}).$mount('#app')
