<template>
  <div
  class="header-ui unselectable"
  >
  <div class="header-container">
    <div class="nemesis-counter">
      <span class="nemesis-countdown font-style">{{ heroSpawnCountdown }}</span>
    </div>
    <div class="header-current-turn">
      <div class="turn-text font-style">Current Turn:</div>
      <div class="player-name font-style"> {{ currentTurn && currentTurn.name }}  </div>
    </div>
    <div class="header-end-turn">
      <div class="end-turn-sprite" v-on:click="endTurn"></div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'Header',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations('world', [
      'setLogFilter',
    ]),
    ...mapActions('world', [
      'cycleTurn',
    ]),
    endTurn () {
      this.cycleTurn();
    },
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn',
      'heroSpawnCountdown'
    ]),
  },
}
</script>

<style scoped>
.header-ui {
  position: sticky;
  left: 345px;
  top: 32px;
  width: 256px;
  height: 64px;
  z-index: 12;
  background-image: url('/assets/hudSprites/header.png');
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 614px;
}
.header-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.header-current-turn {
  position: absolute;
  left: 80px;
  width: 100px;
  height: 64px;
  display: flex;
  flex-direction: column;
  top: 5px;
}
.nemesis-counter {
  position: absolute;
  top: 14px;
  left: 12px;
  font-size: 22px;
  width: 42px;
  height: 32px;
  display: flex;
  justify-content: center;
}
.font-style {
  font-weight: 800;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
.turn-text {
  font-size: 12px;
  width: 100px;
  top: 3px;
  left: -2px;
}
.end-turn-sprite {
  background-image: url('/assets/hudSprites/endTurnIcon.png');
  width: 64px;
  height: 64px;
  cursor: pointer;
}
.end-turn-sprite:hover {
  transform: scale(1.1,1.1);
}
.header-end-turn {
  position: absolute;
  right: 5px;
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
