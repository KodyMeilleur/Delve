<template>
  <div
  class="battle-controls-ui unselectable">
  <div class="battle-controls-internal">
    <div class="battle-end-turn-btn"></div>
    <div class="mana-totals text-style">
      <div class="RED">{{entity.heldMana.RED}}</div>
      <div class="BLUE">{{entity.heldMana.BLUE}}</div>
      <div class="GREEN">{{entity.heldMana.GREEN}}</div>
      <div class="WHITE">{{entity.heldMana.WHITE}}</div>
      <div class="BLACK">{{entity.heldMana.BLACK}}</div>
      <div class="PURPLE">{{entity.heldMana.PURPLE}}</div>
    </div>
  </div>
  </div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'BattleControls',
  props: {
    entity: Object
  },
  data () {
    return {
      currentPlayerTurnHeldMana: null,
    }
  },
  methods: {
    ...mapMutations('world', []),
  },
  watch: {
    'entity': {
      handler (entity) {
        console.log(entity);
        if (entity.isPlayer) {
          this.currentPlayerTurnHeldMana = entity.heldMana;
        }
      },
       deep: false
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
.battle-end-turn-btn:hover {
  transform: scale(1.1,1.1);
  cursor: pointer;
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
</style>
