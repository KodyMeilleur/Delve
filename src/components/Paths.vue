<template>
  <div
    v-bind:class="{tileZoom: isTop, tileOut: isBottom}"
    class="paths unselectable"
  >
    <div
    v-if="tile.itemCharged === true"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/chest.gif)',
      top: (bumpVerticalFramePosition + 5) + 'px',
    }"
    class="chest">
    </div>
    <span>
      <div
      v-if="tile.type !== 'Void' && tile.battleTile === false && !tile.itemCharged && !tile.moneycharged"
      v-bind:style="{
        'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + 'emptyPathSlot.png)',
        top: (bumpVerticalFramePosition + 28) + 'px',
      }"
      class="pathSlot"></div>
      <div
      v-if="tile.itemCharged || tile.moneycharged"
      v-bind:style="{
        'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + 'activePathSlot.png)',
        top: (bumpVerticalFramePosition + 28) + 'px',
      }"
      class="pathSlotAlternate"></div>
    </span>
    <div
    v-if="tile.NORTHPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/NORTH.png)',
      top: (bumpVerticalFramePosition + 6) + 'px',
    }"
    class="NORTH path vertical"></div>
    <div
    v-if="tile.WESTPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/WEST.png)',
      top: (bumpVerticalFramePosition + 28) + 'px',
    }"
    class="WEST path horizontal"></div>
    <div
    v-if="tile.SOUTHPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/SOUTH.png)',
      top: (bumpVerticalFramePosition + 33) + 'px',
    }"
    class="SOUTH path vertical"></div>
    <div
    v-if="tile.EASTPATH"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/Tiles/Outworld/Paths/' + tile.pathType + '/EAST.png)',
      top: (bumpVerticalFramePosition + 28) + 'px',
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
    bumpVerticalFramePosition: {
      default: 0
    },
    isTop: {
      type: Boolean
    },
    isBottom: {
      type: Boolean
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
}
.path {
  position: absolute;
  z-index: 1;
}
.paths {
  z-index: 1;
  position: absolute;
  top: 6px;
}
.pathSlot, .pathSlotAlternate {
  width: 6px;
  height: 6px;
  left: 29px;
  position: absolute;
  z-index: 2;
}
.chest {
  z-index: 2;
  position: absolute;
  width: 32px;
  height: 32px;
  left: 16px;
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
  left: 30px
}
.WEST {
  left: 6px;
}
.SOUTH {
  left: 30px
}
.EAST {
  left: 32px;
}
.tileZoom {
  transform: scale(1.01)!important;
  top: 7px;
}
.tileOut {
  transform: scale(0.99)!important;
  top: 5px;
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
