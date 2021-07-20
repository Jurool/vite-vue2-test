// import Vue from '~entrance';
import Vue from 'vue';
import App from './app/index/App.vue';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);

new Vue({
  render: (h) => h(App),
}).$mount(`#app`);
