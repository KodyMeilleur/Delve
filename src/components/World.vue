<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="world-container">
      <div class="world-box">
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
import { mapGetters } from 'vuex';

import Tile from './Tile.vue';
import Player from './Player.vue';

export default {
  name: 'World',
  props: [
    'msg',
    'currentTurn'
  ],
  components: {
    Tile,
    Player,
  },
  data () {
    return {
      repositories: [],
    }
  },
  computed: {
    ...mapGetters('world', [
      'map',
      'players',
      // 'currentTurn',
    ])
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
  /* overflow: inherit; */
  position: relative;
  width: inherit;
  height: inherit;
  top: 0;
  left: 0;
}
.row {
  display: inline-flex
}
.players {
  width: inherit;
  height: inherit;
  float: left;
  position: absolute;
}
.turn-order {
  position: relative;
  top: -10px;
}
</style>
