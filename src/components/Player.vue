<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    top: ((x * CONST.tileHeight) + movingVerticalOffset + bumpVerticalFramePosition) + 'px',
    left: ((y * CONST.tileWidth) + movingHorizontalOffset + bumpHorizontalFramePosition) + 'px',
  }"
  v-on:click="setEntity"
  v-bind:class="{ selected: focusedEntity === this.player, movingToStructure: this.movingToStructure}"
  class="player-component"
  >
    <div
    v-on:click.stop="movePlayer"
    v-if="this.focusedEntity === this.player && this.currentTurn === this.player && this.inMoveState === false"
    class="move-icon-container"
    >
      <div
      v-bind:style="{
        'background-image': 'url(' + publicPath + 'assets/hudSprites/moveIconSheet' + 'Right' +'.png',
        'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px',
      }"
      class="player-move-effect right"
      >
      </div>
      <div
      v-bind:style="{
        'background-image': 'url(' + publicPath + 'assets/hudSprites/moveIconSheet' + 'Left' +'.png',
        'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px',
      }"
      class="player-move-effect left"
      >
      </div>
      <div
      v-bind:style="{
        'background-image': 'url(' + publicPath + 'assets/hudSprites/moveIconSheet' + 'Top' +'.png',
        'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px',
      }"
      class="player-move-effect top"
      >
      </div>
      <div
      v-bind:style="{
        'background-image': 'url(' + publicPath + 'assets/hudSprites/moveIconSheet' + 'Down' +'.png',
        'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px',
      }"
      class="player-move-effect down"
      >
      </div>
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + player.occupiedSprite + '.png)',
      'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px',
      'top': (-30) + 'px',
      'z-index': '4',
    }"
    v-if="inStructure && isMoving === false"
    class="player-sprite"
    >
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + player.sprite + 'Outworld/' + animation.state + '/' + direction + '/sheet.png)',
      'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px'
    }"
    v-bind:class="{ inStructure: inStructure && isMoving === false}"
    class="player-sprite"
    >
    </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getEntityDirection, returnShallowMapChunk, toggleMoveTiles } from '../services/pathfinding';
import { Animation } from '../models/Animation.js';

