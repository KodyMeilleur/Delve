<template>
  <div class="tools">
    <div class="btn-container">
      <button @click="generateContinent">Generate Continent</button>
      <button @click="addPlayerToGame">Add Player</button>
      <button @click="quickPlayerAdd">Quick Add Player</button>
      <button @click="toggleCreatureSpawner">Add Monster</button>
      <button :disabled="!currentTurn || currentTurn && currentTurn.mp <= 0" @click="movePlayer">Move Player</button>
      <button :disabled="isMonsterMoving === true" @click="endTurn">End Turn</button>
      <button  @click="shakeWorld">Shake World</button>
    </div>
    <CreatureSpawner :shouldShow="showCreatureSpawner" v-on:close="toggleCreatureSpawner"/>
  </div>
</template>

<script>
import CreatureSpawner from './CreatureSpawner.vue';
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { refineLandmass, cleanLandmass, placeResourceStructures, placeAnchor , placeTotems} from '../services/generateLand';
import { returnShallowMapChunk, toggleMoveTiles } from '../services/pathfinding';

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
      'focusedEntity',
      'moveTiles',
      'showMoveTiles',
      'isMonsterMoving',
      'currentTurn',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'mergeFirstLandmass',
      'updateFrame',
      'addNewPlayerToGame',
      'toggleMovingTiles',
      'updateLogs'
    ]),
    ...mapActions('world', [
      'cycleTurn',
    ]),
    generateContinent () {
      const randomLandmass = refineLandmass();
      // TODO: Add generation functions? Or move cleanLandmass to a parent function
      placeResourceStructures(randomLandmass, 'Woods', 10);
      placeResourceStructures(randomLandmass, 'Mountains', 2);
      cleanLandmass(randomLandmass);
      placeAnchor(randomLandmass);
      placeTotems(randomLandmass, 2);
      // console.log(randomLandmass);
      this.mergeFirstLandmass({landmass: randomLandmass, name: 'Plains'});
      this.updateLogs('Landmass Generated!');
    },
    addPlayerToGame () {
      const name = window.prompt('Player Name:', '');
      const x = window.prompt("x position to spawn: ", '');
      const y = window.prompt("y position to spawn: ", '');
      this.addNewPlayerToGame({name, x, y});
      this.updateLogs(`${name} has emerged from the ether!`);
    },
    quickPlayerAdd() {
      this.addNewPlayerToGame({name: 'Z', x:25, y:25});
      this.updateLogs(`${name} has emerged from the ether!`);
    },
    toggleCreatureSpawner() {
      this.showCreatureSpawner = !this.showCreatureSpawner;
    },
    movePlayer () {
      if (this.isMoving === false && this.canMove) {
        let tilesToLight;
        if (this.showMoveTiles === false) {
          const areaAroundPlayer = returnShallowMapChunk(this.focusedEntity, this.map);
          tilesToLight = toggleMoveTiles(this.focusedEntity, areaAroundPlayer);
        }
        this.toggleMovingTiles(tilesToLight);
      }
    },
    endTurn () {
      this.cycleTurn();
      // this.$emit('cycleTurn');
    },
    shakeWorld () {
      this.$root.$emit('shakeWorld');
    }
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
