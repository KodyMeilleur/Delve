<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    top: ((player.x * CONST.tileHeight) + player.movingVerticalOffset + bumpVerticalFramePosition) + 'px',
    left: ((player.y * CONST.tileWidth) + player.movingHorizontalOffset + bumpHorizontalFramePosition) + 'px',
  }"
  v-on:click="setEntity"
  v-bind:class="{ selected: focusedEntity === this.player}"
  class="player-component"
  >
  <!-- <div class="player-info">{{ player.name }} ({{ player.x }},{{ player.y }})</div> -->
  <div
  v-bind:style="{
    'background-image': 'url(' + publicPath + player.sprite + player.animation.state + '/' + direction + '/sheet.png)',
    'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px'
  }"
  class="player-sprite"
  >
  </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Player',
  props: {
    player: {
      default: {},
    },
  },
  // created: function() {
  //   this.$parent.$parent.$on('frameBump', this.frameAdvance);
  // },
  created: function() {
    // this.$parent.$parent.$parent.$on('Updated', (() => {console.log('wtf');}));
    this.$parent.$on('frameBump', this.frameAdvance);
  },
  // beforeDestroy() {
  //   this.$parent.$parent.$off('frameBump');
  // },
  data () {
    return {
      width: CONST.tileWidth,
      height: CONST.tileHeight,
      CONST: CONST,
      publicPath: process.env.BASE_URL,
      bumpVerticalFramePosition: 0,
      bumpHorizontalFramePosition: 0,
      currentFrame: 0,
      animation: { ...this.player.animation },
      skipFrames: [ ...this.player.animation.skipFrames ],
    }
  },
  watch: {
    'player.animation': {
      handler(newVal){
        this.animation = Object.assign({}, newVal);
        this.currentFrame = 0;
        this.skipFrames = [ ...this.animation.skipFrames];
      },
       deep: true
     },
     'animation.skipFrames': {
       handler(newVal){
         this.skipFrames = [ ...newVal];
       }
      },
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
    ]),
    frameAdvance () {
      let animation = this.animation;
      const player = this.player;
      const bumpFrames = animation && animation.bumpFrames && animation.bumpFrames[this.currentFrame];
      console.log(animation);
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
          this.animation = player.defaultAnimation;
        }
      }
      if (bumpFrames) {
        this.bumpVerticalFramePosition = bumpFrames.vertical;
        this.bumpHorizontalFramePosition = bumpFrames.horizontal;
      } else {
        this.bumpVerticalFramePosition = 0;
        this.bumpHorizontalFramePosition = 0;
      }
    },
    setEntity () {
      this.setfocusedEntity(this.player);
    }
  },
  computed: {
      ...mapGetters('world', [
      'focusedEntity',
    ]),
    direction: function () {
      // 1N, 2E, 3S, 4W,  0 non moving South
      switch (this.player.movingDirection) {
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
.player-component {
  position: absolute;
  cursor: default;
}
.selected,.player-component:hover {
  outline: 2px white solid;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 255, 255, 0.5);
}
.player-sprite {
  position: absolute;
  min-width: 64px;
  max-width: 64px;
  min-height: 64px;
  max-height: 64px;
}
.player-info {
  position: absolute;
}
</style>
