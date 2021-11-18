<template>
  <div v-bind:style="{
    minWidth: width + 'px',
    minHeight: height + 'px'
  }"
  v-on:click="setEntity"
  v-bind:class="{ active: tile.density === 0, selected: focusedEntity === this.tile}"
  class="tile-component"
  >
  <div v-if="shouldShow">
    <span v-if="tile.moveHighlighted"
    v-on:click="goToTile"
    class="highlighted"
    >
    </span>
      <div class="tile-sprite">
        <!-- Add frame here -->
        <!-- <span class="frame-counter">{{ frame }}</span> -->
        <div
        v-bind:style="{
          'background-image': 'url(' + publicPath + tile.sprite + ')',
          'background-position': (64 * currentFrame) + 'px ' + (64 * currentFrame) + 'px'
        }"
        class="tile-sprite tile-sprite-img"
        >
        </div>
      </div>
      <span class="location">
        ({{ tile.x }},{{ tile.y }})
      </span>
    </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getRandomInt } from '../services/generateLand';

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
      shouldShow: false,
      currentFrame: 0,
    }
  },
  // updated() {
  //   console.log('tile updated');
  // },
  watch: {
    leftOffset: function (val) {
      const yRange = ((this.tile.y * CONST.tileWidth));
      this.shouldShow = (yRange >= (val - (CONST.tileWidth * 2)) && (yRange <= val + 640 + (CONST.tileWidth * 2)));
    },
    topOffset: function (val) {
      const xRange = ((this.tile.x * CONST.tileWidth));
      this.shouldShow = (xRange >= (val - (CONST.tileWidth * 2)) && xRange <= val + 448 + (CONST.tileWidth * 2));
    },
    frame: function () {
      const delayOption = this.getRandomIntBetween(0,1);
      let nextFrame = delayOption ? (this.currentFrame + 1) : this.currentFrame;
      this.currentFrame = this.currentFrame >= this.tile.animationFrames ? 0 : nextFrame;
    }
  },
  computed: {
      ...mapGetters('world', [
      'frame',
      'leftOffset',
      'topOffset',
      'focusedEntity',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
      'moveToTile'
    ]),
    getImgUrl(path) {
      return `${path}`
    },
    setEntity () {
      this.setfocusedEntity(this.tile);
    },
    goToTile () {
      this.moveToTile(this.tile);
    },
    getRandomIntBetween(min, max) {
      return getRandomInt(min, max);
    }
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
.selected,.tile-component:hover {
  outline: 2px white solid;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1;
  color: rgba(255, 255, 255, 0.5);
}
.active {
  background-color: #200b24;
}
.location {
  font-size: 8px;
  position: absolute;
  bottom: 0px;
  left: 19px;
}
.tile-sprite {
  min-width: 64px;
  min-height: 64px;
  position: relative;
  max-width: 64px;
  max-height: 64px;
}
.tile-sprite-img {
  /* position: relative;
  top: 2px; */
}
.frame-counter {
  position: absolute;
  left: 28px;
  top: 22px;
}
.highlighted {
  border-radius: 5px;
  outline: 1px solid blue;
  background-color: rgba(200, 200, 255, 0.5);
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  left: 0;
}
</style>
