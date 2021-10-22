import Vue from 'vue';
import Vuex from 'vuex';
import world from './modules/world';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    world,
  },
  strict: debug
});
