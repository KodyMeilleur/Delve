import CONST from '../../CONST';
import { DefaultPlayer } from '../../models/Player';
import { VoidTile } from '../../models/Tile';
import { returnShallowMapChunk, findPath } from '../../services/pathfinding';
import { getRandomInt, listOfEmptyNearTiles, createFilledLandmass } from '../../services/generateLand';
import SpawnTable from '../../tables/Spawns';

// initial state
const state = () => ({
  map: [],
  continents: [],
  disasterOngoing: false,
  sprites: [],
  players: [],
  monsters: [],
  monsterTurns: [],
  currentTurn: null, // player object
  turnIndex: 0,
  focusedEntity: null,
  isMoving: false,
  isMonsterMoving: false,
  moveTiles: [], // list of highlighted movement tiles for ease of toggling
  leftOffset: 0,
  topOffset: 0,
  heroSpawnCountdown: CONST.heroSpawnCountdown,
  logs: [],
  showMoveTiles: false,
})

// getters
const getters = {
  continents: (state) => {
    return state.continents;
  },
  logs: (state) => {
    return state.logs;
  },
  map: (state) => {
    return state.map;
  },
  leftOffset: (state) => {
    return state.leftOffset;
  },
  topOffset: (state) => {
    return state.topOffset;
  },
  sprites: (state) => {
    return state.sprites;
  },
  players: (state) => {
    return state.players;
  },
  monsters: (state) => {
    return state.monsters;
  },
  currentTurn: (state) => {
    return state.currentTurn;
  },
  focusedEntity: (state) => {
    return state.focusedEntity;
  },
  canMove: (state) => {
    return state.focusedEntity && state.currentTurn.id === state.focusedEntity.id;
  },
  isMoving: (state) => {
    return state.isMoving;
  },
  isMonsterMoving: (state) => {
    return state.isMonsterMoving;
  },
  moveTiles: (state) => {
    return state.moveTiles;
  },
  showMoveTiles: (state) => {
    return state.showMoveTiles;
  },
}

