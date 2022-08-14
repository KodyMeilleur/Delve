<template>
  <div
  v-if="shouldShow"
  class="landmass">
    <div class="row" v-for="row in map" v-bind:key="row.length + Math.random()">
      <Tile v-for="cell in row"
        :map="map"
        :battleMap="currentMap"
        :tile="cell"
        v-on:potentialPathCalc="updatePotentialPath"
        v-on:clearPotentialPath="clearPotentialPath"
        v-bind:key="cell.id"
      />
    </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import Tile from './Tile.vue';

export default {
  name: 'TileLayer',
  props: {
    map: Array,
    currentMap: {
      type: Array,
      default: () => [],
    },
    shouldShow: Boolean
  },
  components: {
    Tile,
  },
  data () {
    return {
      CONST: CONST,
      totalMonsterCount: 0,
      currentFinishedMonsterTurns: 0,
      currentFrame: 0,
      potentialPath: [],
    }
  },
  updated () {
    console.log('TileLayer render...');
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.row {
  display: inline-flex;
  height: 64px;
  width: 64px;
}
.landmass {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
