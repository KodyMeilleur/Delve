<template>
  <div id="app">
    <AdminTools/>
    <World msg="Test World"/>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

import World from './components/World.vue';
import AdminTools from './components/AdminTools.vue';
import CONST from './CONST';
import { createEmptyLandmass } from './services/generateLand';

export default {
  name: 'App',
  components: {
    World,
    AdminTools
  },
  data () {
    return {}
  },
  mounted() {
    console.log('App Loaded, initializing world..');
    this.initializeWorld();
  },
  methods: {
    ...mapMutations('world', [
      'setMap',
    ]),
    initializeWorld () {
      const defaultRowAndColumnCount = CONST.defaultRowAndColumnCount;
      const defaultWorldArray = createEmptyLandmass(defaultRowAndColumnCount, defaultRowAndColumnCount);

      console.log(`x: ${defaultWorldArray.length}, y: ${defaultWorldArray[0].length}`);

      this.setMap(defaultWorldArray);
    },
  },
  computed: mapState('world' , {
    world: state => state.map,
  }),
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


</style>
