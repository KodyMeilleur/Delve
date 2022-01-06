<template>
  <div v-bind:style="{
    minWidth: width + 'px',
    minHeight: height + 'px'
  }"

  class="active tile-component"
  >
  <div
  v-if="shouldShow"
  v-on:mouseover="onMouseOver"
  v-on:mouseleave="onMouseExit"
  v-on:click="setEntity"
  >
    <span v-if="tile.moveHighlighted || focusedEntity === this.tile"
    v-on:click="goToTile"
    class="highlighted"
    v-bind:style="{
      'background-image': 'url(' + publicPath + 'assets/hudSprites/select.png)',
      'background-position': -(64 * currentFrame) + 'px ' + (0) + 'px',
    }"
    >
    </span>
    <span v-if="potentialPath"
    v-on:click.stop="goToTile"
    class="potentialPath"
    >
    </span>
      <div class="tile-sprite">
        <!-- Add frame here -->
        <span class="frame-counter">{{ frame }} </span>
        <!-- Structure Markup -->
        <div class="tile-structure" v-if="tile && tile.structure">
          <div>
            <div
            v-bind:style="{
              'background-image': 'url(' + publicPath + tile.structure.unexploredSprite +'.png)',
              'background-position': -(64 * structureEffectFrame) + 'px ' + (0) + 'px',
              top: (bumpVerticalFramePosition - 15) + 'px',
              left: (bumpHorizontalFramePosition) + 'px',
            }"
            v-if="tile.structure.explorable"
            class="structure-sprite-effect"
            >
            </div>
          </div>
          <div
          v-bind:style="{
            'background-image': 'url(' + publicPath + tile.structure.sprite + '01' +'.png)',
            'background-position': (64 * currentFrame) + 'px ' + (0) + 'px',
            top: (bumpVerticalFramePosition + tile.structure.structureVerticalOffset) + 'px',
            left: (bumpHorizontalFramePosition) + 'px',
          }"
          v-bind:class="{ unexplored: tile.structure.explorable && tile.structure.explored === false}"
          class="structure-sprite"
          >
          </div>
        </div>
        <div
        v-bind:style="{
          'background-image': 'url(' + publicPath + tile.sprite + ')',
          'background-position': (64 * currentFrame) + 'px ' + (64 * currentFrame) + 'px',
          top: (tile.type === 'Void' ? 0 : bumpVerticalFramePosition) + 'px',
          left: (tile.type === 'Void' ? 0 : bumpHorizontalFramePosition) + 'px',
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
import { findPath, returnShallowMapChunk } from '../services/pathfinding';

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
      frame: 0,
      // Variables for scroll data
      xOffset: 0,
      yOffset: 0,
      currentFrame: 0,
      structureEffectFrame: 0,
      structureEffectDelayList: [],
      moveHighlighted: false,
      bumpVerticalFramePosition: 0,
      bumpHorizontalFramePosition: 0,
      overTimeout: null,
      travelPath: null,
      potentialPath: false,
      bumpAnimationMap : {
        // pixels to bump by on frame
        0: {
          vertical: -7,
          horizontal: 0
        },
        1: {
          vertical: -7,
          horizontal: 0
        },
        2: {
          vertical: -6,
          horizontal: 0
        },
        3: {
          vertical: -6,
          horizontal: 0
        },
        4: {
          vertical: -5,
          horizontal: 0
        },
        5: {
          vertical: -5,
          horizontal: 0
        },
        6: {
          vertical: -6,
          horizontal: 0
        },
        7: {
          vertical: -6,
          horizontal: 0
        },
      },
    }
  },
  mounted: function() {
    this.$parent.$on('updateTilePaths', this.isPotentialPathTile);
  },
  beforeDestroy() {
    this.$parent.$off('updateTilePaths');
    this.$root.$off('frameBump');
    clearInterval(this.overTimeout);
  },
  watch: {
    leftOffset: function (val) {
      this.yOffset = val;
      const xRange = ((this.tile.x * CONST.tileWidth));
      const yRange = ((this.tile.y * CONST.tileWidth));
      this.shouldShow = (yRange >= (this.yOffset - (CONST.tileWidth * 2)) && (yRange <= this.yOffset + 896)) &&
        (xRange >= (this.xOffset - (CONST.tileWidth * 2)) && xRange <= this.xOffset + 576 + (CONST.tileWidth));
      if (this.shouldShow) {
        this.$root.$off('frameBump', this.frameAdvance);
        this.$root.$on('frameBump', this.frameAdvance);
      } else {
        this.$root.$off('frameBump', this.frameAdvance);
      }
    },
    topOffset: function (val) {
      this.xOffset = val;
      const xRange = ((this.tile.x * CONST.tileWidth));
      const yRange = ((this.tile.y * CONST.tileWidth));
      this.shouldShow = (yRange >= (this.yOffset - (CONST.tileWidth * 2)) && (yRange <= this.yOffset + 896)) &&
        (xRange >= (this.xOffset - (CONST.tileWidth * 2)) && xRange <= this.xOffset + 576 + (CONST.tileWidth));
      if (this.shouldShow) {
        this.$root.$off('frameBump', this.frameAdvance);
        this.$root.$on('frameBump', this.frameAdvance);
      } else {
        this.$root.$off('frameBump', this.frameAdvance);
      }
    },
  },
  computed: {
      ...mapGetters('world', [
      'map',
      'leftOffset',
      'topOffset',
      'focusedEntity',
      'currentTurn',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
      'setPath',
      'updateLogs'
    ]),
    frameAdvance (frame) {
      if (!this.shouldShow) {
        return;
      }
      this.frame = frame;
      const bumpFrames = this.bumpAnimationMap;

      const delayOption = this.getRandomIntBetween(0, 1);
      let nextFrame = delayOption ? (this.currentFrame + 1) : this.currentFrame;
      this.currentFrame = this.currentFrame >= this.tile.animationFrames ? 0 : nextFrame;

      if (this.tile.structure && this.tile.structure.explorable) {
        if (this.structureEffectDelayList.length <= 0) {
          this.structureEffectDelayList = this.tile.structure.unexploredDelayFrameMap.slice();
        }
        if (this.structureEffectFrame === this.structureEffectDelayList[0]) {
          this.structureEffectDelayList.shift();
        } else {
          this.structureEffectFrame = this.structureEffectFrame >= this.tile.structure.unexploredFrames ? 0 : this.structureEffectFrame + 1;
        }
      }

      const bFrame = bumpFrames[this.currentFrame];
      if (bFrame) {
        this.bumpVerticalFramePosition = bFrame.vertical;
        this.bumpHorizontalFramePosition = bFrame.horizontal;
      } else {
        this.bumpVerticalFramePosition = 0;
        this.bumpHorizontalFramePosition = 0;
      }
    },
    getImgUrl(path) {
      return `${path}`
    },
    setEntity () {
      this.setfocusedEntity(this.tile);
    },
    goToTile () {
      if (this.travelPath) {
        this.setPath({entity: this.currentTurn, path: this.travelPath});
        this.$emit('clearPotentialPath');
        this.updateLogs(`${this.currentTurn.name} is on the move.`);
      }
    },
    getRandomIntBetween(min, max) {
      return getRandomInt(min, max);
    },
    isPotentialPathTile(path) {
      if (path.length && this.shouldShow) {
        for (let i = 0; i < path.length; i++) {
          if(path[i].x === this.tile.x && path[i].y === this.tile.y) {
            this.potentialPath = true;
          }
        }
      } else {
        this.potentialPath = false;
      }

    },
    onMouseOver() {
      if (this.overTimeout) {
        clearTimeout(this.overTimeout);
      }
      this.overTimeout = setTimeout(() => {
        this.lookForPath();
      }, 50)
    },
    lookForPath() {
      if (this.tile.moveHighlighted) {
        const areaAroundPlayer = returnShallowMapChunk(this.focusedEntity, this.map);
        const path = findPath(areaAroundPlayer, {x: this.currentTurn.x, y: this.currentTurn.y, mp: this.currentTurn.mp}, {x: this.tile.x, y: this.tile.y});
        this.travelPath = path;
        this.$emit('potentialPathCalc', path)
        // this.lightPotentialPath(path);
      }
    },
    onMouseExit() {
      if (this.overTimeout) {
        clearTimeout(this.overTimeout);
      }
      if (this.potentialPath) {
        this.$emit('clearPotentialPath');
      }
      this.travelPath = null;
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
.highlighted,.tile-component:hover {
  cursor: pointer;
  z-index: 1;
  color: rgba(255, 255, 255, 0.5);
  background-image: url('/assets/hudSprites/select.png');
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
  visibility: hidden;
}
.highlighted {
  width: 14px;
  height: 14px;
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  left: 0;
}
.potentialPath {
  border-radius: 5px;
  outline: 1px solid blue;
  background-color: rgba(200, 200, 30, 0.5);
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  left: 0;
}
.structure-sprite {
  min-width: 64px;
  min-height: 64px;
  position: absolute;
  max-width: 64px;
  max-height: 64px;
  z-index: 1;
}
.structure-sprite-effect {
  min-width: 64px;
  min-height: 64px;
  position: absolute;
  max-width: 64px;
  max-height: 64px;
  z-index: 2;
  pointer-events: none;
}
.unexplored {
  /* -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  filter: grayscale(100%);
  transition: grayscale 0.5s ease; */
}
</style>
