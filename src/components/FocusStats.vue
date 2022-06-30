<template>
  <div class="focus-ui unselectable"
  >
  <div class="focus-sprite" v-on:click="toggle"></div>
  <div class="focus-menu" v-if="expanded">
    <div class="close-sprite" v-on:click="toggle"></div>
    <div class="focus-menu-container">
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
      <div class="focus-stats focus-block">
        <div class="stat-column">
          <div class="might stat">
            <div class="stat-inner">
              <div>MT</div>
              <div class="stat-box">{{currentTurn.might}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="tough stat">
            <div class="stat-inner">
              <div>TGH</div>
              <div class="stat-box">{{currentTurn.toughness}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="stat-column">
          <div class="int stat">
            <div class="stat-inner">
              <div>INT</div>
              <div class="stat-box">{{currentTurn.intelligence}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="arc stat">
            <div class="stat-inner">
              <div>ARC&nbsp;</div>
              <div class="stat-box">{{currentTurn.arcana}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="focus-devotion focus-block">
        <div class="RED">
          <div class="discipline"
          v-if="currentTurn.discipline === 'RED'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('RED')"></div>
          <span class="devotion-number">{{currentTurn.devotion.RED}}</span>
        </div>
        <div class="BLUE">
          <div class="discipline"
          v-if="currentTurn.discipline === 'BLUE'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('BLUE')"></div>
          <span class="devotion-number">{{currentTurn.devotion.BLUE}}</span>
        </div>
        <div class="GREEN">
          <div class="discipline"
          v-if="currentTurn.discipline === 'GREEN'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('GREEN')"></div>
          <span class="devotion-number">{{currentTurn.devotion.GREEN}}</span>
        </div>
        <div class="WHITE">
          <div class="discipline"
          v-if="currentTurn.discipline === 'WHITE'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('WHITE')"></div>
          <span class="devotion-number">{{currentTurn.devotion.WHITE}}</span>
        </div>
        <div class="BLACK">
          <div class="discipline"
          v-if="currentTurn.discipline === 'BLACK'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('BLACK')"></div>
          <span class="devotion-number">{{currentTurn.devotion.BLACK}}</span>
        </div>
        <div class="PURPLE">
          <div class="discipline"
          v-if="currentTurn.discipline === 'PURPLE'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('PURPLE')"></div>
          <span class="devotion-number">{{currentTurn.devotion.PURPLE}}</span>
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
      currentFrame: 0,
    }
  },
  mounted: function() {
    this.$root.$on('frameBump', this.frameAdvance);
  },
  beforeDestroy() {
    this.$root.$off('frameBump', this.frameAdvance);
  },
  methods: {
    ...mapMutations('world', [
      'setLogFilter',
      'setPlayerDevotion',
    ]),
    toggle () {
      this.expanded = !this.expanded;
    },
    frameAdvance (frame) {
      if (frame % 2 === 0) {
        this.currentFrame = frame === 4 ? 1 : 0;
      }
    },
    setDevotion (color) {
      this.setPlayerDevotion(color);
    }
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
  height: 64px;
  width: 100%;
}
.focus-menu {
  width: 256px;
  height: 320px;
  background-image: url('/assets/hudSprites/focusStats.png');
  position: absolute;
  top: -260px;
  left: 333px;
  animation: createBox .25s;
}
@keyframes createBox {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.focus-menu-container {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.focus-devotion {
  height: 82px;
  width: 100%;
  display: flex;
  left: 5px;
  position: relative;
}
.focus-stats {
  display: flex;
  width: 100%;
  height: 74px;
}
.stat-column {
  width: 50%;
  align-items: center;
}
.effects-container{
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 32px;
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
.hp {
  position: relative;
  left: 87px;
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
.close-sprite {
  background-image: url('/assets/hudSprites/closeIcon.png');
  width: 14px;
  height: 14px;
  position: absolute;
  top: -1px;
  right: 0px;
  cursor: pointer;
}
.close-sprite:hover {
  transform: scale(1.1,1.1);
}
.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.RED, .BLUE, .GREEN, .WHITE, .BLACK, .PURPLE {
  position: relative;
  width: 64px;
  height: 64px;
  top: 10px;
}
.RED .sprite:hover, .BLUE .sprite:hover, .GREEN .sprite:hover, .WHITE .sprite:hover, .BLACK .sprite:hover, .PURPLE .sprite:hover {
  transform: scale(1.1,1.1);
  background-color: #fff;
  border-radius: 12px;
}
.RED .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  background-image: url('/assets/hudSprites/redManaIcon.png');
}
.BLUE .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  background-image: url('/assets/hudSprites/blueManaIcon.png');
}
.GREEN .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  background-image: url('/assets/hudSprites/greenManaIcon.png');
}
.WHITE .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  background-image: url('/assets/hudSprites/whiteManaIcon.png');
}
.BLACK .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  background-image: url('/assets/hudSprites/blackManaIcon.png');
}
.PURPLE .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  background-image: url('/assets/hudSprites/purpleManaIcon.png');
}
.discipline {
  width: 64px;
  height: 64px;
  position: absolute;
  background-image: url('/assets/hudSprites/disciplineSelected.png');
  pointer-events: none;
  top: -48px;
  left: -16px;
}
.devotion-number {
  position: absolute;
  top: 32px;
  left: 12px;
}
</style>
