<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px'
  }"
  v-bind:class="{ active: tile.density === 0 }"
  class="tile-component"
  >
  {{ frame }}
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters } from 'vuex';

export default {
  name: 'Tile',
  props: {
    tile: {
      default: {},
    },
  },
  data () {
    return {
      width: CONST.tileWidth,
      height: CONST.tileHeight,
    }
  },
  computed: {
      ...mapGetters('world', [
      'frame',
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile-component {
  /* display: inline-block; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.tile-component:hover {
  outline:2px white solid;
  border-radius: 5px;
  cursor: pointer;
  z-index: 2;
}
.active {
  background-color: green;
}
</style>
