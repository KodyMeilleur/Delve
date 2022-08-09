import CONST from '../../CONST';
import { DefaultPlayer } from '../../models/Player';
import { VoidTile } from '../../models/Tile';
import { returnShallowMapChunk, findPath } from '../../services/pathfinding';
import { getRandomInt, createFilledLandmass } from '../../services/generateLand';
// import SpawnTable from '../../tables/Spawns';
import { Events as PlainsEvents } from '../../models/events/Plains/events';

// initial state
const state = () => ({
  map: [],
  dayCounter: 1,
  continents: [],
  disasterOngoing: false,
  sprites: [],
  players: [],
  monsters: [],
  monsterTurns: [],
  currentTurn: null, // player object
  currentBattleTurn: null,
  turnIndex: 0,
  focusedEntity: null,
  isMoving: false,
  isBattling: false,
  isMonsterTurn: false,
  battlingPlayers: [],
  battleTile: null,
  isMonsterMoving: false,
  moveTiles: [], // list of highlighted movement tiles for ease of toggling
  attackTiles: [], // list of highlighted attack tiles for ease of toggling
  rangeTiles: [],
  leftOffset: 0,
  topOffset: 0,
  logs: [],
  showMoveTiles: false,
  showBattleTiles: false,
  eventCountdown: CONST.eventCountdown,
  emptyTileList: [],
})

