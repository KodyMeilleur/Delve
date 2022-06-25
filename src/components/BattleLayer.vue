<template>
  <div
  v-if="isBattling"
  class="battlemass">
    <div class="in-world">
      <div class="battle-border">
        <!-- Wall Borders -->
        <div class="north-border">
          <div
          v-for="index in 10"
          :key="index + 'north'"
          class="north-wall-item"
          v-bind:style="{
            'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/sheet0' +'.png)',
          }"
          ></div>
        </div>
        <div class="west-border">
          <div
          v-for="index in 4"
          :key="index + 'west'"
          class="west-wall-item"
          v-bind:style="{
            'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/sheet1' +'.png)',
          }"
          >
            <div
            :key="index + 'west-barrier'"
            class="west-wall-barrier"
            v-bind:class="{ 'left-align': (index % 2) === 0, 'right-align': (index % 2) !== 0}"
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/leftMainWallSheet1' +'.png)',
            }"
            >
            </div>
            <div
            :key="index + 'west-barrier-small'"
            class="west-small-wall-barrier"
            v-bind:class="{ 'left-align': ((index % 2) !== 0), 'right-align': ((index % 2) === 0)}"
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/leftSmallWallSheet1' +'.png)',
            }"
            >
            </div>
          </div>
        </div>
        <div class="east-border">
          <div
          v-for="index in 4"
          :key="index + 'east'"
          class="east-wall-item"
          v-bind:style="{
            'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/sheet2' +'.png)',
          }"
          >
            <div
            :key="index + 'east-barrier'"
            class="east-wall-barrier"
            v-bind:class="{ 'left-align': (index % 2) === 0, 'right-align': (index % 2) !== 0}"
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/rightMainWallSheet1' +'.png)',
            }"
            >
            </div>
            <div
            :key="index + 'east-barrier-small'"
            class="east-small-wall-barrier"
            v-bind:class="{ 'left-align': ((index % 2) !== 0), 'right-align': ((index % 2) === 0)}"
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/rightSmallWallSheet1' +'.png)',
            }"
            >
            </div>
          </div>
        </div>
        <div class="battle-container">
          <div class="battle-entity-layer">
            <Player v-for="player in players" v-bind:key="player.name" :player="player" :battleMap="currentMap"/>
            <Monster v-for="enemy in enemies" v-bind:key="enemy.id" :monster="enemy" v-on:turnEnded="nextMonsterTurn"/>
          </div>
          <TileLayer :currentMap="currentMap" :map="currentMap" :shouldShow="isBattling"/>
        </div>
      </div>
    </div>
    <div class="battle-controls">
      <BattleHeader :title="isMonsterTurn ? currentMonsterTurn.name : currentBattleTurnEntity && currentBattleTurnEntity.name"/>
      <BattleControls :entity="currentBattleTurnEntity" v-on:cycleBattleTurn="cyclePlayerTurn"/>
    </div>
  </div>
</template>

<script>
import CONST from '../CONST';
// import Tile from './Tile.vue';
import { mapGetters, mapMutations } from 'vuex';
import { createBattleField, createEnemies } from '../models/combatFields/combatFields';
import BattleControls from './BattleControls.vue';
import BattleHeader from './BattleHeader.vue';
import Player from './Player.vue';
import Monster from './Monster.vue';
import TileLayer from './TileLayer.vue';

