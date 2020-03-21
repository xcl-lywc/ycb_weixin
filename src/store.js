import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	userData: null,
  	cargoOwnerType: 1,
  	cachedViews: [],
  	activeMenuIndex: 0,
  },
  mutations: {},
  actions: {}
});