// actions
const actions = {
  addContinent ({ commit, state }, continent) {
    const savedContinents = [...state.continents]
    savedContinents.push(continent);

    commit('setContinents', savedContinents);
  },
  cycleTurn ({ commit, state }) {
    const playerArrayLength = state.players.length - 1; // minus 1 for array position

    if (state.turnIndex + 1 > playerArrayLength) {
      // commit world turn mutation, set turnIndex to -1
      commit('worldTurn');
    } else {

      commit('cycleTurn');
    }
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
  setScroll (state, { scrollLeft, scrollTop }) {
    state.leftOffset = scrollLeft;
    state.topOffset = scrollTop;
  },
  setMap (state, map) {
    state.map = map;
  },
  setPath(state, { entity, path }) {
    entity.path = path;
    state.showMoveTiles = false;
    state.focusedEntity = null;
  },
  //TODO: Will need a search function for finding all tiles within an MP limit
  toggleMovingTiles (state, tilesToLight) {
    if (!tilesToLight) {
      state.showMoveTiles = false;
    } else {
      state.moveTiles = tilesToLight.map((tile) => {return {x: tile.x, y: tile.y}});
      state.showMoveTiles = true;
    }
  },

  setfocusedEntity (state, focusedEntity) {
    if (state.focusedEntity && state.focusedEntity.x === focusedEntity.x &&
        state.focusedEntity.y === focusedEntity.y) {
          state.focusedEntity = null;
    } else if (state.isMoving === false) {
      state.focusedEntity = focusedEntity;
    }
  },

  setfocusedEntityOverride (state, focusedEntity) {
    state.focusedEntity = focusedEntity;
  },

  focusPlayer (state) {
    state.focusedEntity = state.currentTurn;
  },

  addNewPlayerToGame (state, pc) {
    const newPlayer = new DefaultPlayer(pc.name, pc.x, pc.y);
    if (state.players.length === 0) {
      state.currentTurn = newPlayer;
    }
    state.players.push(newPlayer)
    state.map[pc.x][pc.y].players.push(newPlayer);
    const tileMovingTo = state.map[pc.x][pc.y];
    newPlayer.outworldTileOccupied = tileMovingTo;
  },

  addMonsterToGame (state, monster) {
    state.monsters.push(monster);
    state.map[monster.x][monster.y].monsters.push(monster);
  },

  updateMonsterPosition (state, { monster, coords}) {
    const storeMonster = state.monsters.filter(ent => ent == monster)[0];
    storeMonster.x = parseInt(coords.x);
    storeMonster.y = parseInt(coords.y);
  },

  updateLogs (state, logString) {
    state.logs.push(logString);
  },

  updatePlayerPosition (state, { player, coords}) {
    const storePlayer = state.players.filter(ent => ent == player)[0];
    storePlayer.x = parseInt(coords.x);
    storePlayer.y = parseInt(coords.y);
    const tileMovingTo = state.map[coords.x][coords.y];
    storePlayer.outworldTileOccupied = tileMovingTo;
    if (coords.tilesToTravel === 0) {
      state.focusedEntity = storePlayer.outworldTileOccupied;
    }
    // console.log(storePlayer, coords, tileMovingTo);
  },

  addItemsToInventory (state, items) {
    const indexList = [];
    const currentInventory = state.currentTurn.items;
    currentInventory.filter((item) => {
      const itemFilter = items.filter((lootItem, index) => {
        const has = lootItem.name === item.name;
        if (has) {
          indexList.push({index, item, lootItem});
        }
        return has;
      })

      return itemFilter.length;
    })
    if (indexList.length) {
      indexList.forEach((merger) => {
        merger.item.quantity += merger.lootItem.quantity;
        items.splice(merger.index, 1);
      })
    }
    state.currentTurn.items = currentInventory.concat(items);
  },

  cycleTurn (state) {
    state.turnIndex = (state.turnIndex + 1);
    state.currentTurn = state.players[state.turnIndex];
    state.currentTurn.mp = state.currentTurn.maxMp;
  },

  worldTurn (state) {
    state.turnIndex = -1;

    // Set up paths for every manifested monster
    state.monsters.forEach((monster) => {
      const areaAroundMonster = returnShallowMapChunk(monster, state.map);
      const cellToTravelTo = areaAroundMonster[getRandomInt(0, areaAroundMonster.length - 1)][getRandomInt(0, areaAroundMonster.length - 1)];
      const path = findPath(areaAroundMonster, {x: monster.x, y: monster.y, mp: monster.mp}, {x: cellToTravelTo.x, y: cellToTravelTo.y});
      monster.path = path;
    });

    state.heroSpawnCountdown--;

    if (state.heroSpawnCountdown <= 0) {
      const allStructures = state.continents[0].structures;
      const randomStructure = allStructures[getRandomInt(0, allStructures.length - 1)];
      state.heroSpawnCountdown = CONST.heroSpawnCountdown;
      const tilesToPickFrom = listOfEmptyNearTiles(state.map, randomStructure.x, randomStructure.y);

      const spawnTile = tilesToPickFrom[getRandomInt(0, tilesToPickFrom.length - 1)];

      // 0 HARDCODED FOR SKELETON
      const monster = new SpawnTable['Plains'][randomStructure.type][0](spawnTile.x, spawnTile.y);
      state.monsters.push(monster);
      state.map[monster.x][monster.y].monsters.push(monster);
      state.logs.push(`A new ${monster.type} hope has been born!`);

    }
    state.currentTurn = CONST.world;
  },

  mergeFirstLandmass (state, {landmass, name}) {
    // clear sprites on first land generation
    let map = createFilledLandmass(CONST.defaultRowAndColumnCount, CONST.defaultRowAndColumnCount, VoidTile);
    const landmassPotentialRowSize = CONST.normalRowSize;
    const landmassPotentialColumnSize = CONST.normalColumnSize;
    const boardSize = CONST.defaultRowAndColumnCount;
    const structures = [];

    const startingCellX = (boardSize / 2) - (landmassPotentialRowSize / 2);
    const startingCellY = (boardSize / 2) - (landmassPotentialColumnSize / 2);

    for (let i = 0; i <= (landmassPotentialRowSize - 1); i++) { // array position
       for (let k = 0; k <= (landmassPotentialColumnSize - 1); k++) {
         landmass[i][k].x = startingCellX + i;
         landmass[i][k].y = startingCellY + k;
         map[startingCellX + i][startingCellY + k] = landmass[i][k];
         if (landmass[i][k].structure) {
           structures.push({
             type: landmass[i][k].structure.type,
             x: startingCellX + i,
             y: startingCellY + k
           })
         }
       }
    }

    // console.log(state.map)
    state.map = map;
    state.continents.push({
      name,
      structures
    });
  },

  setContinents (state, continents) {
    state.continents = continents;
  },

  setStructureExplored (state, tile) {
    if (tile.structure) {
      tile.structure.explored = true;
    }
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
