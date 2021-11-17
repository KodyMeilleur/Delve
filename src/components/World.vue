<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="world-container">
      <div
      v-on:scroll.passive="handleScroll"
      class="world-box"
      >
        <SelectedEntity />
        <div class="landmass">
          <div class="players">
            <!-- Player has a reference inside Tile Objects, but also layers seperately-->
            <Player v-for="player in players" v-bind:key="player.name" :player="player"/>
          </div>
          <div class="row" v-for="row in map" v-bind:key="row.length + Math.random()">
              <Tile v-for="cell in row" :tile="cell"
                   v-bind:key="cell.density + Math.random()"
              />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Tile from './Tile.vue';
import Player from './Player.vue';
import SelectedEntity from './selectedEntity.vue';

export default {
  name: 'World',
  props: [
    'msg',
    'currentTurn'
  ],
  components: {
    Tile,
    Player,
    SelectedEntity,
  },
  updated () {
    console.log('world re-render')
    this.setScroll({scrollLeft: this.scrollLeftCache += 2, scrollTop: this.scrollTopCache += 2});
  },
  data () {
    return {
      repositories: [],
      scrollLeftCache: 0,
      scrollTopCache: 0,
    }
  },
  computed: {
    ...mapGetters('world', [
      'map',
      'players',
      // 'currentTurn',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setScroll',
    ]),
    handleScroll ($event) {
      // console.log($event);
      const that = this;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        // your action
        const scrollLeft = parseInt($event.srcElement.scrollLeft);
        const scrollTop = parseInt($event.srcElement.scrollTop);
        that.scrollLeftCache = scrollLeft;
        that.scrollTopCache = scrollTop;
        that.setScroll({scrollLeft, scrollTop});
      }, 1); // delay
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.world-container {
  display: flex;
  justify-content: center;
}
.world-box {
  width: 640px;
  height: 448px;
  overflow: scroll;
  background-color: #33232a;
  position: relative;
}
.landmass {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  left: 0;
}
.row {
  display: inline-flex;
  height: 64px;
}
.players {
  width: 0;
  height: 0;
  float: left;
  position: absolute;
  z-index: 2;
}
.turn-order {
  position: relative;
  top: -10px;
}
</style>