// getters
const getters = {
  continents: (state) => {
    return state.continents;
  },
  logs: (state) => {
    return state.logs;
  },
  isBattling: (state) => {
    return state.isBattling;
  },
  battleTile: (state) => {
    return state.battleTile;
  },
  battlingPlayers: (state) => {
    return state.battlingPlayers;
  },
  isMonsterTurn: (state) => {
    return state.isMonsterTurn;
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
  currentBattleTurn: (state) => {
    return state.currentBattleTurn;
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
  attackTiles: (state) => {
    return state.attackTiles;
  },
  rangeTiles: (state) => {
    return state.rangeTiles;
  },
  showMoveTiles: (state) => {
    return state.showMoveTiles;
  },
  showBattleTiles: (state) => {
    return state.showBattleTiles;
  },
  eventCountdown: (state) => {
    return state.eventCountdown;
  },
  emptyTileList: (state) => {
    return state.emptyTileList;
  },
  dayCounter: (state) => {
    return state.dayCounter;
  }
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
  setIsBattling (state, data) {
    if (data.state === true) {
      state.battleTile = data.battleTile;
      state.isBattling = data.state;
    } else {
      state.isBattling = false;
      state.currentTurn.isBattling = false;
    }
  },
  togglePlayerShop (state, {player, status}) {
    player.inShop = status;
  },
  sellPlayerItem (state, {player, merch}) {
    const inventory = player.items;
    let itemIndex;

    const itemInInventory = inventory.filter((item, index) => {
      if (item.name === merch.name) {
        itemIndex = index;
        return true;
      }
      return item.name === merch.name;
    })[0];

    itemInInventory.quantity -= 1;

    if (itemInInventory.quantity <= 0) {
      inventory.splice(itemIndex, 1);
    }

    player.coin += merch.averageCost;
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
      state.moveTiles = [];
    } else {
      state.moveTiles = tilesToLight.map((tile) => {
        return {x: tile.x, y: tile.y}
      });
      state.showMoveTiles = true;
    }
  },

  toggleAttackRangeTiles (state, tilesToLight) {
    if (!tilesToLight) {
      state.attackTiles = [];
      state.showBattleTiles = false;
    } else {
      state.attackTiles = tilesToLight.map((tile) => {return {x: tile.x, y: tile.y}});
      state.showBattleTiles = true;
    }
  },

  toggleProjectileTiles(state, tilesToLight) {
    if (!tilesToLight) {
      state.rangeTiles = [];
      state.showBattleTiles = false;
    } else {
      state.rangeTiles = tilesToLight.map((tile) => {return {x: tile.x, y: tile.y}});
      state.showBattleTiles = true;
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

  setPlayerBattleStatus (state, { players }) {
    players.forEach((player, i) => {
      player.isBattling = true;
      player.battleX = 2 + i;
      player.battleY = 2;
      player.movingDirection = 2;
      state.battlingPlayers.push(player);
    });
  },

  refreshPlayer (state, player) {
    player.movement = player.maxMovement;
    player.ap = player.maxAp;
    player.heldMana = {
      'RED': 0,
      'BLUE': 0,
      'GREEN': 0,
      'WHITE': 0,
      'BLACK': 0,
      'PURPLE': 0,
      'NEUTRAL': 0
    };
  },

  cycleBattleTurn (state, ownedTiles) {
    state.currentBattleTurn.roundFinished = true;

    state.currentBattleTurn.ap = state.currentBattleTurn.maxAp;
    state.currentBattleTurn.heldMana[state.currentBattleTurn.discipline] += 1;

    function nextPlayer(player) {
      return player.roundFinished === false;
    }
    // isMonsterTurn
    const next = state.battlingPlayers.find(nextPlayer);
    if (next) {
      state.currentBattleTurn = next;
      ownedTiles.forEach((tile) => {
        tile.showManaCollect = true;
        if (tile.manaValueSlotOne) {
          next.heldMana[tile.manaTypeSlotOne] += tile.manaValueSlotOne;
        }
        if (tile.manaValueSlotTwo) {
          next.heldMana[tile.manaTypeSlotTwo] += tile.manaValueSlotTwo;
        }
      });
    } else {
      state.isMonsterTurn = true;
      state.battlingPlayers.forEach((player) => {
        player.roundFinished = false;
      });
    }
  },

  endMonsterTurn (state, ownedTiles) {
    state.isMonsterTurn = false;

    function nextPlayer(player) {
      return player.roundFinished === false;
    }
    // isMonsterTurn
    const next = state.battlingPlayers.find(nextPlayer);

    ownedTiles.forEach((tile) => {
      tile.showManaCollect = true;
      if (tile.manaValueSlotOne) {
        next.heldMana[tile.manaTypeSlotOne] += tile.manaValueSlotOne;
      }
      if (tile.manaValueSlotTwo) {
        next.heldMana[tile.manaTypeSlotTwo] += tile.manaValueSlotTwo;
      }
    });

    state.currentBattleTurn = next;
  },

  setCurrentBattleTurn (state, player) {
    state.currentBattleTurn = player;
  },

  clearFocusedEntity (state) {
    state.focusedEntity = null;
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

  setinWorldPlayerTile(state, { player, tile}) {
    player.inworldTileOccupied = tile;
  },

  setPlayerDevotion (state, color) {
    state.currentTurn.discipline = color;
  },

  applySkillEffectsOnPlayer(state, { player, skill}) {
    const storePlayer = state.players.filter(ent => ent == player)[0];
    if (skill.costType === 'ap') {
      storePlayer[skill.costType] -= skill.costSlotOne;
    } else if (skill.costType === 'mp') {
      if (skill.costSlotOne) {
        player.heldMana[skill.type] -= skill.costSlotOne;
      }
      if (skill.costSlotTwo) {
        player.heldMana[skill.typeTwo] -= skill.costSlotTwo;
      }
    }
  },

  updatePlayerPosition (state, { player, coords, isBattling, map}) {
    const storePlayer = state.players.filter(ent => ent == player)[0];

    if (isBattling) {
      storePlayer.battleX =  parseInt(coords.x);
      storePlayer.battleY = parseInt(coords.y);
    } else {
      storePlayer.x =  parseInt(coords.x);
      storePlayer.y = parseInt(coords.y);
    }
    const tileMovingTo = map[coords.x][coords.y];
    if (isBattling) {
      storePlayer.inworldTileOccupied.density = 0;
      storePlayer.inworldTileOccupied = tileMovingTo;
      tileMovingTo.density = 1;
    } else {
      storePlayer.outworldTileOccupied = tileMovingTo;
    }

    if (!isBattling && coords.tilesToTravel === 0) {
      state.focusedEntity = storePlayer.outworldTileOccupied;
    }
  },

  addItemsToInventory (state, {items, player}) {
    const indexList = [];
    const currentInventory = player.items;
    items.filter((lootItem, index) => {
      const itemFilter = currentInventory.filter((item) => {
        const has = lootItem.name === item.name || lootItem.name === 'Coin';
        if (has) {
          indexList.push({index, item, lootItem});
        }
        return has;
      })
      if (currentInventory.length === 0 && lootItem.name === 'Coin') {
        indexList.push({index, lootItem});
      }

      return itemFilter.length;
    })

    if (indexList.length) {
      indexList.forEach((merger, index) => {
        if (merger.lootItem.name === 'Coin') {
          player.coin = (player.coin + merger.lootItem.quantity);
        } else {
          merger.item.quantity += merger.lootItem.quantity;
        }
        items.splice((merger.index - index), 1);
      })
    }
    player.items = currentInventory.concat(items);
  },

  cycleTurn (state) {
    state.turnIndex = (state.turnIndex + 1);
    state.currentTurn = state.players[state.turnIndex];
    state.currentTurn.movement = state.currentTurn.maxMovement;
    state.showMoveTiles = false;
    state.focusedEntity = null;
  },

  worldTurn (state) {
    state.showMoveTiles = false;
    state.focusedEntity = null;
    state.turnIndex = -1;

    // SET UP PATHS for every manifested monster
    state.monsters.forEach((monster) => {
      const areaAroundMonster = returnShallowMapChunk(monster, state.map);
      const cellToTravelTo = areaAroundMonster[getRandomInt(0, areaAroundMonster.length - 1)][getRandomInt(0, areaAroundMonster.length - 1)];
      const path = findPath(areaAroundMonster, {x: monster.x, y: monster.y, movement: monster.movement}, {x: cellToTravelTo.x, y: cellToTravelTo.y});
      monster.path = path;
    });

    state.eventCountdown--;

    // EVENT SPAWN LOGIC
    if (state.eventCountdown <= 0) {
      const eventChance = getRandomInt(0, 100);
      const negativeTurnChance = (Math.abs(state.eventCountdown) * 10);
      if (eventChance <= CONST.eventPercentProbability + negativeTurnChance) {
        const eventMap = {
          1: 'structural',
          2: 'effect',
          3: 'choice'
        };
        const eventTableMap = {
          'Plains': PlainsEvents
        };
        const eventTile = state.emptyTileList[getRandomInt(0, state.emptyTileList.length - 1)];
        const nextEventType = eventMap[getRandomInt(1, 3)];
        const nextEventTable = eventTableMap[eventTile.type];
        const nextEventPool = nextEventTable[nextEventType];

        const nextEvent = nextEventPool[getRandomInt(0, nextEventPool.length - 1)];

        console.log('spawn event ', nextEventType, eventTile, nextEvent);
        if (nextEventType === 'structural') {
          console.log('structure');
        } else {
          state.logs.push(`Something strange is happening around (${eventTile.x}, ${eventTile.y})!`)
          state.map[eventTile.x][eventTile.y].event = nextEvent;
        }

        state.eventCountdown = CONST.eventCountdown;
      }
    }
    state.dayCounter++;
    state.currentTurn = CONST.world;
  },

  mergeFirstLandmass (state, {landmass, name}) {
    // clear sprites on first land generation
    let map = createFilledLandmass(CONST.defaultRowAndColumnCount, CONST.defaultRowAndColumnCount, VoidTile);
    const landmassPotentialRowSize = CONST.normalRowSize;
    const landmassPotentialColumnSize = CONST.normalColumnSize;
    const boardSize = CONST.defaultRowAndColumnCount;
    const structures = [];
    // LIST OF VALID TILES FOR EVENTS
    const emptyTileList = [];

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
         } else if (landmass[i][k].type !== 'Void') {
           emptyTileList.push({
             type: name,
             x: startingCellX + i,
             y: startingCellY + k
           })
         }
       }
    }

    state.map = map;
    state.continents.push({
      name,
      structures
    });
    state.emptyTileList = emptyTileList;
  },

  setContinents (state, continents) {
    state.continents = continents;
  },

  unchargeTile (state, tile) {
    tile.itemCharged = false;
    tile.moneycharged = false;
  },

  addMoneyToPlayer (state, {player, count}) {
    player.coin += count;
  },

  subtractMoneyFromPlayer (state, {player, count}) {
    player.coin -= count;
  },

  setStructureExplored (state, tile) {
    if (tile.structure) {
      tile.structure.explored = true;
    }
  },

  demolishStructure (state, structure) {
     structure.demolished = true;
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
