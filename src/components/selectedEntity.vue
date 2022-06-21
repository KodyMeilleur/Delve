<template>
  <div class="entity-ui"
  >
  <div v-if="focusedEntity">
    <div class="entity-info" v-bind:class="{ filled: focusedEntity}" v-if="focusedEntity.isTile">
      <span class="info-row info-row-name">{{ (focusedEntity.event && '???' || (focusedEntity.structure && focusedEntity.structure.eventStructure) && '???') || (focusedEntity.structure && focusedEntity.structure.name) || focusedEntity.name }}</span>
      <span class="info-row info-row-tier">
        <div v-if="focusedEntity.structure" class="tier-container">
          <div v-for="n in focusedEntity.structure.tier" :key="n" class="tier-star"></div>
        </div>
        <div v-if="focusedEntity.structure && focusedEntity.structure.mpCost < 99" class="mp-container">
          <div v-for="n in focusedEntity.structure.mpCost" :key="n" class="mp-sprite"></div>
        </div>
        <div v-if="!focusedEntity.structure && focusedEntity.mpCost < 99" class="mp-container">
          <div v-for="n in focusedEntity.mpCost" :key="n" class="mp-sprite"></div>
        </div>
      </span>
      <span v-if="!isBattling" class="action-container">
        <div style="display: flex;" v-if="focusedEntity.structure">
          <div class="explore-container">
            <div
            v-on:click="exploreStructure"
            v-bind:class="{ 'explore-sprite': inArea === true}"
            >
          </div>
            <div v-if="focusedEntity.x !== currentTurn.x || focusedEntity.y !== currentTurn.y" class="explore-sprite-inactive"></div>
          </div>
          <div class="nurture-container" v-if="focusedEntity.structure">
            <div
            v-bind:class="{ 'nurture-sprite': inArea === true && this.focusedEntity.structure.explored}"
            >
            </div>
            <div v-if="focusedEntity.x !== currentTurn.x || focusedEntity.y !== currentTurn.y || focusedEntity.structure.explored === false" class="nurture-sprite-inactive"></div>
          </div>
          <div class="exploit-container" v-if="focusedEntity.structure">
            <div
            v-on:click="demolish(focusedEntity.structure)"
            v-bind:class="{ 'exploit-sprite': inArea === true && this.focusedEntity.structure.explored && this.focusedEntity.structure.demolished === false}"
            >
            </div>
            <div v-if="focusedEntity.x !== currentTurn.x || focusedEntity.y !== currentTurn.y || focusedEntity.structure.explored === false" class="exploit-sprite-inactive"></div>
          </div>
        </div>
        <div style="display:flex" v-if="focusedEntity.structure && focusedEntity.structure.category === 'Dwelling'">
          <div class="tour-container">
            <div
            v-on:click="tourStructure"
            v-bind:class="{ 'tour-sprite': inArea === true}"
            >
            </div>
            <div v-if="focusedEntity.x !== currentTurn.x || focusedEntity.y !== currentTurn.y" class="tour-sprite-inactive"></div>
          </div>
        </div>
      </span>
      <div
      v-if="isBattling && !focusedEntity.isCreature"
      class="battle-tile-mana"
      >
      <div class="first-mana-container"><div :class="`${focusedEntity.manaTypeSlotOne}-mana-type mana-icon`"></div>x {{focusedEntity.manaValueSlotOne}}</div>
      <div class="second-mana-container"><div :class="`${focusedEntity.manaTypeSlotTwo}-mana-type mana-icon`"></div>x {{focusedEntity.manaValueSlotTwo}}</div>
      </div>
    </div>
    <div v-if="focusedEntity.isCreature" class="entity-info" v-bind:class="{ filled: focusedEntity}">
      <span class="info-row info-row-name">{{ focusedEntity.name }}</span>
      <span class="info-row-health"><span class="info-row health-icon"></span>{{ focusedEntity.hp }} / {{ focusedEntity.maxHp }}</span>
      <span class="info-row-mp"><span class="info-row mp-sprite"></span>{{ focusedEntity.maxMovement }}</span>
      <span class="info-row-str"><span class="info-row str-sprite"></span>{{ focusedEntity.might }}</span>
      <span class="info-row-def"><span class="info-row def-sprite"></span>{{ focusedEntity.toughness }}</span>
      <span class="info-row-int"><span class="info-row int-sprite"></span>{{ focusedEntity.intelligence }}</span>
      <span class="info-row-arc"><span class="info-row arc-sprite"></span>{{ focusedEntity.arcana }}</span>
      <div class="btn-action-container">
        <span class="swap-focus-container">
          <div
          v-on:click="switchFocus"
          class="swap-focus-sprite"></div>
        </span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SelectedEntity',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntityOverride',
      'setStructureExplored',
      'setIsBattling',
      'demolishStructure',
      'setScroll',
    ]),
    switchFocus () {
      if (this.isBattling) {
        this.setfocusedEntityOverride(this.focusedEntity.inworldTileOccupied);
      } else {
        this.setfocusedEntityOverride(this.currentTurn.outworldTileOccupied);
      }
    },
    exploreStructure () {
      this.setStructureExplored(this.focusedEntity);
      this.setIsBattling({state: true, battleTile: this.focusedEntity});
      this.$root.$emit('resetScreenPosition');
      this.setScroll({scrollLeft: 0, scrollTop: 0});
      this.setfocusedEntityOverride(null);
      // TODO: hook loot after combat
      // this.$root.$emit('lootAdded', this.focusedEntity.structure && this.focusedEntity.structure.loot || []);
    },
    tourStructure () {
      this.$root.$emit('dwellingEntered', this.focusedEntity.structure.dwelling);
    },
    demolish (structure) {
      this.demolishStructure(structure);
      this.$root.$emit('lootAdded', this.focusedEntity.structure && this.focusedEntity.structure.demolishLoot || []);
    },
  },
  computed: {
    ...mapGetters('world', [
      'focusedEntity',
      'currentTurn',
      'isBattling',
    ]),
    inArea: function() {
      return this.focusedEntity && this.currentTurn && this.focusedEntity.x === this.currentTurn.x && this.focusedEntity.y === this.currentTurn.y;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-action-container {
  display: flex;
}
.entity-ui {
  position: sticky;
  top: 64px;
  left: 620px;
  float: right;
  width: 196px;
  height: 128px;
  background-color: transparent;
  z-index: 11;
  margin-right: 69px;
  pointer-events: none;
}
.entity-info.filled {
  background-image: url('/assets/hudSprites/tileInfo.png');
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  font-weight: 800;
  font-variant: small-caps;
  font-family: system-ui;
  pointer-events: all;
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
.battle-tile-mana {
  position: absolute;
  height: 64px;
  width: 128px;
  bottom: 0;
  display: flex;
  align-items: center;
  font-size: 13px;
}
.first-mana-container {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.second-mana-container {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.empty-mana-type {
  background-image: url('/assets/hudSprites/neutralManaIcon.png');
}
.mana-icon {
  width: 32px;
  height: 32px;
}
.entity-info {
  color: white;
  font-size: 8px;
  width: 196px;
  height: 128px;
  position: absolute;
  top: -32px;
  left: 32px;
  display: flex;
  justify-content: center;
}
.info-row {
  display: block;
}
.tier-container {
  top: 36px;
  left: 10px;
  position: absolute;
}
.mp-container {
  position: absolute;
  top: 36px;
  left: 102px;
  display: flex;
  width: 90px;
  height: 50px;
}
.action-container {
  position: absolute;
  top: 78px;
  left: 8px;
  display: flex;
}
.tier-star {
  background-image: url('/assets/hudSprites/tierStar.png');
  width: 14px;
  height: 14px;
}
.info-row-health {
  position: absolute;
  top: 15px;
  right: 42px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-en {
  position: absolute;
  top: 36px;
  left: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-str {
  position: absolute;
  top: 36px;
  left: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-def {
  position: absolute;
  top: 36px;
  left: 50px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-mp {
  position: absolute;
  top: 15px;
  right: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-int {
  position: absolute;
  top: 55px;
  left: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-arc {
  position: absolute;
  top: 55px;
  left: 50px;
  font-size: 12px;
  display: flex;
  align-items: center;
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
.en-sprite {
  background-image: url('/assets/hudSprites/enIcon.png');
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
.def-sprite {
  background-image: url('/assets/hudSprites/defIcon.png');
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
.int-sprite {
  background-image: url('/assets/hudSprites/intIcon.png');
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
.arc-sprite {
  background-image: url('/assets/hudSprites/wisIcon.png');
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
.info-row-mp > .mp-sprite {
  margin-right: 3px;
}
.str-sprite {
  background-image: url('/assets/hudSprites/strengthIcon.png');
  width: 14px;
  height: 14px;
  margin-right: 3px;
}
.explore-sprite {
  background-image: url('/assets/hudSprites/exploreIconSleep.png');
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.explore-text {
  display: none;
}
.explore-sprite:hover:before {
  display: block;
  content: "Explore";
  -webkit-text-stroke-width: 0px;
  font-weight: 700;
  font-size: 9px;
}
.explore-sprite:hover {
  background-image: url('/assets/hudSprites/exploreIcon.png');
  transform: scale(1.1, 1.1);
}
.tour-sprite {
  background-image: url('/assets/hudSprites/tourIconSleep.png');
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.tour-sprite-inactive {
  background-image: url('/assets/hudSprites/tourIconInactive.png');
  width: 32px;
  height: 32px;
}
.tour-sprite:hover {
  background-image: url('/assets/hudSprites/tourIcon.png');
  transform: scale(1.1, 1.1);
}
.tour-sprite:hover:before {
  display: block;
  content: "Tour";
  -webkit-text-stroke-width: 0px;
  font-weight: 700;
  font-size: 9px;
}
.swap-focus-container {
  position: absolute;
  top: 78px;
  right: 8px;
}
.explore-sprite-inactive {
  background-image: url('/assets/hudSprites/exploreIconInactive.png');
  width: 32px;
  height: 32px;
}
.nurture-sprite {
  background-image: url('/assets/hudSprites/nurtureIconSleep.png');
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.nurture-sprite-inactive {
  background-image: url('/assets/hudSprites/nurtureIconInactive.png');
  width: 32px;
  height: 32px;
}
.exploit-sprite {
  background-image: url('/assets/hudSprites/demolishIconSleep.png');
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.exploit-sprite-inactive {
  background-image: url('/assets/hudSprites/demolishIconInactive.png');
  width: 32px;
  height: 32px;
}
.exploit-sprite:hover {
  transform: scale(1.1,1.1);
  background-image: url('/assets/hudSprites/demolishIcon.png');
}
.nurture-sprite:hover {
  transform: scale(1.1,1.1);
  background-image: url('/assets/hudSprites/nurtureIcon.png');
}
.nurture-sprite:hover:before {
  display: block;
  content: "Nurture";
  -webkit-text-stroke-width: 0px;
  font-weight: 700;
  font-size: 9px;
}
.exploit-sprite:hover:before {
  display: block;
  content: "Exploit";
  -webkit-text-stroke-width: 0px;
  font-weight: 700;
  font-size: 9px;
}
.swap-focus-sprite {
  background-image: url('/assets/hudSprites/swapFocus.png');
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.swap-focus-sprite:hover {
  transform: scale(1.1,1.1);
}
.swap-focus-sprite:hover:before {
  display: block;
  content: "Tile View";
  -webkit-text-stroke-width: 0px;
  font-weight: 700;
  font-size: 9px;
  white-space: nowrap;
  left: -3px;
  position: relative;
}
.info-row-name {
  position: absolute;
  top: 9px;
  left: 12px;
  font-size: 18px;
}
</style>
