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
  // watch: {
  //   sprites (newCount) {
  //     // Our fancy notification (2).
  //     console.log(`We have ${newCount.length} sprites now, yay!`)
  //     setSprites(newCount);
  //   }
  // },
  methods: {
    ...mapMutations('world', [
      'setMap',
      'updateFrame'
    ]),
    initializeWorld () {
      const defaultRowAndColumnCount = CONST.defaultRowAndColumnCount;
      const defaultWorldArray = createEmptyLandmass(defaultRowAndColumnCount, defaultRowAndColumnCount);

      console.log(`x: ${defaultWorldArray.length}, y: ${defaultWorldArray[0].length}`);

      this.setMap(defaultWorldArray);

      this.gameLoop();
    },
    gameLoop : function() {
      const self = this;
      let secondsPassed;
      // let fps;
      let now;
      let oldTimeStamp;
      // js setTimeout has +/- 18ms per second drift to account for
      let frame = 1;
      let interval;

      const loop = () => {
        now = new Date().getTime();
        if (!oldTimeStamp) oldTimeStamp = new Date().getTime();

        // Calculate the number of seconds passed since the last frame

        secondsPassed = (now - oldTimeStamp) / 1000;
        update();

        // every 4th of a second?
        if (secondsPassed > .25) {
          if (frame === 4) {
            frame = 1;
          } else {
            frame++;
          }
          self.updateFrame(frame);
          oldTimeStamp = now;
          // console.log('secondsPassed: ', secondsPassed)
          draw();
          clearInterval(interval);
        }
        interval = setInterval(loop, 1000 / 4);
      };

      function update() {

      }

      function draw() {

      }

      loop();
    }
  },
  computed: {
      ...mapState('world', {
        world: state => state.map,
      }),
  }
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
