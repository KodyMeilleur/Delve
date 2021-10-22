// initial state
const state = () => ({
  map: [],
  continents: [],
  disasterOngoing: false
})

// getters
const getters = {
  continents: (state) => {
    return state.continents;
  },
  map: (state) => {
    return state.map;
  },
}

// actions
const actions = {
  addContinent ({ commit }, continent) {
    const savedContinents = [...state.continents]
    savedContinents.push(continent);
    // empty cart
    commit('setContinents', savedContinents)
    // do something else eventually
  },
}

// mutations
const mutations = {
  pushContinentToWorld (state, { id }) {
    state.continents.push({
      id,
      quantity: 1
    })
  },

  setMap (state, map) {
    state.map = map;
  },

  setContinents (state, continents) {
    state.continents = continents;
  },

  setDisasterStatus (state, status) {
    state.disasterOngoing = status;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
