<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    top: ((x * CONST.tileHeight) + movingVerticalOffset + bumpVerticalFramePosition) + 'px',
    left: ((y * CONST.tileWidth) + movingHorizontalOffset + bumpHorizontalFramePosition) + 'px',
  }"
  v-on:click="setEntity"
  v-bind:class="{ selected: focusedEntity === this.monster }"
  class="monster-component"
  >
  <!-- <div class="monster-info">{{ monster.type }} ({{ monster.x }},{{ monster.y }})</div> -->
  <div
  v-bind:style="{
    'background-image': 'url(' + publicPath + monster.sprite + animation.state + '/' + (direction || 'South') + '/sheet.png)',
    'background-position': (64 * currentFrame) + 'px ' + (0) + 'px'
  }"
  class="monster-sprite"
  >
  </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getEntityDirection } from '../services/pathfinding';
import { Animation } from '../models/Animation.js';

export default {
  name: 'Monster',
  props: {
    monster: {
      default: {},
    },
  },
  data () {
    return {
      width: CONST.tileWidth,
      height: CONST.tileHeight,
      CONST: CONST,
      publicPath: process.env.BASE_URL,
      bumpVerticalFramePosition: 0,
      bumpHorizontalFramePosition: 0,
      movingVerticalOffset: 0,
      movingHorizontalOffset: 0,
      movingDirection: 0,
      x: this.monster.x,
      y: this.monster.y,
      currentFrame: 0,
      tilesToTravel: 0,
      path: [],
      animation: { ...this.monster.defaultAnimation },
      skipFrames: [],
      isMoving: false,
    }
  },
  watch: {
     currentTurn: {
        handler (currentTurn) {
          if (currentTurn.name === 'World') {
            this.tilesToTravel = this.monster.path.length;
            this.path = this.monster.path;
            this.isMoving = true;
          }
        },
     },
     frame: function () {
       let animation = this.animation;
       const monster = this.monster;
       const bumpFrames = animation.bumpFrames && animation.bumpFrames[this.currentFrame];

       if (this.skipFrames.length &&
           this.currentFrame === this.skipFrames[0]) {
         this.skipFrames.shift(); // problem
       } else {
         this.currentFrame += 1;
       }
       if (this.currentFrame >= animation.maxNumberOfFrames) {
         this.currentFrame = 0;
         if (animation.shouldLoop === true) {
           animation.refreshSkipFrames();
         } else {
           this.animation = Object.assign({}, monster.defaultAnimation);
         }
       }
       if (bumpFrames) {
         this.bumpVerticalFramePosition = bumpFrames.vertical;
         this.bumpHorizontalFramePosition = bumpFrames.horizontal;
       } else {
         this.bumpVerticalFramePosition = 0;
         this.bumpHorizontalFramePosition = 0;
       }

       if (this.isMoving) {
         this.updateMonsterMove();
       }
     },
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
      'updateMonsterPosition'
    ]),
    setEntity () {
      this.setfocusedEntity(this.monster);
    },
    updateMonsterMove () {
      if (this.movingVerticalOffset === 0 && this.movingHorizontalOffset === 0 && this.path.length) {
        this.movingDirection = getEntityDirection({
          x: this.x,
          y: this.y,
          path: this.path
        });

        this.animation = new Animation(8, 'Jump', false);
      }
      const moveDirection = this.movingDirection;

      // Failsafe for no found path
      if (this.path.length <= 0) {
        this.isMoving = false;
        this.$emit('turnEnded');

        return;
      }

      // 1N, 2E, 3S, 4W
      // south
      if (moveDirection === 3) {
        this.movingVerticalOffset += CONST.monsterAnimationPixelBump;
        if (this.movingVerticalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          this.x = parseInt(this.x) + 1;
          this.path.shift();
        }
      }
      // east
      if (moveDirection === 2) {
        this.movingHorizontalOffset += CONST.monsterAnimationPixelBump;
        if (this.movingHorizontalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          this.y = parseInt(this.y) + 1;
          this.path.shift();
        }
      }
      // north
      if (moveDirection === 1) {
        this.movingVerticalOffset -= CONST.monsterAnimationPixelBump;
        if (this.movingVerticalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          this.x = parseInt(this.x) - 1;
          this.path.shift();
        }
      }
      // west
      if (moveDirection === 4) {
        this.movingHorizontalOffset -= CONST.monsterAnimationPixelBump;
        if (this.movingHorizontalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          this.y = parseInt(this.y) - 1;
          this.path.shift();
        }
      }

      if (this.tilesToTravel === 0) {
        this.updateMonsterPosition({
          monster: this.monster,
          coords: {
            x: this.x,
            y: this.y,
          }
        })
        this.animation = new Animation(9, 'Idle', true);
        this.isMoving = false;
        this.$emit('turnEnded'); // trigger event on the current instance
      }
    },
  },
  computed: {
      ...mapGetters('world', [
      'focusedEntity',
      'frame',
      'currentTurn'
    ]),
    direction: function () {
      // 1N, 2E, 3S, 4W,  0 non moving South
      switch (this.movingDirection) {
        case 0:
          return 'South'
        case 1:
          return 'North'
        case 2:
          return 'East'
        case 3:
          return 'South'
        case 4:
          return 'West'
        default:
          return '';
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.monster-component {
  position: absolute;
  cursor: default;
}
.selected,.monster-component:hover {
  outline: 2px white solid;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 255, 255, 0.5);
}
.monster-sprite {
  position: absolute;
  min-width: 64px;
  max-width: 64px;
  min-height: 64px;
  max-height: 64px;
  transition: background-image .1s ease-in-out;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility:    hidden;
  -ms-backface-visibility:     hidden;
}
.monster-info {
  position: absolute;
}
</style>
