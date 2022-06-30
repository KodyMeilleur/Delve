<template>
  <div class="focus-ui unselectable"
  >
  <div class="focus-sprite" v-on:click="toggle"></div>
  <div class="focus-menu" v-if="expanded">
    <div class="close-sprite" v-on:click="toggle"></div>
    <div class="focus-menu-container">
      <div class="hp stat">
        <div class="stat-inner">
          <div class="stat-text">HP</div>
          <div class="stat-box stat-number">{{currentTurn.hp}}</div>
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
              <div class="stat-text">MGT</div>
              <div class="stat-box stat-number">{{currentTurn.might}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="tough stat">
            <div class="stat-inner">
              <div class="stat-text">TGH</div>
              <div class="stat-box stat-number">{{currentTurn.toughness}}</div>
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
              <div class="stat-text">INT</div>
              <div class="stat-box stat-number">{{currentTurn.intelligence}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
          <div class="arc stat">
            <div class="stat-inner">
              <div class="stat-text">ARC&nbsp;</div>
              <div class="stat-box stat-number">{{currentTurn.arcana}}</div>
              <div class="arrows">
                <div class="up-arrow sm-sprite"></div>
                <div class="down-arrow sm-sprite"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pts pt-stat">
          <div class="stat-inner">
            <div class="stat-text">PTS</div>
            <div class="stat-box stat-number">{{currentTurn.pts}}</div>
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
          <span class="devotion-number">{{currentTurn.devotion.RED}} <span class="devotion-bonus">+({{calcDevotionBonus(currentTurn.devotion.RED)}})</span></span>
        </div>
        <div class="BLUE">
          <div class="discipline"
          v-if="currentTurn.discipline === 'BLUE'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('BLUE')"></div>
          <span class="devotion-number">{{currentTurn.devotion.BLUE}} <span class="devotion-bonus">+({{calcDevotionBonus(currentTurn.devotion.BLUE)}})</span></span>
        </div>
        <div class="GREEN">
          <div class="discipline"
          v-if="currentTurn.discipline === 'GREEN'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('GREEN')"></div>
          <span class="devotion-number">{{currentTurn.devotion.GREEN}} <span class="devotion-bonus">+({{calcDevotionBonus(currentTurn.devotion.GREEN)}})</span></span>
        </div>
        <div class="WHITE">
          <div class="discipline"
          v-if="currentTurn.discipline === 'WHITE'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('WHITE')"></div>
          <span class="devotion-number">{{currentTurn.devotion.WHITE}} <span class="devotion-bonus">+({{calcDevotionBonus(currentTurn.devotion.WHITE)}})</span></span>
        </div>
        <div class="BLACK">
          <div class="discipline"
          v-if="currentTurn.discipline === 'BLACK'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('BLACK')"></div>
          <span class="devotion-number">{{currentTurn.devotion.BLACK}} <span class="devotion-bonus">+({{calcDevotionBonus(currentTurn.devotion.BLACK)}})</span></span>
        </div>
        <div class="PURPLE">
          <div class="discipline"
          v-if="currentTurn.discipline === 'PURPLE'"
          v-bind:style="{
            'background-position': -(64 * currentFrame) + 'px'
          }"></div>
          <div class="sprite" v-on:click="setDevotion('PURPLE')"></div>
          <span class="devotion-number">{{currentTurn.devotion.PURPLE}} <span class="devotion-bonus">+({{calcDevotionBonus(currentTurn.devotion.PURPLE)}})</span></span>
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
    },
    calcDevotionBonus (devotion) {
      return Math.floor(devotion / 5);
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
  width: 286px;
  height: 384px;
  background-image: url('/assets/hudSprites/focusStats.png');
  position: absolute;
  top: -318px;
  left: 302px;
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
  margin-top: 40px;
}
.focus-devotion {
  height: 82px;
  width: 96%;
  display: flex;
  left: 9px;
  position: relative;
}
.focus-stats {
  display: flex;
  width: 100%;
  height: 108px;
  position: relative;
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
  width: 120px;
  background-image: url('/assets/hudSprites/statBackground.png');
  height: 28px;
}
.pt-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
  background-image: url('/assets/hudSprites/expBackground.png');
  height: 28px;
  position: absolute;
  bottom: 24px;
  left: 100px;
}
.hp {
  position: relative;
  left: 84px;
  top: 0px;
}
.stat-inner {
  display: flex;
  justify-content: space-evenly;
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
  left: 6px;
  white-space: nowrap;
  font-weight: 800;
  -webkit-text-stroke-color: black;
  font-size: 12px;
}
.devotion-bonus {
  font-size: 10px;
  top: -2px;
  position: relative;
  color: #98D12E;
}
.stat-text {
  font-weight: 800;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
.stat-number {
  font-weight: 800;
  -webkit-text-stroke-color: black;
}
</style>
