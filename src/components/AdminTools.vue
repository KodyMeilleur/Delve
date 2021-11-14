<template>
  <div class="tools">
    <button @click="generateContinent">Generate Continent</button>
    <button @click="addPlayerToGame">Add Player</button>
    <button @click="movePlayer">Move Player</button>
    <button @click="endTurn">End Turn</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { refineLandmass, cleanLandmass } from '../services/generateLand';

export default {
  name: 'AdminTools',
  props: {},
  data () {
    return {
      repositories: [],
    }
  },
  computed: {
    ...mapGetters('world', [
      'map',
      'isMoving',
      'canMove',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'mergeFirstLandmass',
      'updateFrame',
      'addNewPlayerToGame',
      'cycleTurn',
      'toggleMovingTiles',
    ]),
    generateContinent () {
      const randomLandmass = refineLandmass();

      cleanLandmass(randomLandmass);
      this.mergeFirstLandmass(randomLandmass);
    },
    addPlayerToGame () {
      const name = window.prompt('Player Name:', '');
      const x = window.prompt("x position to spawn: ", '');
      const y = window.prompt("y position to spawn: ", '');
      this.addNewPlayerToGame({name, x, y});
    },
    movePlayer () {
      if (this.isMoving === false && this.canMove) {
        this.toggleMovingTiles();
      }

    },
    endTurn () {
      this.cycleTurn();
      // this.$emit('cycleTurn');
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tools {
  display: flex;
  justify-content: flex-start;
}
button {
  margin: 0 2px;
  cursor: pointer;
}
</style>
