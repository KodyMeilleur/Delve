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
          ></div>
        </div>
        <div class="east-border">
          <div
          v-for="index in 4"
          :key="index + 'east'"
          class="east-wall-item"
          v-bind:style="{
            'background-image': 'url(' + publicPath + 'assets/Tiles/Battle/Walls/'+ battleTile.type + '/sheet2' +'.png)',
          }"
          ></div>
        </div>
        <div class="battle-container">
          <div class="row" v-for="row in currentMap" v-bind:key="row.length + Math.random()">
            <Tile v-for="cell in row"
              :tile="cell"
              v-on:potentialPathCalc="updatePotentialPath"
              v-on:clearPotentialPath="clearPotentialPath"
              v-bind:key="cell.id"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="battle-controls">
      <BattleHeader :title="currentBattleTurnEntity && currentBattleTurnEntity.name"/>
      <BattleControls :entity="currentBattleTurnEntity" />
    </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import Tile from './Tile.vue';
import { mapGetters, mapMutations } from 'vuex';
import { createBattleField } from '../models/combatFields/combatFields';
import BattleControls from './BattleControls.vue';
import BattleHeader from './BattleHeader.vue';

export default {
  name: 'BattleLayer',
  props: {
    // map: Array
  },
  components: {
    Tile,
    BattleControls,
    BattleHeader,
  },
  data () {
    return {
      CONST: CONST,
      publicPath: process.env.BASE_URL,
      monsters: [],
      potentialPath: [],
      currentMap: [],
      currentBattleTurnID: null,
      currentBattleTurnEntity: null,
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
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setCurrentBattleTurnID',
    ]),
    updatePotentialPath (path) {
      this.potentialPath = path;
      this.$emit('updateTilePaths', this.potentialPath);
    },
    clearPotentialPath () {
      this.potentialPath = [];
      this.$emit('updateTilePaths', this.potentialPath);
    },
  },
  watch: {
    isBattling: function (val) {
      if (val) {
        const generatedMap = createBattleField(this.battleTile);
        console.log(this.battleTile);
        this.currentBattleTurnID = this.currentTurn.id;
        this.currentBattleTurnEntity = this.currentTurn;
        this.setCurrentBattleTurnID(this.currentTurn.id);
        // make a battle array to tile function
        this.currentMap = generatedMap;
        console.log(this.currentMap);
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
.west-border {
  width: 128px;
  height: 512px;
  position: absolute;
  display: flex;
  top: -64px;
  left: 1px;
  flex-direction: column;
}
.west-wall-item, .east-wall-item {
  width: 128px;
  height: 128px;
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
