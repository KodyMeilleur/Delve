<template>
  <div
  class="battle-controls-ui unselectable">
  <div class="battle-controls-internal">
    <div
    v-on:click="cycleTurn"
    v-if="!isMonsterTurn"
    class="battle-end-turn-btn">
    </div>
    <div v-if="isMonsterTurn" class="battle-end-turn-btn-inactive">
    </div>
    <div
    class="battle-turn-stats"
    >
      <div class="stat-container text-style">
        <div class="health-points"><span class="health-icon"></span> {{ entity.hp }} </div>
        <div class="action-points"><span class="mp-sprite"></span> {{ entity.movement }} </div>
        <div class="movement-points"><span class="ap-sprite"></span>{{ entity.ap }}</div>
      </div>
    </div>
    <div class="battle-skills">
      <Skill v-for="(n, i) in 9" :key="n + i" :skill="lastPlayerHeldSkills[i]" :number="i" :heldMana="entity.heldMana" :ap="entity.ap"/>
    </div>
    <div class="mana-totals text-style">
      <div class="RED">
        <div class="discipline" v-if="entity.discipline === 'RED'"
        v-bind:style="{
          'background-position': (64 * currentFrame) + 'px'
        }"></div>
        <div class="sprite"></div>
        <div
        v-bind:class="{ 'grow': showREDChange}"
        class="damage-number text-style"> {{symbol(lastManaGainedRED)}} {{ lastManaGainedRED }}
        </div>
        {{entity.heldMana.RED}}
      </div>
      <div class="BLUE">
        <div class="discipline" v-if="entity.discipline === 'BLUE'"
        v-bind:style="{
          'background-position': (64 * currentFrame) + 'px'
        }"></div>
        <div class="sprite"></div>
        <div
        v-bind:class="{ 'grow': showBLUEChange}"
        class="damage-number text-style"> {{symbol(lastManaGainedBLUE)}} {{ lastManaGainedBLUE }}
        </div>
        {{entity.heldMana.BLUE}}
      </div>
      <div class="GREEN">
        <div class="discipline" v-if="entity.discipline === 'GREEN'"
        v-bind:style="{
          'background-position': (64 * currentFrame) + 'px'
        }"></div>
        <div class="sprite"></div>
        <div
        v-bind:class="{ 'grow': showGREENChange}"
        class="damage-number text-style"> {{symbol(lastManaGainedGREEN)}} {{ lastManaGainedGREEN }}
        </div>
        {{entity.heldMana.GREEN}}
      </div>
      <div class="WHITE">
        <div class="discipline" v-if="entity.discipline === 'WHITE'"
        v-bind:style="{
          'background-position': (64 * currentFrame) + 'px'
        }"></div>
        <div class="sprite"></div>
        <div
        v-bind:class="{ 'grow': showWHITEChange}"
        class="damage-number text-style"> {{symbol(lastManaGainedWHITE)}} {{ lastManaGainedWHITE }}
        </div>
        {{entity.heldMana.WHITE}}
      </div>
      <div class="BLACK">
        <div class="discipline" v-if="entity.discipline === 'BLACK'"
        v-bind:style="{
          'background-position': (64 * currentFrame) + 'px'
        }"></div>
        <div class="sprite"></div>
        <div
        v-bind:class="{ 'grow': showBLACKChange}"
        class="damage-number text-style"> {{symbol(lastManaGainedBLACK)}} {{ lastManaGainedBLACK }}
        </div>
        {{entity.heldMana.BLACK}}
      </div>
      <div class="PURPLE">
        <div class="discipline" v-if="entity.discipline === 'PURPLE'"
        v-bind:style="{
          'background-position': (64 * currentFrame) + 'px'
        }"></div>
        <div class="sprite"></div>
        <div
        v-bind:class="{ 'grow': showPURPLEChange}"
        class="damage-number text-style"> {{symbol(lastManaGainedPURPLE)}} {{ lastManaGainedPURPLE }}
        </div>
        {{entity.heldMana.PURPLE}}
      </div>
    </div>
  </div>
  </div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import Skill from './Skill.vue';

