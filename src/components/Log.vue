<template>
  <div class="log-ui"
  >
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
    // switchFocus () {
    //   this.setfocusedEntityOverride(this.currentTurn.outworldTileOccupied);
    // }
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
.log-ui {
  position: sticky;
  left: 15px;
  top: 425px;
  width: 256px;
  height: 128px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/logGraphic.png');
  /* -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  font-weight: 800; */
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 363px;
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
</style>
