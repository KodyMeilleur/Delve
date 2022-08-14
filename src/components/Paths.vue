<template>
  <div
    class="paths unselectable"
  >
    <div
    v-if="tile.itemCharged === true"
    class="chest">
    </div>
    <span>
      <div
      v-if="tile.type !== 'Void' && tile.battleTile === false && !tile.itemCharged && !tile.moneycharged"
      class="pathSlot"></div>
      <div
      v-if="tile.itemCharged || tile.moneycharged"
      class="pathSlotAlternate"></div>
    </span>
    <div
    v-if="tile.NORTHPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/NORTH.png)',
    }"
    class="NORTH path vertical"></div>
    <div
    v-if="tile.WESTPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/WEST.png)',
    }"
    class="WEST path horizontal"></div>
    <div
    v-if="tile.SOUTHPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/SOUTH.png)',
    }"
    class="SOUTH path vertical"></div>
    <div
    v-if="tile.EASTPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/EAST.png)',
    }"
    class="EAST path horizontal"></div>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
// import CONST from '../CONST';

export default {
  name: 'Paths',
  props: {
    tile: {
      default: {},
    },
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
    }
  },
  methods: {
    ...mapMutations('world', [
    ]),
  },
  computed: {
    ...mapGetters('world', [
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.paths {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  position: absolute;
  top: 0px;
}
.path {
  position: absolute;
  z-index: 1;
}
.pathSlot, .pathSlotAlternate {
  width: 6px;
  height: 6px;
  left: 29px;
  position: absolute;
  z-index: 2;
  top: 28px;
}
.pathSlot {
  background-image: url('/assets/Tiles/Outworld/Paths/emptyPathSlot.png');
}
.pathSlotAlternate {
  background-image: url('/assets/Tiles/Outworld/Paths/activePathSlot.gif');
}
.chest {
  z-index: 2;
  position: absolute;
  width: 32px;
  height: 32px;
  left: 16px;
  background-image: url('/assets/Tiles/Outworld/Paths/chest.gif');
}
.horizontal {
  width: 25px;
  height: 4px;
}
.vertical {
  width: 4px;
  height: 26px;
}
.NORTH {
  left: 30px;
  top: 6px;
}
.WEST {
  left: 6px;
  top: 28px;
}
.SOUTH {
  left: 30px;
  bottom: 5px;
}
.EAST {
  left: 32px;
  top: 28px;
}
.tileZoom {
  transform: scale(1.01)!important;
}
.tileOut {
  transform: scale(0.99)!important;
}
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
