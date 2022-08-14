<template>
  <div
  v-if="isBattling"
  class="battlemass">
    <span
    v-if="toggleEndMenu"
    class="end-battle-menu">
      <button v-on:click="endBattle">Leave</button>
    </span>
    <div
    v-bind:class="{
      'in-world': true,
      shaking,
    }"
    >
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
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/leftMainWallSheet' + ((index % 2) + 1) +'.gif)',
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
            <div
            :key="index + 'side-effect-small'"
            class="side-effect"
            v-bind:class="{ 'right-align-small': ((index % 2) !== 0), 'left-align-small': ((index % 2) === 0)}"
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/sideEffect1' +'.png)',
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
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/rightMainWallSheet' + ((index % 2) + 1) +'.gif)',
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
            <div
            :key="index + 'side-effect-small'"
            class="side-effect"
            v-bind:class="{ 'right-align-small': ((index % 2) !== 0), 'left-align-small': ((index % 2) === 0)}"
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/sideEffect1' +'.png)',
            }"
            >
            </div>
          </div>
        </div>
        <div class="battle-container">
          <div class="battle-entity-layer">
            <Player v-for="player in players" v-bind:key="player.name" :player="player" :battleMap="currentMap" v-on:toggleMoveState="toggleMoveState" v-on:toggleAttackState="toggleAttackState"/>
            <Monster v-for="enemy in enemies" v-bind:key="enemy.id" :monster="enemy" v-on:turnEnded="nextMonsterTurn" v-on:monsterDied="countDead" v-on:toggleAttackState="toggleAttackState"/>
            <Projectile v-for="projectile in activeProjectileSkills" v-bind:key="projectile.name" :skill="projectile"/>
          </div>
          <TileLayer :currentMap="currentMap" :map="currentMap" :shouldShow="isBattling"/>
        </div>
      </div>
    </div>
    <div class="battle-controls">
      <BattleHeader :title="isMonsterTurn ? currentMonsterTurn.name : currentBattleTurnEntity && currentBattleTurnEntity.name"/>
      <BattleControls :entity="currentBattleTurnEntity" v-on:cycleBattleTurn="cyclePlayerTurn" :toggleEndMenu="toggleEndMenu" :isMoving="isMoving" :isAttacking="isAttacking"/>
    </div>
    {{isAttacking}}
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
import { executeTileEffect } from '../services/skillProcesses';
import Projectile from './Projectile.vue';

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
    TileLayer,
    Projectile
  },
  data () {
    return {
      CONST: CONST,
      publicPath: process.env.BASE_URL,
      enemies: [],
      potentialPath: [],
      currentMap: [],
      currentBattleTurnEntity: null,
      currentMonsterTurn: null,
      players: [],
      totalMonsterCount: 0,
      monsterTurnMap: {},
      lifeMap: {},
      toggleEndMenu: false,
      isMoving: false,
      isAttacking: false,
      activeProjectileSkills: [],
      shaking: false,
    }
  },
  updated () {
    console.log('BattleLayer render...');
  },
  mounted: function() {
    this.$root.$on('damageTaken', this.shakeEffect);
  },
  beforeDestroy() {
    this.$root.$off('damageTaken', this.shakeEffect);
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
      'setIsBattling',
      'setinWorldPlayerTile',
      'setPlayerBattleStatus',
      'cycleBattleTurn',
      'endMonsterTurn',
      'refreshPlayer'
    ]),
    shakeEffect () {
      this.shaking = true;
      setTimeout(() => {
        this.shaking = false;
      }, 300)
    },
    toggleMoveState() {
      this.isMoving = !this.isMoving;
    },
    toggleAttackState(bool) {
      this.isAttacking = bool;
    },
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
      // currentBattleTurn is now the next player, or stays the same while monster goes
      if (this.isMonsterTurn) {
        console.log('end of all player turns');
      } else {
        // end of monster turns, next player turn
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
        // Beginning of first Player turn, or only player in single mode
        const ownedTiles = [];
        const turnEffectTiles = [];

        let manaGains = {
          RED: 0,
          BLUE: 0,
          GREEN: 0,
          BLACK: 0,
          WHITE: 0,
          PURPLE: 0,
        };

        manaGains[this.currentBattleTurn.discipline] +=1;

        this.currentMap.forEach((row) => {
          row.forEach((cell) => {
            // dominion check
            if (cell.manaOwnerId) {
              ownedTiles.push(cell);
              if (cell.manaValueSlotOne) {
                manaGains[cell.manaTypeSlotOne] += cell.manaValueSlotOne;
              }
              if (cell.manaValueSlotTwo) {
                manaGains[cell.manaTypeSlotTwo] += cell.manaValueSlotTwo;
              }
            }
            // turn effect check
            if (cell.turnEffectActive) {
              if (cell.turnEffect.triggerId === this.currentBattleTurn.id) {
                turnEffectTiles.push(cell);
              }
            }
          });
        });

        this.processTurnEffectTiles(turnEffectTiles);
        this.endMonsterTurn(ownedTiles);
        this.$root.$emit('manaGain', manaGains);
      }
    },
    countDead (monsterId) {
      this.lifeMap[monsterId] = false;
      let somethingAlive = false;

      for(var key in this.lifeMap) {
        var value = this.lifeMap[key];
        if (value) {
          somethingAlive = value;
        }
      }

      if (somethingAlive === false) {
        console.log('all enemies dead');
        this.toggleEndMenu = true;
      }
    },
    processTurnEffectTiles(tiles) {
      tiles.forEach((tile) => {
        const effect = tile.turnEffect;
        effect.turnCountdown -= 1;
        if (effect.turnCountdown <= 0) {
          executeTileEffect(tile, this.currentMap);
        }
      });

    },
    clearComponent() {
      this.players = [];
      this.enemies = [];
      this.currentMap = [];
      this.currentBattleTurnEntity = null;
      this.currentMonsterTurn = null;
      this.totalMonsterCount = 0;
      this.monsterTurnMap = {};
    },
    endBattle() {
      this.refreshPlayer(this.currentTurn);
      this.clearComponent();
      this.toggleEndMenu = false;
      this.setIsBattling({state: false});
      this.$root.$emit('lootAdded', {table: this.battleTile.structure && this.battleTile.structure.loot || []});
    }
  },
  watch: {
    // START BATTLE PHASE
    isBattling: function (val) {
      if (val) {
        // TODO: Add multiplayer here
        this.setPlayerBattleStatus({
          players: [this.currentTurn]
        });
        // GENERATE MAP AND ENEMIES FROM TILE
        const generatedMap = createBattleField(this.battleTile);
        const enemies = createEnemies(this.battleTile, generatedMap);
        let enemyLifeMap = {};
        enemies.forEach((monster) => {
          enemyLifeMap[monster.id] = true;
        });

        this.lifeMap = enemyLifeMap;

        const that = this;
        this.players.push(this.currentTurn);
        const startTile = generatedMap[this.currentTurn.battleX][this.currentTurn.battleY];
        startTile.density = 1;
        this.players.forEach((player) => {
          that.setinWorldPlayerTile({player, tile: startTile});
        });

        this.enemies = this.enemies.concat(enemies);

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
  top: 64px;
  left: 128px;
  position: relative;
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
.left-align-small {
  left: -5px;
}
.right-align {
  right: -15px;
}
.right-align-small {
  right: 20px;
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
.side-effect {
  width: 32px;
  height: 32px;
  position: absolute;
  z-index: 4;
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
  right: -20px;
  flex-direction: column;
}
.battle-entity-layer {
  position: absolute;
  left: 0px;
  z-index: 2;
}
.end-battle-menu {
  width: 344px;
  height: 124px;
  background-image: url('/assets/hudSprites/victoryIcon.png');
  position: absolute;
  z-index: 99;
  top: 40px;
  left: 275px;
}
.end-battle-menu button {
  position: absolute;
  bottom: 25px;
  left: 150px;
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
.shaking {
  animation: shake 0.5s;

/* When the animation is finished, start again */
  animation-iteration-count: infinite;
}
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
