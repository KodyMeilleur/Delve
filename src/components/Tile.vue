<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px'
  }"
  v-bind:class="{ active: tile.density === 0 }"
  class="tile-component"
  >
    <span class="tile-sprite">
      <img :src="publicPath + tile.sprite" class="tile-sprite-img"/>
    </span>
    <span class="frame-counter">{{ frame }}</span>
    <span class="location">
      ({{ tile.x }},{{ tile.y }})
    </span>
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
      publicPath: process.env.BASE_URL,
    }
  },
  computed: {
      ...mapGetters('world', [
      'frame',
    ])
  },
  methods: {
    getImgUrl(path) {
      return `${path}`
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile-component {
  /* display: inline-block; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.1);
  position: relative;
}
.tile-component:hover {
  outline:2px white solid;
  border-radius: 5px;
  cursor: pointer;
  z-index: 2;
  color: rgba(255, 255, 255, 0.5);
}
.active {
  background-color: green;
}
.location {
  font-size: 8px;
  position: absolute;
  bottom: 0px;
}
.tile-sprite {
  width: 64px;
  height: 64px;
  position: relative;
}
.tile-sprite-img {
  /* position: relative;
  top: 2px; */
}
.frame-counter {
  position: absolute;
}
</style>
