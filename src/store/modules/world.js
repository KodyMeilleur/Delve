import CONST from '../../CONST';
import { DefaultPlayer } from '../../models/Player';

// initial state
const state = () => ({
  map: [],
  continents: [],
  disasterOngoing: false,
  sprites: [],
  frame: 1,
  players: [],
  currentTurn: null, // player object
  turnIndex: 0,
})

// getters
const getters = {
  continents: (state) => {
    return state.continents;
  },
  map: (state) => {
    return state.map;
  },
  sprites: (state) => {
    return state.sprites;
  },
  frame: (state) => {
    return state.frame;
  },
  players: (state) => {
    return state.players;
  },
  currentTurn: (state) => {
    return state.currentTurn;
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

  updateFrame (state, frame) {
    state.frame = frame;
  },

  addSpritesToAnimate (state, sprites) {
    console.log([...sprites])
    state.sprites = state.sprites.concat([...sprites]);
  },

  addNewPlayerToGame (state, pc) {
    const newPlayer = new DefaultPlayer(pc.name, pc.x, pc.y);
    if (state.players.length === 0) {
      state.currentTurn = newPlayer;
    }
    state.players.push(newPlayer)
    state.map[pc.x][pc.y].players.push(newPlayer);
  },

  cycleTurn (state) {
    const playerArrayLength = state.players.length - 1; // minus 1 for array position
    if (state.turnIndex + 1 > playerArrayLength) {
      state.turnIndex = 0;
    } else {
      state.turnIndex = (state.turnIndex + 1);
    }

    state.currentTurn = state.players[state.turnIndex];
  },

  mergeFirstLandmass (state, landmass) {
    // clear sprites on first land generation
    state.sprites = [];
    let map = state.map;
    const landmassPotentialRowSize = CONST.normalRowSize;
    const landmassPotentialColumnSize = CONST.normalColumnSize;
    const boardSize = CONST.defaultRowAndColumnCount;

    const startingCellX = (boardSize / 2) - (landmassPotentialRowSize / 2);
    const startingCellY = (boardSize / 2) - (landmassPotentialColumnSize / 2);

    for (let i = 0; i <= (landmassPotentialRowSize - 1); i++) { // array position
       for (let k = 0; k <= (landmassPotentialColumnSize - 1); k++) {
         landmass[i][k].x = startingCellX + i;
         landmass[i][k].y = startingCellY + k;
         map[startingCellX + i][startingCellY + k] = landmass[i][k];
       }
    }

    // console.log(state.map)
    state.map = []; // TODO: Find a better way to set arrays in data store. Maybe an action and then a mutation?
    state.map = map;
    console.log(`map sprites: `, map)
    state.sprites = state.sprites.concat(map);

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
