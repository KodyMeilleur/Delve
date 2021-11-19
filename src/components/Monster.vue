<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    top: ((monster.x * CONST.tileHeight) + monster.movingVerticalOffset + bumpVerticalFramePosition) + 'px',
    left: ((monster.y * CONST.tileWidth) + monster.movingHorizontalOffset + bumpHorizontalFramePosition) + 'px',
  }"
  v-on:click="setEntity"
  v-bind:class="{ selected: focusedEntity === this.monster}"
  class="monster-component"
  >
  <div class="monster-info">{{ monster.type }} ({{ monster.x }},{{ monster.y }})</div>
  <!-- <div class="monster-sprite">
    <img
    :src="publicPath + monster.sprite + monster.animation.state + '/' + direction + '/' + monster.animation.currentFrame + '.png'"
    class="tile-sprite-img"
    />
  </div> -->
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

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
    }
  },
  watch: {
    'monster.animation': {
       handler(animation){
         const bumpFrames = animation.bumpFrames && animation.bumpFrames[animation.currentFrame]
         if (bumpFrames) {
           this.bumpVerticalFramePosition = bumpFrames.vertical;
           this.bumpHorizontalFramePosition = bumpFrames.horizontal;
         } else {
           this.bumpVerticalFramePosition = 0;
           this.bumpHorizontalFramePosition = 0;
         }
       },
       deep: true
     }
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
    ]),
    setEntity () {
      this.setfocusedEntity(this.monster);
    }
  },
  computed: {
      ...mapGetters('world', [
      'focusedEntity',
    ]),
    direction: function () {
      // 1N, 2E, 3S, 4W,  0 non moving South
      switch (this.monster.movingDirection) {
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
}
.monster-info {
  position: absolute;
}
</style>
