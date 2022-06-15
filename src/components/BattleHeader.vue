<template>
  <div
  class="battle-header-ui unselectable">
  <div class="title-text text-style">
    <div class="turn-name">{{ title }} </div>
    <div> is Casting!</div>
  </div>
  </div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'BattleHeader',
  props: {
    title: String
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations('world', []),
  },
  computed: {
    ...mapGetters('world', [
      'logs',
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.battle-header-ui {
  position: absolute;
  left: 320px;
  top: 8px;
  width: 256px;
  height: 32px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/battleHeader.png');
}
.turn-name {
  margin-right: 6px;
}
.title-text {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}
.text-style {
  font-weight: 800;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
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
