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
      Controls
    </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import Tile from './Tile.vue';
import { mapGetters } from 'vuex';
import { createBattleField } from '../models/combatFields/combatFields';

export default {
  name: 'BattleLayer',
  props: {
    // map: Array
  },
  components: {
    Tile,
  },
  data () {
    return {
      CONST: CONST,
      publicPath: process.env.BASE_URL,
      totalMonsterCount: 0,
      currentFinishedMonsterTurns: 0,
      currentFrame: 0,
      potentialPath: [],
      currentMap: [],
    }
  },
  updated () {
    console.log('BattleLayer render...');
  },
  computed: {
    ...mapGetters('world', [
      'isBattling',
      'battleTile',
    ])
  },
  methods: {
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