export default {
  name: 'BattleLayer',
  props: {
    // map: Array
  },
  components: {
    // Tile,
    BattleControls,
    BattleHeader,
    Player,
    Monster,
    TileLayer
  },
  data () {
    return {
      CONST: CONST,
      publicPath: process.env.BASE_URL,
      enemies: [],
      potentialPath: [],
      currentMap: [],
      currentBattleTurnID: null,
      currentBattleTurnEntity: null,
      currentMonsterTurn: null,
      players: [],
      totalMonsterCount: 0,
      monsterTurnMap: {},
    }
  },
  updated () {
    console.log('BattleLayer render...');
  },
  computed: {
    ...mapGetters('world', [
      'isBattling',
      'battleTile',
      'currentTurn',
      'isMonsterTurn',
      'currentBattleTurn'
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setCurrentBattleTurn',
      'setinWorldPlayerTile',
      'setPlayerBattleStatus',
      'cycleBattleTurn',
      'endMonsterTurn'
    ]),
    updatePotentialPath (path) {
      this.potentialPath = path;
      this.$emit('updateTilePaths', this.potentialPath);
    },
    clearPotentialPath () {
      this.potentialPath = [];
      this.$emit('updateTilePaths', this.potentialPath);
    },
    compareSpeed(a, b) {
      if ( a.speed < b.speed) {

        return -1;
      }
      if ( a.speed > b.speed) {

        return 1;
      }

      return 0;
    },
    cyclePlayerTurn() {
      const ownedTiles = [];

      this.currentMap.forEach((row) => {
        row.forEach((cell) => {
          if (cell.manaOwnerId === this.currentBattleTurn.id) {
            ownedTiles.push(cell);
          }
        });
      });

      this.cycleBattleTurn(ownedTiles);

      if (this.isMonsterTurn) {
        console.log('end of all player turns');
      } else {
        console.log('do player gains?');

        let manaGains = {
          RED: 0,
          BLUE: 0,
          GREEN: 0,
          BLACK: 0,
          WHITE: 0,
          PURPLE: 0,
        };

        manaGains[this.currentBattleTurn.discipline] +=1;

        ownedTiles.forEach((cell) => {
          if (cell.manaOwnerId === this.currentBattleTurn.id) {
            cell.showManaCollect = true;
            if (cell.manaValueSlotOne) {
              manaGains[cell.manaTypeSlotOne] += cell.manaValueSlotOne;
            }
            if (cell.manaValueSlotTwo) {
              manaGains[cell.manaTypeSlotTwo] += cell.manaValueSlotTwo;
            }
          }
        });

        this.endMonsterTurn(ownedTiles);
        this.$root.$emit('manaGain', manaGains);
      }
    },
    nextMonsterTurn() {
      const nextEnemyToGo = this.enemies.find((enemy) => {
        return enemy.roundFinished === false;
      });
      if (nextEnemyToGo) {
        nextEnemyToGo.roundFinished = true;
        nextEnemyToGo.activeBattleTurn = true;
        this.currentMonsterTurn = nextEnemyToGo;
      } else {
        this.enemies.forEach((enemy) => {
          enemy.roundFinished = false;
          enemy.activeBattleTurn = false;
        });
        console.log('All monster turns over!');
        const ownedTiles = [];

        let manaGains = {
          RED: 0,
          BLUE: 0,
          GREEN: 0,
          BLACK: 0,
          WHITE: 0,
          PURPLE: 0,
        };

        manaGains[this.currentBattleTurnEntity.discipline] +=1;

        this.currentMap.forEach((row) => {
          row.forEach((cell) => {
            if (cell.manaOwnerId) {
              ownedTiles.push(cell);
              cell.showManaCollect = true;
              if (cell.manaValueSlotOne) {
                manaGains[cell.manaTypeSlotOne] += cell.manaValueSlotOne;
              }
              if (cell.manaValueSlotTwo) {
                manaGains[cell.manaTypeSlotTwo] += cell.manaValueSlotTwo;
              }
            }
          });
        });
        this.endMonsterTurn(ownedTiles);
        this.$root.$emit('manaGain', manaGains);
      }
    }
  },
  watch: {
    isBattling: function (val) {
      if (val) {
        this.setPlayerBattleStatus({
          players: [this.currentTurn]
        });
        // GENERATE MAP AND ENEMIES FROM TILE
        const generatedMap = createBattleField(this.battleTile);
        const enemies = createEnemies(this.battleTile, generatedMap);

        const that = this;
        this.players.push(this.currentTurn);
        this.players.forEach((player) => {
          that.setinWorldPlayerTile({player, tile: generatedMap[player.battleX][player.battleY]});
        });

        this.enemies = this.enemies.concat(enemies);

        this.currentBattleTurnID = this.currentTurn.id;
        this.currentBattleTurnEntity = this.currentTurn;
        this.setCurrentBattleTurn(this.currentTurn);

        this.currentMap = generatedMap;
      }
    },
    'enemies.length': {
      handler (newVal) {
        this.totalMonsterCount = newVal;
      },
      deep: true
    },
    isMonsterTurn: function (val) {
      if (val === true) {
        console.log('monster turns starting!');
        this.monsterTurnMap = {};
        this.enemies.sort(this.compareSpeed);
        this.nextMonsterTurn();
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.row {
  display: inline-flex;
  height: 64px;
}
.battle-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 64px;
}
.north-border {
  width: 100%;
  height: 64px;
  position: absolute;
  display: flex;
  top: 0;
  left: 128px;
}
.north-wall-item {
  width: 64px;
  height: 64px;
}
.left-align {
  left: -15px;
}
.right-align {
  right: -15px;
}
.west-border {
  width: 128px;
  height: 512px;
  position: absolute;
  display: flex;
  top: -64px;
  left: 1px;
  flex-direction: column;
}
.west-wall-barrier, .east-wall-barrier {
  width: 128px;
  height: 128px;
  z-index: 6;
  position: absolute;
}
.east-small-wall-barrier, .west-small-wall-barrier {
  width: 64px;
  height: 128px;
  position: absolute;
  z-index: 5;
  top: -50px;
}
.west-wall-item, .east-wall-item {
  width: 128px;
  height: 128px;
  position: relative;
}
.east-border {
  width: 128px;
  height: 512px;
  position: absolute;
  display: flex;
  top: -64px;
  right: 1px;
  flex-direction: column;
}
.battle-entity-layer {
  position: absolute;
  left: 128px;
  z-index: 2;
}
.battlemass {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}
</style>
