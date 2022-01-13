<template>
  <div
  class="header-ui unselectable"
  >
  <div class="header-container">
    <div class="nemesis-counter">
      <span class="nemesis-countdown">{{ heroSpawnCountdown }}</span>
    </div>
    <div>
    </div>
    <div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

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
.nemesis-counter {
  position: absolute;
  top: 14px;
  left: 20px;
  font-size: 22px;
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
