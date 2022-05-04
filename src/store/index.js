import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Products:[],
    Personal:[],
    Tickets:[],
    loading: false,
  },
  mutations: {
    SET_PRODUCTS(state, Products) {
      state.Products = Products
    },
  },
  actions: {
    setProducts({commit}){
      commit('SET_LOADING', true)
      axios.get('http://localhost:3000/Products')
      .then( response => {
        commit('SET_PRODUCTS', response.data)
      })
      .finally(() => commit('SET_LOADING', false))
    },
  },
  getters: {
    allProducts: state => {
      return state.Products
    },
  },
  modules:{

  }
})