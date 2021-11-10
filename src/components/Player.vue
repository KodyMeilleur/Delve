<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    top: (player.x * CONST.tileHeight) + 'px',
    left: (player.y * CONST.tileWidth) + 'px',
  }"
  v-on:click="setEntity"
  class="player-component"
  >
  {{ player.name }} ({{ player.x }},{{ player.y }})
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapMutations } from 'vuex';

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
  // computed: {
  //     ...mapGetters('world', [
  //     'frame',
  //   ])
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.player-component {
  position: absolute;
  cursor: default;
}
</style>