export default {
  name: 'Player',
  props: {
    player: {
      default: {},
    },
  },
  mounted: function() {
    this.$root.$on('frameBump', this.frameAdvance);
  },
  beforeDestroy() {
    this.$root.$off('frameBump');
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
      isMoving: false,
      x: this.player.x,
      y: this.player.y,
      currentFrame: 0,
      tilesToTravel: 0,
      path: [],
      animation: { ...this.player.animation },
      skipFrames: [ ...this.player.animation.skipFrames ],
      movingToStructure: false,
      inMoveState: false,
    }
  },
  watch: {
    'player.path': {
      handler (newVal) {
        this.path = Object.assign([], newVal);
        this.tilesToTravel = this.path.length;
        if (this.path.length) {
          this.isMoving = true;
        }
      },
       deep: true
     },
    'leftOffset': {
      handler () {
        this.$root.$off('frameBump', this.frameAdvance);
        this.$root.$on('frameBump', this.frameAdvance);
      },
       deep: false
     },
     'topOffset': {
       handler () {
         this.$root.$off('frameBump', this.frameAdvance);
         this.$root.$on('frameBump', this.frameAdvance);
       },
        deep: false
      },
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
      'updatePlayerPosition',
      'toggleMovingTiles'
    ]),
    frameAdvance () {
      let animation = this.animation;
      const bumpFrames = animation && animation.bumpFrames && animation.bumpFrames[this.currentFrame];

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
          this.skipFrames = this.animation.skipFrames;
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
        this.updatePlayerMove();
      }
    },
    movePlayer () {
        let tilesToLight;
        if (this.showMoveTiles === false) {
          const areaAroundPlayer = returnShallowMapChunk(this.focusedEntity, this.map);
          tilesToLight = toggleMoveTiles(this.focusedEntity, areaAroundPlayer);
        }
        this.toggleMovingTiles(tilesToLight);
        this.inMoveState = true;
    },
    updatePlayerMove () {
      if (this.movingVerticalOffset === 0 && this.movingHorizontalOffset === 0 && this.path.length) {
        const fullDirection = getEntityDirection({
          x: this.x,
          y: this.y,
          path: this.path
        });
        this.movingDirection = fullDirection.direction;
        this.animation = new Animation(8, 'Jump', false);
        if (fullDirection.movingToStructure) {
          console.log('moving');
          this.movingToStructure = true;
        }
      }
      const moveDirection = this.movingDirection;

      // 1N, 2E, 3S, 4W
      // south
      if (moveDirection === 3) {
        this.movingVerticalOffset += CONST.moveAnimationPixelBump;
        if (this.movingVerticalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          this.x = parseInt(this.x) + 1;
          this.path.shift();
          this.movingToStructure = false;
          this.updatePlayerPosition({
            player: this.player,
            coords: {
              x: this.x,
              y: this.y,
              tilesToTravel: this.tilesToTravel
            }
          })
        }
      }
      // east
      if (moveDirection === 2) {
        this.movingHorizontalOffset += CONST.moveAnimationPixelBump;
        if (this.movingHorizontalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          this.y = parseInt(this.y) + 1;
          this.path.shift();
          this.movingToStructure = false;
          this.updatePlayerPosition({
            player: this.player,
            coords: {
              x: this.x,
              y: this.y,
              tilesToTravel: this.tilesToTravel
            }
          })
        }
      }
      // north
      if (moveDirection === 1) {
        this.movingVerticalOffset -= CONST.moveAnimationPixelBump;
        if (this.movingVerticalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          this.x = parseInt(this.x) - 1;
          this.path.shift();
          this.movingToStructure = false;
          this.updatePlayerPosition({
            player: this.player,
            coords: {
              x: this.x,
              y: this.y,
              tilesToTravel: this.tilesToTravel
            }
          })
        }
      }
      // west
      if (moveDirection === 4) {
        this.movingHorizontalOffset -= CONST.moveAnimationPixelBump;
        if (this.movingHorizontalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          this.y = parseInt(this.y) - 1;
          this.path.shift();
          this.movingToStructure = false;
          this.updatePlayerPosition({
            player: this.player,
            coords: {
              x: this.x,
              y: this.y,
              tilesToTravel: this.tilesToTravel
            }
          })
        }
      }

      if (this.tilesToTravel === 0) {
        this.animation = new Animation(4, 'Idle', true);
        this.skipFrames = this.animation.skipFrames;
        this.isMoving = false;
        this.inMoveState = false;
      }
    },
    setEntity () {
      this.setfocusedEntity(this.player);
      this.inMoveState = false;
    }
  },
  computed: {
      ...mapGetters('world', [
      'focusedEntity',
      'currentTurn',
      'map',
      'leftOffset',
      'topOffset',
      'showMoveTiles',
    ]),
    inStructure: function() {
      return this.player.outworldTileOccupied.structure ? true : false;
    },
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
.selected,.player-component:hover {
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 255, 255, 0.5);
  background-image: url('/assets/hudSprites/select.png');
}
.player-sprite {
  position: absolute;
  min-width: 64px;
  max-width: 64px;
  min-height: 64px;
  max-height: 64px;
  top: -7px;
}
.player-info {
  position: absolute;
}
.player-component {
  position: absolute;
  cursor: default;
  -webkit-transform: scale(1) rotate(0.01deg);
  transform: scale(1) rotate(0.01deg);
  -webkit-transition: -webkit-transform 0.5s;
  transition: transform 0.5s;
}
.player-component.movingToStructure {
  -webkit-transform: scale(0.5) rotate(0.01deg);
  transform: scale(0.5) rotate(0.01deg);
  -webkit-transition: -webkit-transform 0.5s;
  transition: transform 0.5s;
}
.player-sprite.inStructure {
  display: none;
}
.player-move-effect {
  position: absolute;
  width: 64px;
  height: 64px;
  animation: createBox .25s;
}
.player-move-effect.top {
  top: -42px;
}
.player-move-effect.down {
  top: 40px;
}
.player-move-effect.right {
  left: 40px;
}
.player-move-effect.left {
  left: -40px;
}
.player-move-effect:hover {
  transform: scale(1.2,1.2);
}
@keyframes createBox {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
