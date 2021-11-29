import CONST from '../../CONST';
import { DefaultPlayer } from '../../models/Player';
import { Animation } from '../../models/Animation.js';
import { getEntityDirection, returnShallowMapChunk, findPath } from '../../services/pathfinding';
import { getRandomInt } from '../../services/generateLand';

// initial state
const state = () => ({
  map: [],
  continents: [],
  disasterOngoing: false,
  sprites: [],
  frame: 1,
  players: [],
  monsters: [],
  monsterTurns: [],
  currentTurn: null, // player object
  turnIndex: 0,
  focusedEntity: null,
  isMoving: false,
  isMonsterMoving: false,
  potentialPath: [],
  moveTiles: [], // list of highlighted movement tiles for ease of toggling
  leftOffset: 0,
  topOffset: 0,
})

// getters
const getters = {
  continents: (state) => {
    return state.continents;
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
  frame: (state) => {
    return state.frame;
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
  potentialPath: (state) => {
    return state.potentialPath;
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
    entity.tilesToTravel = path.length;
    entity.path = path;
    state.isMoving = true;
    state.moveTiles.forEach((tile) => {
      state.map[tile.x][tile.y].moveHighlighted = false;
      state.map[tile.x][tile.y].potentialPath = false;
    })
    state.moveTiles = [];
    state.focusedEntity = null;
  },
  updateMove (state) {
    if (state.currentTurn.movingVerticalOffset === 0 && state.currentTurn.movingHorizontalOffset === 0) {
      state.currentTurn.movingDirection = getEntityDirection(state.currentTurn);
      state.currentTurn.animation = new Animation(8, 'Jump', false);
    }
    const moveDirection = state.currentTurn.movingDirection;
    // 1N, 2E, 3S, 4W

    // south
    if (moveDirection === 3) {
      state.currentTurn.movingVerticalOffset += CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingVerticalOffset === 64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingVerticalOffset = 0;
        const lastOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        lastOccupiedTile.players = [];
        state.currentTurn.x = (parseInt(state.currentTurn.x, 10)) + 1;
        const nextOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        nextOccupiedTile.players = [state.currentTurn];
        nextOccupiedTile.event && nextOccupiedTile.event.script();
        state.currentTurn.path.shift();
      }
    }
    // east
    if (moveDirection === 2) {
      state.currentTurn.movingHorizontalOffset += CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingHorizontalOffset === 64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingHorizontalOffset = 0;
        const lastOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        lastOccupiedTile.players = [];
        state.currentTurn.y = (parseInt(state.currentTurn.y, 10) + 1);
        const nextOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        nextOccupiedTile.players = [state.currentTurn];
        nextOccupiedTile.event && nextOccupiedTile.event.script();
        state.currentTurn.path.shift();
      }
    }
    // north
    if (moveDirection === 1) {
      state.currentTurn.movingVerticalOffset -= CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingVerticalOffset === -64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingVerticalOffset = 0;
        const lastOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        lastOccupiedTile.players = [];
        state.currentTurn.x = (parseInt(state.currentTurn.x, 10) - 1);
        const nextOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        nextOccupiedTile.players = [state.currentTurn];
        nextOccupiedTile.event && nextOccupiedTile.event.script();
        state.currentTurn.path.shift();
      }
    }
    // west
    if (moveDirection === 4) {
      state.currentTurn.movingHorizontalOffset -= CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingHorizontalOffset === -64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingHorizontalOffset = 0;
        const lastOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        lastOccupiedTile.players = [];
        state.currentTurn.y = (parseInt(state.currentTurn.y, 10) - 1);
        const nextOccupiedTile = state.map[state.currentTurn.x][state.currentTurn.y];
        nextOccupiedTile.players = [state.currentTurn];
        nextOccupiedTile.event && nextOccupiedTile.event.script();
        state.currentTurn.path.shift();
      }
    }

    if (state.currentTurn.tilesToTravel === 0) {
      state.isMoving = false;
      // TODO: maybe check players whose tilesToTravel is 0?
      state.currentTurn.animation = new Animation(9, 'Idle', true);
    }
  },
  //TODO: Will need a search function for finding all tiles within an MP limit
  toggleMovingTiles (state, tilesToLight) {
    if (state.moveTiles.length) {
      state.moveTiles.forEach((tile) => {
        state.map[tile.x][tile.y].moveHighlighted = false;
      })
      state.moveTiles = [];
    } else {
      state.moveTiles = tilesToLight;
      tilesToLight.forEach((tile) => {
        state.map[tile.x][tile.y].moveHighlighted = true;
      })
    }
  },
  lightPotentialPath(state, path) {
    const moveTiles = [];
    path.forEach((tile) => {
      const realMapTile = state.map[tile.x][tile.y];
      realMapTile.potentialPath = true;
      moveTiles.push(realMapTile);
    });

    state.potentialPath = moveTiles;
  },
  clearPotentialPath(state) {
    state.potentialPath.forEach((tile) => {
      tile.potentialPath = false;
    });

    state.potentialPath = [];
  },
  setfocusedEntity (state, focusedEntity) {
    if (state.focusedEntity && state.focusedEntity.x === focusedEntity.x &&
        state.focusedEntity.y === focusedEntity.y) {
          state.focusedEntity = null;
    } else if (state.isMoving === false){
      state.focusedEntity = focusedEntity;
    }
  },

  updateFrame (state, frame) {
    state.frame = frame;
  },

  addSpritesToAnimate (state, sprites) {
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
  addMonsterToGame (state, monster) {
    state.monsters.push(monster)
    state.map[monster.x][monster.y].monsters.push(monster);
  },

  cycleTurn (state) {

    state.turnIndex = (state.turnIndex + 1);
    state.currentTurn = state.players[state.turnIndex];
  },

  worldTurn (state) {
    state.turnIndex = -1;
    state.currentTurn = CONST.world;
    state.monsterTurns = [ ...state.monsters ];
    state.monsterTurns.forEach((monster) => {
      const areaAroundMonster = returnShallowMapChunk(monster, state.map);
      const cellToTravelTo = areaAroundMonster[getRandomInt(0, areaAroundMonster.length - 1)][getRandomInt(0, areaAroundMonster.length - 1)];
      const path = findPath(areaAroundMonster, {x: monster.x, y: monster.y, mp: monster.mp}, {x: cellToTravelTo.x, y: cellToTravelTo.y});
      monster.path = path;
      monster.tilesToTravel = path.length;
    })
    state.isMonsterMoving = true;
  },

  updateMonsterMove (state) {
    const currentMonster = state.monsterTurns[0];

    if (currentMonster.movingVerticalOffset === 0 && currentMonster.movingHorizontalOffset === 0) {
      currentMonster.movingDirection = getEntityDirection(currentMonster);
      currentMonster.animation = new Animation(8, 'Jump', false);
    }
    const moveDirection = currentMonster.movingDirection;
    // 1N, 2E, 3S, 4W

    // south
    if (moveDirection === 3) {
      currentMonster.movingVerticalOffset += CONST.monsterAnimationPixelBump;
      if (currentMonster.movingVerticalOffset === 64) {
        currentMonster.tilesToTravel -= 1;
        currentMonster.movingVerticalOffset = 0;
        const lastOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        lastOccupiedTile.monsters = [];
        currentMonster.x = (parseInt(currentMonster.x, 10)) + 1;
        const nextOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        nextOccupiedTile.monsters = [currentMonster];
        currentMonster.path.shift();
      }
    }
    // east
    if (moveDirection === 2) {
      currentMonster.movingHorizontalOffset += CONST.monsterAnimationPixelBump;
      if (currentMonster.movingHorizontalOffset === 64) {
        currentMonster.tilesToTravel -= 1;
        currentMonster.movingHorizontalOffset = 0;
        const lastOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        lastOccupiedTile.monsters = [];
        currentMonster.y = (parseInt(currentMonster.y, 10) + 1);
        const nextOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        nextOccupiedTile.monsters = [currentMonster];
        currentMonster.path.shift();
      }
    }
    // north
    if (moveDirection === 1) {
      currentMonster.movingVerticalOffset -= CONST.monsterAnimationPixelBump;
      if (currentMonster.movingVerticalOffset === -64) {
        currentMonster.tilesToTravel -= 1;
        currentMonster.movingVerticalOffset = 0;
        const lastOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        lastOccupiedTile.monsters = [];
        currentMonster.x = (parseInt(currentMonster.x, 10) - 1);
        const nextOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        nextOccupiedTile.monsters = [currentMonster];
        currentMonster.path.shift();
      }
    }
    // west
    if (moveDirection === 4) {
      currentMonster.movingHorizontalOffset -= CONST.monsterAnimationPixelBump;
      if (currentMonster.movingHorizontalOffset === -64) {
        currentMonster.tilesToTravel -= 1;
        currentMonster.movingHorizontalOffset = 0;
        const lastOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        lastOccupiedTile.monsters = [];
        currentMonster.y = (parseInt(currentMonster.y, 10) - 1);
        const nextOccupiedTile = state.map[currentMonster.x][currentMonster.y];
        nextOccupiedTile.monsters = [currentMonster];
        currentMonster.path.shift();
      }
    }

    if (currentMonster.tilesToTravel === 0) {
      currentMonster.animation = new Animation(9, 'Idle', true);
      state.monsterTurns.shift();
      if (state.monsterTurns.length === 0) {
        state.isMonsterMoving = false;
        state.turnIndex = (state.turnIndex + 1);
        state.currentTurn = state.players[state.turnIndex];
      }
    }
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
    // console.log(`map sprites: `, map)
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
