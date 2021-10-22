<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="world-container">
      <div class="world-box">
        <div class="landmass">
          <!-- <div class="row" v-for="row in map.schema" v-bind:key="row.length + Math.random()">
              <Tile v-for="cell in row"
                   v-bind:key="cell.density + Math.random()"
              />
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// import Tile from './Tile.vue';

export default {
  name: 'World',
  props: {
    msg: String,
  },
  components: {
    // Tile,
  },
  data () {
    return {
      repositories: [],
    }
  },
  computed: mapState('world' , {
    world: state => state.map,
  }),
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
  overflow: hidden;
  background-color: #33232a;
}
.landmass {
  height: 900px;
  width: 300px;
  background-color: red;
  position: relative;
  top: 0;
  left: 0;
}
.row {
  display: flex;
}
</style>
