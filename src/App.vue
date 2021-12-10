<template>
  <div id="app">
    <Cache ref="Cache"/>
    <AdminTools />
    <div class="banner">
      <span class="turn-order">
        Current Turn: {{ currentTurn && currentTurn.name }}
      </span>
    </div>
    <World msg="Delve"/>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';

import World from './components/World.vue';
import AdminTools from './components/AdminTools.vue';
import Cache from './components/Cache.vue'
import CONST from './CONST';
import { createEmptyLandmass } from './services/generateLand';

export default {
  name: 'App',
  components: {
    World,
    AdminTools,
    Cache
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
      'updateMove',
      'updateMonsterMove',
      'updatePlayerAnimations',
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
      // fallback on setTimeout function
      window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                function( callback ){
                  window.setTimeout(callback, 1000 / CONST.FPS);
                };
      })();

      let secondsPassed;
      let now;
      let oldTimeStamp;
      let frame = 1;

      const loop = () => {
        now = new Date().getTime();
        if (!oldTimeStamp) oldTimeStamp = new Date().getTime();

        // Calculate the number of seconds passed since the last frame

        secondsPassed = (now - oldTimeStamp) / 1000;


        window.requestAnimFrame(loop);
        // every 4th of a second?
        // every 10th of a second?
        if (secondsPassed > .1) {
          if (frame === 4) {
            frame = 1;
          } else {
            frame++;
          }
          oldTimeStamp = now;
          this.$root.$emit('frameBump', frame)
          // console.log('secondsPassed: ', secondsPassed)
          update();
        }
      };

      function update() {
        // check movement?
        if (self.isMoving) {
          self.updateMove();
        }
        // if (self.isMonsterMoving) {
        //   self.updateMonsterMove();
        // }
      }

      loop();
    }
  },
  computed: {
      ...mapState('world', {
        world: state => state.map,
      }),
      ...mapGetters('world', [
        'currentTurn',
        'isMoving',
        'isMonsterMoving',
        'players',
        'monsters',
      ])
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
