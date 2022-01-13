<template>
  <div class="log-ui"
  >
  <div class="focus-icon" v-on:click="centerPlayer"></div>
  <div class="log-info">
    <div v-for="log in logs" :key="log.length + Math.random()">
      {{ log }}
    </div>
  </div>
  <div class="control-container">
    <div class="expand-control"></div>
    <div class="collapse-control"></div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import CONST from '../CONST';

export default {
  name: 'Log',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations('world', [
      'setLogFilter',
    ]),
    centerPlayer () {
      const playerX = this.currentTurn.x;
      const playerY = this.currentTurn.y;

      const topOffset = ((playerX * CONST.tileWidth) - (CONST.viewHeight / 2)) || 0;
      const leftOffset = ((playerY * CONST.tileWidth) - (CONST.viewWidth / 2)) + (CONST.tileWidth / 2) || 0;
      this.$root.$emit('centerPlayer', {topOffset, leftOffset});
    },
  },
  computed: {
    ...mapGetters('world', [
      'logs',
      'currentTurn'
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.log-ui {
  position: sticky;
  left: 15px;
  top: 425px;
  width: 256px;
  height: 128px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/logGraphic.png');
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 614px;
}

.log-info {
  margin-left: 14px;
  margin-top: 9px;
  font-size: 9px;
  display: flex;
  overflow-y: scroll;
  height: 106px;
  line-break: anywhere;
  flex-direction: column;
  align-items: flex-start;
}

.control-container {
  position: absolute;
  right: 0;
  display: flex;
}

.expand-control {
  background-image: url('/assets/hudSprites/expandIcon.png');
  width: 14px;
  height: 14px;
}

.collapse-control {
  background-image: url('/assets/hudSprites/collapseIcon.png');
  width: 14px;
  height: 14px;
}

.collapse-control:hover, .expand-control:hover {
  transform: scale(1.1,1.1);
  cursor: pointer;
}

.log-info::-webkit-scrollbar-track {
  border: 1px solid black;
  background-color: white;
  width: 8px;
  border-radius: 10px;
}
.log-info::-webkit-scrollbar-button {
  background-color: red;
}
.focus-icon {
  position: absolute;
  width: 32px;
  height: 32px;
  z-index: 11;
  top: 12px;
  left: 260px;
  cursor: pointer;
  background-image: url('/assets/hudSprites/centerIcon.png');
}
.focus-icon:hover {
  transform: scale(1.1,1.1);
  background-image: url('/assets/hudSprites/centerIconFocus.png');

}
</style>
