<template>
  <div class="focus-ui unselectable"
  >
  <div class="focus-sprite" v-on:click="toggle"></div>
  <div class="focus-menu" v-if="expanded">
    <div class="focus-menu-container">
      <div class="focus-stats focus-block">
        <div class="stat-column">
          <div class="hp stat">
            <div class="stat-inner">
              <div>HP</div>
              <div class="stat-box">{{currentTurn.hp}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="en stat">
            <div class="stat-inner">
              <div>EN</div>
              <div class="stat-box">{{currentTurn.en}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="str stat">
            <div class="stat-inner">
              <div>STR</div>
              <div class="stat-box">{{currentTurn.str}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="stat-column">
          <div class="def stat">
            <div class="stat-inner">
              <div>DEF</div>
              <div class="stat-box">{{currentTurn.def}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="int stat">
            <div class="stat-inner">
              <div>INT&nbsp;</div>
              <div class="stat-box">{{currentTurn.int}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="wis stat">
            <div class="stat-inner">
              <div>WIS</div>
              <div class="stat-box">{{currentTurn.wis}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="focus-effects focus-block">
        <div class="effects-container">
          <div class="sprite brn"></div>
          <div class="sprite frz"></div>
          <div class="sprite cur"></div>
          <div class="sprite con"></div>
          <div class="sprite psn"></div>
          <div class="sprite bnd"></div>
        </div>
      </div>
      <div class="focus-equipment focus-block">
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'FocusStats',
  data () {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
    }
  },
  methods: {
    ...mapMutations('world', [
      'setLogFilter',
    ]),
    toggle () {
      this.expanded = !this.expanded;
    },
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn',
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.focus-ui {
  position: sticky;
  left: 15px;
  top: 425px;
  width: 256px;
  height: 100px;
  z-index: 11;
  float: right;
  margin-right: 614px;
}
.focus-sprite {
  background-image: url('/assets/hudSprites/focusStatIcon.png');
  width: 32px;
  height: 32px;
  cursor: pointer;
  top: 50px;
  left: 260px;
  position: relative;
}
.focus-sprite:hover{
  transform: scale(1.1,1.1);
}
.focus-block {
  height: 100px;
  width: 100%;
}
.focus-menu {
  width: 256px;
  height: 320px;
  background-image: url('/assets/hudSprites/focusStats.png');
  position: absolute;
  top: -310px;
  left: 300px;
}
.focus-menu-container {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.focus-stats {
  display: flex;
  width: 100%;
}
.stat-column {
  width: 50%;
  align-items: center;
}
.effects-container{
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
.sprite {
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.sm-sprite {
  width: 14px;
  height: 10px;
  cursor: pointer;
}
.sm-sprite:hover {
  transform: scale(1.1,1.1);
}
.arrows, .stat-column {
  display: flex;
  flex-direction: column;
}
.stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
  background-image: url('/assets/hudSprites/statBackground.png');
  height: 28px;
}
.stat-inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 4px;
  align-items: center;
}
.up-arrow {
  background-image: url('/assets/hudSprites/statUpIcon.png');
}
.down-arrow {
  background-image: url('/assets/hudSprites/statDownIcon.png');
}
.brn {
  background-image: url('/assets/hudSprites/brnIconInactive.png');
}
.frz {
  background-image: url('/assets/hudSprites/frzIconInactive.png');
}
.cur {
  background-image: url('/assets/hudSprites/curIconInactive.png');
}
.con {
  background-image: url('/assets/hudSprites/conIconInactive.png');
}
.psn {
  background-image: url('/assets/hudSprites/psnIconInactive.png');
}
.bnd {
  background-image: url('/assets/hudSprites/bndIconInactive.png');
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
