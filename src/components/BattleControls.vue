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
    <div class="battle-skills">
      <Skill v-for="(n, i) in 9" :key="n + i" :skill="lastPlayerHeldSkills[i]" :number="i"/>
    </div>
    <div class="mana-totals text-style">
      <div class="RED"><div class="sprite"></div>{{entity.heldMana.RED}}</div>
      <div class="BLUE"><div class="sprite"></div>{{entity.heldMana.BLUE}}</div>
      <div class="GREEN"><div class="sprite"></div>{{entity.heldMana.GREEN}}</div>
      <div class="WHITE"><div class="sprite"></div>{{entity.heldMana.WHITE}}</div>
      <div class="BLACK"><div class="sprite"></div>{{entity.heldMana.BLACK}}</div>
      <div class="PURPLE"><div class="sprite"></div>{{entity.heldMana.PURPLE}}</div>
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
    entity: Object
  },
  components: {
    Skill,
  },
  data () {
    return {
      lastPlayerTurnHeldMana: null,
      lastPlayerHeldSkills: [],
    }
  },
  mounted () {
    if (this.entity.isPlayer) {
      this.lastPlayerTurnHeldMana = this.entity.heldMana;
      this.lastPlayerHeldSkills = this.entity.equippedSkills;
    }
  },
  methods: {
    ...mapMutations('world', [
      'cycleBattleTurn',
      'clearFocusedEntity'
    ]),
    cycleTurn () {
      this.clearFocusedEntity();
      this.cycleBattleTurn();
    }
  },
  watch: {
    'entity': {
      handler (entity) {
        if (entity.isPlayer) {
          this.lastPlayerTurnHeldMana = entity.heldMana;
          this.lastPlayerHeldSkills = entity.equippedSkills;
        }
      },
       deep: false
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
</style>