export default {
  name: 'BattleControls',
  props: {
    entity: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  components: {
    Skill,
  },
  data () {
    return {
      lastPlayerTurnHeldMana: null,
      lastPlayerHeldSkills: [],
      currentFrame: 0,
      lastManaGainedRED: 0,
      lastManaGainedBLACK: 0,
      lastManaGainedWHITE: 0,
      lastManaGainedBLUE: 0,
      lastManaGainedGREEN: 0,
      lastManaGainedPURPLE: 0,
      showREDChange: false,
      showBLACKChange: false,
      showWHITEChange: false,
      showBLUEChange: false,
      showGREENChange: false,
      showPURPLEChange: false,
    }
  },
  mounted () {
    this.$root.$on('frameBump', this.frameAdvance);
    this.$root.$on('manaGain', this.manaGain);
    if (this.entity && this.entity.isPlayer) {
      this.lastPlayerTurnHeldMana = this.entity.heldMana;
      this.lastPlayerHeldSkills = this.entity.equippedSkills;
    }
  },
  beforeDestroy() {
    this.$root.$off('frameBump', this.frameAdvance);
    this.$root.$off('manaGain', this.manaGain);
  },
  methods: {
    ...mapMutations('world', [
      'clearFocusedEntity'
    ]),
    cycleTurn () {
      this.clearFocusedEntity();
      this.$emit('cycleBattleTurn');
    },
    manaGain (gains) {
      this.lastManaGainedRED = gains['RED'];
      this.lastManaGainedBLACK = gains['BLACK'];
      this.lastManaGainedWHITE = gains['WHITE'];
      this.lastManaGainedBLUE = gains['BLUE'];
      this.lastManaGainedGREEN = gains['GREEN'];
      this.lastManaGainedPURPLE = gains['PURPLE'];
    },
    frameAdvance (frame) {
      if (frame % 4 === 0) {
        if (this.currentFrame === 4) {
          this.currentFrame = 0;
        } else {
          this.currentFrame++;
        }
      }
    },
    symbol (num) {
      return num >=0 ? '+' : '-';
    }
  },
  watch: {
    'entity': {
      handler (entity) {
        if (entity && entity.isPlayer) {
          this.lastPlayerTurnHeldMana = entity.heldMana;
          this.lastPlayerHeldSkills = entity.equippedSkills;
        }
      },
       deep: false
     },
     'lastManaGainedRED': {
       handler (val) {
         if (val) {
           const that = this;
           that.showREDChange = true;
           setTimeout(() => {
             that.showREDChange = false;
             that.lastManaGainedRED = 0;
           }, 250);
         }
       }
     },
     'lastManaGainedBLACK': {
       handler (val) {
         if (val) {
           const that = this;
           that.showBLACKChange = true;
           setTimeout(() => {
             that.showBLACKChange = false;
             that.lastManaGainedBLACK = 0;
           }, 250);
         }
       }
     },
     'lastManaGainedWHITE': {
       handler (val) {
         if (val) {
           const that = this;
           that.showWHITEChange = true;
           setTimeout(() => {
             that.showWHITEChange = false;
             that.lastManaGainedWHITE = 0;
           }, 250);
         }
       }
     },
     'lastManaGainedBLUE': {
       handler (val) {
         if (val) {
           const that = this;
           that.showREDChange = true;
           setTimeout(() => {
             that.showBLUEChange = false;
             that.lastManaGainedBLUE = 0;
           }, 250);
         }
       }
     },
     'lastManaGainedGREEN': {
       handler (val) {
         if (val) {
           const that = this;
           that.showGREENChange = true;
           setTimeout(() => {
             that.showGREENChange = false;
             that.lastManaGainedGREEN = 0;
           }, 250);
         }
       }
     },
     'lastManaGainedPURPLE': {
       handler (val) {
         if (val) {
           const that = this;
           that.showPURPLEChange = true;
           setTimeout(() => {
             that.showPURPLEChange = false;
             that.lastManaGainedPURPLE = 0;
           }, 250);
         }
       }
     },
  },
  computed: {
    ...mapGetters('world', [
      'logs',
      'currentTurn',
      'isMonsterTurn'
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.battle-controls-ui {
  position: absolute;
  left: 64px;
  bottom: 0px;
  width: 768px;
  height: 128px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/battlePlayerControls.png');
}
.battle-end-turn-btn {
  position: absolute;
  left: 18px;
  bottom: 18px;
  width: 91px;
  height: 91px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/endTurnIcon2.png');
}
.battle-end-turn-btn-inactive {
  position: absolute;
  left: 18px;
  bottom: 18px;
  width: 91px;
  height: 91px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/endTurnIcon2Inactive.png');
}
.battle-end-turn-btn:hover {
  transform: scale(1.1,1.1);
  cursor: pointer;
}
.battle-turn-stats {
  width: 64px;
  height: 96px;
  background-image: url('/assets/hudSprites/turnStats.png');
  position: absolute;
  left: 124px;
  top: 15px;
}
.stat-container {

}
.battle-skills {
  display: flex;
  justify-content: space-evenly;
  width: 400px;
  position: absolute;
  left: 195px;
  top: 22px;
}
.mana-totals {
  display: flex;
  justify-content: space-evenly;
  width: 440px;
  position: absolute;
  bottom: 26px;
  left: 196px;
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
.RED, .BLUE, .GREEN, .WHITE, .BLACK, .PURPLE {
  position: relative;
}
.RED .sprite:hover, .BLUE .sprite:hover, .GREEN .sprite:hover, .WHITE .sprite:hover, .BLACK .sprite:hover, .PURPLE .sprite:hover {
  transform: scale(1.1,1.1);
}
.RED .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  left: -39px;
  top: -4px;
  background-image: url('/assets/hudSprites/redManaIcon.png');
}
.BLUE .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  left: -39px;
  top: -4px;
  background-image: url('/assets/hudSprites/blueManaIcon.png');
}
.GREEN .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  left: -39px;
  top: -4px;
  background-image: url('/assets/hudSprites/greenManaIcon.png');
}
.WHITE .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  left: -40px;
  top: -4px;
  background-image: url('/assets/hudSprites/whiteManaIcon.png');
}
.BLACK .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  left: -40px;
  top: -4px;
  background-image: url('/assets/hudSprites/blackManaIcon.png');
}
.PURPLE .sprite {
  width: 32px;
  height: 32px;
  position: absolute;
  left: -41px;
  top: -4px;
  background-image: url('/assets/hudSprites/purpleManaIcon.png');
}
.health-icon {
  background-image: url('/assets/hudSprites/healthIcon.png');
  width: 19px;
  height: 14px;
  margin-right: 3px;
}
.mp-sprite {
  background-image: url('/assets/hudSprites/mpIcon.png');
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
.ap-sprite {
  background-image: url('/assets/hudSprites/apIcon.png');
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
.health-points, .action-points, .movement-points {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.stat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-evenly;
}
.discipline {
  width: 64px;
  height: 64px;
  position: absolute;
  background-image: url('/assets/hudSprites/disciplineSelected.png');
  top: -53px;
  left: -55px;
  pointer-events: none;
}
.text-style {
  font-weight: 800;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
.damage-number {
  position: absolute;
  top: -20px;
  left: -28px;
  opacity: 0;
}
.grow {
  animation: grow .5s;
  animation-direction: alternate;
  /* animation-delay: 1s; */
}
@keyframes grow{
  0%{
    opacity: 1;
    transform: scale(1);
    top: -16px;
  }
  50%{
    opacity: 0.5;
    transform: scale(5);
  }
  100%{
    /* display: none; */
    opacity: 0;
    top: -46px;
    transform: scale(0);
  }
}
</style>
