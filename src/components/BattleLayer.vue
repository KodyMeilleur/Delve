<template>
  <div
  v-if="isBattling"
  class="battlemass">
    <div class="row" v-for="row in map" v-bind:key="row.length + Math.random()">
      <Tile v-for="cell in row"
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
      console.log('is battling: ', val);
      if (val) {
        // make a battle array to tile function
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
.battlemass {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  left: 0;
}
</style>
