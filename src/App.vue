<template>
  <div id="app">
    <AdminTools />
    <div class="banner">
    </div>
    <World />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import World from './components/World.vue';
import AdminTools from './components/AdminTools.vue';
import CONST from './CONST';
import { createEmptyLandmass } from './services/generateLand';

export default {
  name: 'App',
  components: {
    World,
    AdminTools,
  },
  data () {
    return {
    }
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

      this.gameLoop();
    },
    gameLoop : function() {
      // fallback on setTimeout function
      window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                  window.setTimeout(callback, 1000 / CONST.FPS);
                };
      })();

      // let secondsPassed;
      // let now;
      // let oldTimeStamp;
      let frameCount = 0;
      let fpsInterval, now, then, elapsed;


      // initialize the timer variables and start the animation

      function startAnimating(fps) {
          fpsInterval = 1000 / fps;
          then = Date.now();
          loop();
      }

      const loop = () => {

        window.requestAnimFrame(loop);

        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if (elapsed > fpsInterval) {

          frameCount += 1;

          if (frameCount > 3) {
            frameCount = 0;
          }
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            // Put your drawing code here
            this.$root.$emit('frameBump', frameCount);
        }


      };

      startAnimating(20);
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  zoom: 1.6;
  -moz-transform: scale(1.5);
}
</style>
