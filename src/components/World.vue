<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="world-container">
      <div class="world-box">
        <div class="landmass">
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

export default {
  name: 'World',
  props: {
    msg: String,
  },
  components: {
    Tile,
  },
  data () {
    return {
      repositories: [],
    }
  },
  computed: {
    ...mapGetters('world', [
      'map',
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
}
.landmass {
  /* overflow: inherit; */
  position: relative;
  top: 0;
  left: 0;
}
.row {
  display: inline-flex
}
</style>
