import CONST from '../../CONST';
import { DefaultPlayer } from '../../models/Player';
import { Animation } from '../../models/Animation.js';

// initial state
const state = () => ({
  map: [],
  continents: [],
  disasterOngoing: false,
  sprites: [],
  frame: 1,
  players: [],
  monsters: [],
  currentTurn: null, // player object
  turnIndex: 0,
  focusedEntity: null,
  isMoving: false,
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
  isMoving: (state) => {
    return state.isMoving;
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
  setScroll (state, { scrollLeft, scrollTop}) {
    state.leftOffset = scrollLeft;
    state.topOffset = scrollTop;
  },
  setMap (state, map) {
    state.map = map;
  },
  moveToTile (state, tile) {
    // determine direction to move in
    // 1,2,3,4 for directions, 0 non moving
    // 1N, 2E, 3S, 4W
    // determine number of tiles to move
    // 16px per tick, 1 sec moves a full tile and shows 4 frames?
    const moveToX = tile.x;
    const moveToY = tile.y;

    const moveUp = moveToX < state.currentTurn.x ? 1 : null;
    const moveDown = moveToX > state.currentTurn.x ? 3 : null;
    const moveRight = moveToY > state.currentTurn.y ? 2 : null;
    const moveLeft = moveToY < state.currentTurn.y ? 4 : null;

    const moveDirection = moveUp || moveDown || moveRight || moveLeft;

    let tilesToMove;
    if (moveDirection === 1) {
      tilesToMove = state.currentTurn.x - moveToX;
    }
    if (moveDirection === 2) {
      tilesToMove = moveToY - state.currentTurn.y;
    }
    if (moveDirection === 3) {
      tilesToMove = moveToX - state.currentTurn.x;
    }
    if (moveDirection === 4) {
      tilesToMove = state.currentTurn.y - moveToY;
    }

    state.isMoving = true;
    state.currentTurn.movingDirection = moveDirection;
    state.currentTurn.tilesToTravel = tilesToMove;
    if (state.moveTiles.length) {
      state.moveTiles.forEach((tile) => {
        tile.moveHighlighted = false;
      })
      state.moveTiles = [];
    }
    state.focusedEntity = null;
    state.currentTurn.animation = new Animation(8, 'Jump', true);
  },
  updateMove (state) {
    const moveDirection = state.currentTurn.movingDirection;
    if (moveDirection === 3) {
      state.currentTurn.movingVerticalOffset += CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingVerticalOffset === 64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingVerticalOffset = 0;
        state.currentTurn.x = (parseInt(state.currentTurn.x, 10)) + 1;
      }
    }
    if (moveDirection === 2) {
      state.currentTurn.movingHorizontalOffset += CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingHorizontalOffset === 64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingHorizontalOffset = 0;
        state.currentTurn.y = (parseInt(state.currentTurn.y, 10) + 1);
      }
    }
    if (moveDirection === 1) {
      state.currentTurn.movingVerticalOffset -= CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingVerticalOffset === -64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingVerticalOffset = 0;
        state.currentTurn.x = (parseInt(state.currentTurn.x, 10) - 1);
      }
    }
    if (moveDirection === 4) {
      state.currentTurn.movingHorizontalOffset -= CONST.moveAnimationPixelBump;
      if (state.currentTurn.movingHorizontalOffset === -64) {
        state.currentTurn.tilesToTravel -= 1;
        state.currentTurn.movingHorizontalOffset = 0;
        state.currentTurn.y = (parseInt(state.currentTurn.y, 10) - 1);
      }
    }

    if (state.currentTurn.tilesToTravel === 0) {
      state.isMoving = false;
      // TODO: maybe check players whose tilesToTravel is 0?
      state.currentTurn.animation = new Animation(1, 'Idle', true);
    }
  },
  updatePlayerAnimations (state) {
    const players = state.players;
    players.forEach((player) => {
      let animation = player.animation;
      if (animation.skipFrames.length &&
          animation.currentFrame === animation.skipFrames[0]) {
        animation.skipFrames.shift();
      } else {
        player.animation.currentFrame += 1;
      }
      if (animation.currentFrame >= animation.maxNumberOfFrames) {
        if (animation.shouldLoop === true) {
          player.animation.currentFrame = 0;
          player.animation.refreshSkipFrames();
        } else {
          player.animation = new Animation(1, 'Idle', true);
        }
      }
    });
  },
  toggleMovingTiles (state) {
    if (state.moveTiles.length) {
      state.moveTiles.forEach((tile) => {
        tile.moveHighlighted = false;
      })
      state.moveTiles = [];
    } else {
      // highlight x tiles from focusedEntity based on density
      for (let i= 1; i <= state.focusedEntity.mp; i++) {
        const entityX = parseInt(state.focusedEntity.x, 10);
        const entityY = parseInt(state.focusedEntity.y, 10);

        // check north
        const northTile = state.map[entityX - i] && state.map[entityX - i][entityY];
        if (northTile && northTile.density == 0) {
          northTile.moveHighlighted = true;
          state.moveTiles.push(northTile);
        }
        // check east
        const eastTile = state.map[entityX][entityY + i];
        if (eastTile && eastTile.density == 0) {
          eastTile.moveHighlighted = true;
          state.moveTiles.push(eastTile);
        }
        // check south
        const southTile = state.map[entityX + i] && state.map[entityX + i][entityY];
        if (southTile && southTile.density == 0) {
          southTile.moveHighlighted = true;
          state.moveTiles.push(southTile);
        }
        // check west
        const westTile = state.map[entityX][entityY - i];
        if (westTile && westTile.density == 0) {
          westTile.moveHighlighted = true;
          state.moveTiles.push(westTile);
        }
      }
    }
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
  addMonsterToGame (state, monster) {
    state.monsters.push(monster)
    state.map[monster.x][monster.y].monsters.push(monster);
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
