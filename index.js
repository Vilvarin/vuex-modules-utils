export default class Module {
  constructor (resource = '', defaultModule) {
    this.resource = resource

    if (defaultModule) {
      this.namespaced = defaultModule.namespaced

      if (defaultModule.state) this.state = Object.assign({}, defaultModule.state)
      if (defaultModule.getters) this.getters = Object.assign({}, defaultModule.getters)
      if (defaultModule.mutations) this.mutations = Object.assign({}, defaultModule.mutations)
      if (defaultModule.actions) this.actions = Object.assign({}, defaultModule.actions)
      if (defaultModule.plugins) this.plugins = [...defaultModule.plugins]
    }
  }

  namespaced () {
    this.namespaced = true

    return this
  }

  addCreateAction () {
    this.actions.CREATE_ITEM = async ({ commit }, form) => {
      let res = await Vue.axios.post(this.resource, form)

      commit('SET_ITEM', res.data)
      commit('ADD_ITEM', res.data)
    }

    return this
  }

  addUpdateAction () {
    this.actions.UPDATE_ITEM = async ({ state, commit }, form) => {
      if (!state.item) return

      let res = await Vue.axios.post(`${this.resource}/update`, form)

      commit('SET_ITEM', res.data)
      commit('CHANGE_ITEM', res.data)
    }

    return this
  }

  addDeleteAction () {
    this.actions.DELETE_ITEM = async ({ state, commit }) => {
      if (!state.item) return

      let res = Vue.axios.delete(`${this.resource}/${state.item.id}`)

      if (res.data && !isEmptyObject(res.data)) {
        commit('SET_ITEM', res.data)
        commit('CHANGE_ITEM', res.data)
      }
    }

    return this
  }

  addRestoreAction () {
    this.actions.RESTORE_ITEM = async ({ state, commit }) => {
      if (!state.item) return

      let res = await Vue.axios.post(`${this.resource}/${state.item.id}/restore`)

      commit('SET_ITEM', res.data)
      commit('CHANGE_ITEM', res.data)
    }

    return this
  }

  itIsList () {
    this.state.items = []
    this.state.meta = null
    this.state.links = null

    this.mutations.SET_ITEMS = (state, items) => {
      state.items = items.data
      state.meta = items.meta
      state.links = items.links
    },

    this.mutations.CHANGE_ITEM = (state, item) => {
      let index = state.items.findIndex(el => Number(el.id) === Number(item.id))

      if (Number.isInteger(index)) {
        state.items.splice(index, 1, item)
      }
    }

    this.mutations.ADD_ITEM = (state, item) => {
      state.items.push(item)
    }

    this.actions.FETCH_ITEMS = async ({ commit }, params) => {
      let res = await Vue.axios.get(this.resource, { params })

      commit('SET_ITEMS', res.data)
    }
  }

  itIsItem () {
    this.state.item = null

    this.mutations.SET_ITEM = (state, item) => {
      state.item = item
    }

    this.actions.FETCH_ITEM = async ({ commit }, id) => {
      let res = await Vue.axios.get(`${this.resource}/${id}`)

      commit('SET_ITEM', res.data)
    }
  }

  fake (field, name) {
    this.state[field] = require(`@/store/data/${name}`).default
  }
}
