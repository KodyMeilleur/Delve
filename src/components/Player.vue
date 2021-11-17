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
  {{ player.name }} ({{ player.x }},{{ player.y }})
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
  data () {
    return {
      width: CONST.tileWidth,
      height: CONST.tileHeight,
      CONST: CONST,
      bumpVerticalFramePosition: 0,
      bumpHorizontalFramePosition: 0,
    }
  },
  watch: {
    'player.animation': {
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
      this.setfocusedEntity(this.player);
    }
  },
  computed: {
      ...mapGetters('world', [
      'focusedEntity',
    ]),
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
</style>
