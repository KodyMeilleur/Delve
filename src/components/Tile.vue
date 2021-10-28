<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px'
  }"
  v-bind:class="{ active: tile.density === 0 }"
  class="tile-component"
  >
  {{tile.density}}
  </div>
</template>

<script>
import CONST from '../CONST';

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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile-component {
  display: inline-block;
}
.active {
  background-color: green;
}
</style>
