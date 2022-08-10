<template>
  <div class="spellbook-ui"
  >
  <div class="spellbook-sprite" v-on:click="toggle"></div>
  <div
  v-bind:class="{ 'battle-menu': isBattling}"
  class="spellbook-menu" v-if="expanded">
    <div class="close-sprite" v-on:click="toggle"></div>
    <div class="spell-tabs">
      <div
      v-for="type in spellTypes"
      v-on:click="filterSpells(type)"
      :key="type"
      :class="type + '-spell-type spell-type' + (type === filterString ? ' selected-type' : '')"
      >
      </div>
    </div>
    <div class="spells">
      <div
      class="spell-slot unselectable"
      v-for="spell in filteredSpellList" v-bind:key="spell.name"
      v-bind:class="{ 'selected': focusedSpell.name === spell.name}"
      v-on:click="focus(spell)">
        <div class="spell-text">
          <img
          :src="publicPath + spell.icon"
          class="spell-sprite-img"
          />
          <span class="spell-name">{{ spell.name }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { RED, BLUE, GREEN, BLACK, WHITE, PURPLE } from '../models/combatFields/combatFields';

export default {
  name: 'Spellbook',
  props: {
    allSpells: {
      type: Array,
      default: (() => [])
    }
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
      focusedSpell: {},
      currentFrame: 0,
      filterString: 'NEUTRAL'
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
      'sellPlayerItem',
    ]),
    toggle () {
      this.expanded = !this.expanded;
    },
    focus (spell) {
      if (this.focusedSpell.name == spell.name) {
        this.focusedSpell = {};
      } else {
        this.focusedSpell = spell;
      }
    },
    filterSpells (type) {
      this.filterString = type;
    },
    frameAdvance (frame) {
      if (frame % 2 === 0) {
        this.currentFrame = frame === 4 ? 1 : 0;
      }
    },
  },
  computed: {
    ...mapGetters('world', [
      'currentBattleTurn',
      'isBattling',
      'currentTurn',
    ]),
    filteredSpellList: function() {
      const entity = this.isBattling ? this.currentBattleTurn : this.currentTurn;
      if (entity.skills) {
        return entity.skills[this.filterString];
      }

      return [];
    },
    spellTypes: function() {
      return [
        'NEUTRAL',
        RED,
        BLUE,
        GREEN,
        WHITE,
        BLACK,
        PURPLE
      ]
    },
  },
  watch: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spellbook-ui {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}
.spellbook-sprite {
  background-image: url('/assets/hudSprites/spellBookIconAnimated.gif');
  width: 128px;
  height: 128px;
  cursor: pointer;
  position: absolute;
  right: -40px;
  z-index: 4;
  top: -60px;
}
.spellbook-sprite:hover, .close-sprite:hover, .spell-type:hover {
  transform: scale(1.1,1.1);
  cursor: pointer;
}
.spellbook-sprite:hover {
  background-image: url('/assets/hudSprites/spellBookIconAnimated2.gif');
}
.spellbook-menu {
  width: 256px;
  height: 384px;
  background-image: url('/assets/hudSprites/spellBookBackground.png');
  position: absolute;
  top: -412px;
  left: -478px;
  animation: createBox .25s;
}
.spellbook-menu.battle-menu {
  top: -455px;
  left: -436px;
}
@keyframes createBox {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
.spell-tabs {
  display: flex;
  position: absolute;
  top: 37px;
  left: 15px;
}
.spell-type {
  width: 32px;
  height: 25px;
}
.selected-type {
  filter: grayscale(100);
  transform: scale(0.9, 0.9);
}
.NEUTRAL-spell-type {
  background-image: url('/assets/hudSprites/spellPageNeutral.png');
}
.RED-spell-type {
  background-image: url('/assets/hudSprites/spellPageRed.png');
}
.BLUE-spell-type {
  background-image: url('/assets/hudSprites/spellPageBlue.png');
}
.GREEN-spell-type {
  background-image: url('/assets/hudSprites/spellPageGreen.png');
}
.WHITE-spell-type {
  background-image: url('/assets/hudSprites/spellPageWhite.png');
}
.BLACK-spell-type {
  background-image: url('/assets/hudSprites/spellPageBlack.png');
}
.PURPLE-spell-type {
  background-image: url('/assets/hudSprites/spellPagePurple.png');
}
.spell-text {
  display: relative;
  width: 100%;
  height: 35px;
}
.spell-sprite-img {
  left: 12px;
  position: absolute;
}
.spell-slot {
  width: 95%;
  height: 50px;
  background-image: url('/assets/hudSprites/spellSlot.png');
  cursor: pointer;
  font-variant: small-caps;
  font-family: system-ui;
  font-size: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}
.spell-slot:hover {
  background-image: url('/assets/hudSprites/hoverSpellSlot.png');
}
.spell-slot.selected {
  background-image: url('/assets/hudSprites/hoverSpellSlot.png');
}
.spells {
  position: absolute;
  left: 12px;
  top: 70px;
  height: 300px;
  width: 100%;
  overflow-y: scroll;
}
.spell-description {
  line-break: strict;
  position: absolute;
  width: 93px;
  top: 95px;
  font-size: 8px;
  font-weight: 700;
  left: 18px;
}
.spell-name {
  overflow: hidden;
  white-space: nowrap;
  font-size: 9px;
  text-overflow: ellipsis;
  padding: 3px;
  width: 100%;
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

.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
