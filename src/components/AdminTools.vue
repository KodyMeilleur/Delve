<template>
  <div class="tools">
    <div class="btn-container">
      <button @click="generateContinent">Generate Continent</button>
      <button @click="addPlayerToGame">Add Player</button>
      <button @click="toggleCreatureSpawner">Add Monster</button>
      <button @click="movePlayer">Move Player</button>
      <button @click="endTurn">End Turn</button>
    </div>
    <CreatureSpawner :shouldShow="showCreatureSpawner" v-on:close="toggleCreatureSpawner"/>
  </div>
</template>

<script>
import CreatureSpawner from './CreatureSpawner.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { refineLandmass, cleanLandmass } from '../services/generateLand';

export default {
  name: 'AdminTools',
  components: {
    CreatureSpawner,
  },
  props: {},
  data () {
    return {
      showCreatureSpawner: false,
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
      'toggleMovingTiles',
    ]),
    ...mapActions('world', [
      'cycleTurn',
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
    toggleCreatureSpawner() {
      this.showCreatureSpawner = !this.showCreatureSpawner;
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
  justify-content: center;
}
button {
  margin: 0 2px;
  cursor: pointer;
}
</style>
