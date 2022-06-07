import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Products: [],
    Pedidos: [],
    DPedido: [],
    loading: false,
  },
  mutations: {
    SET_PEDIDOS(state, Pedidos) {
      state.Pedidos = Pedidos
    },
    SET_DPEDIDOS(state, DPedidos) {
      state.DPedido = DPedidos
    },
    SET_LOADING(state, load) {
      state.loading = load
    }
  },
  actions: {
    EjecutaPython({ commit }, { onComplete }) {
      commit('SET_LOADING', true)
      axios.post(`https://shark-app-zh2h5.ondigitalocean.app/python`)
        .then(onComplete)
    },
    setDetallePedido({ commit }, { id, onComplete, onError }) {
      commit('SET_LOADING', true)
      axios.post(`https://shark-app-zh2h5.ondigitalocean.app/detalles-pedidos/${id}`)
        .then(onComplete)
        .catch(onError)
    },
    setPedidos({ commit }, { id }) {
      commit('SET_LOADING', true)
      axios.get(`https://shark-app-zh2h5.ondigitalocean.app/pedidos/${id}`)
        .then(response => {
          var Aux = [];
          response.data.forEach(element => {
            if (element.FECHA_ENTREGA == null) {
              Aux.push({
                ID_PEDIDO: element.ID_PEDIDO,
                FECHA_PEDIDO: new Date(element.FECHA_PEDIDO).toISOString().substring(0, 10),
                FECHA_ENTREGA: null,
                STATUS: element.STATUS
              });
            } else {
              Aux.push({
                ID_PEDIDO: element.ID_PEDIDO,
                FECHA_PEDIDO: new Date(element.FECHA_PEDIDO).toISOString().substring(0, 10),
                FECHA_ENTREGA: new Date(element.FECHA_ENTREGA).toISOString().substring(0, 10),
                STATUS: element.STATUS
              });
            }

          });
          commit('SET_PEDIDOS', Aux)
        })
        .finally(() => commit('SET_LOADING', false))
    },
    Login({ commit }, { params, onComplete, onError }) {
      commit('SET_LOADING', true)
      axios.post('https://shark-app-zh2h5.ondigitalocean.app/Login', params)
        .then(onComplete)
        .catch(onError)
    },
    LoginEmpleados({ commit }, { params, onComplete, onError }) {
      commit('SET_LOADING', true)
      axios.post('https://shark-app-zh2h5.ondigitalocean.app/Login2', params)
        .then(onComplete)
        .catch(onError)
    },
    setCliente({ commit }, { id, onComplete, onError }) {
      commit('SET_LOADING', true)
      axios.post(`https://shark-app-zh2h5.ondigitalocean.app/Cliente/${id}`)
        .then(onComplete)
        .catch(onError)
    },
    setproductoCat({ commit }, { id, onComplete, onError }) {
      commit('SET_LOADING', true)
      axios.post(`https://shark-app-zh2h5.ondigitalocean.app/products-cat/${id}`)
        .then(onComplete)
        .catch(onError)
    },
    productInfo({ commit }, { id, onComplete, onError }) {
      commit('SET_LOADING', true)
      axios.post(`https://shark-app-zh2h5.ondigitalocean.app/detalles-products/${id}`)
        .then(onComplete)
        .catch(onError)
    },
    confirmaPedido({ commit }, { id, params, onComplete, onError }) {
      commit('SET_LOADING', true)
      axios.put(`https://shark-app-zh2h5.ondigitalocean.app/Act-Estado-Prod/${id}`, params)
        .then(onComplete)
        .catch(onError)
    },
  },
  getters: {
    allPedidos: state => {
      return state.Pedidos
    }
  },
})