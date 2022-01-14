<template>
  <div class="entity-ui"
    v-bind:class="{ filled: focusedEntity}"
  >
  <div v-if="focusedEntity && focusedEntity.isTile" class="entity-info">
    <span class="info-row info-row-name">{{ (focusedEntity.structure && focusedEntity.structure.name) || focusedEntity.name }}</span>
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
    <span class="action-container">
      <div style="display: flex;" v-if="focusedEntity.structure && focusedEntity.structure.category === 'Wild' || !focusedEntity.structure">
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
          v-bind:class="{ 'exploit-sprite': inArea === true && this.focusedEntity.structure.explored}"
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
  </div>
  <div v-if="focusedEntity && focusedEntity.isCreature" class="entity-info">
    <span class="info-row info-row-name">{{ focusedEntity.name }}</span>
    <span class="info-row-health"><span class="info-row health-icon"></span>{{ focusedEntity.hp }}</span>
    <span class="info-row-en"><span class="info-row en-sprite"></span>{{ focusedEntity.en }}</span>
    <span class="info-row-mp"><span class="info-row mp-sprite"></span>{{ focusedEntity.mp }}</span>
    <span class="info-row-str"><span class="info-row str-sprite"></span>{{ focusedEntity.str }}</span>
    <span class="info-row-def"><span class="info-row def-sprite"></span>{{ focusedEntity.def }}</span>
    <span class="info-row-int"><span class="info-row int-sprite"></span>{{ focusedEntity.int }}</span>
    <span class="info-row-wis"><span class="info-row wis-sprite"></span>{{ focusedEntity.wis }}</span>
    <div class="btn-action-container">
      <span class="swap-focus-container">
        <div
        v-on:click="switchFocus"
        class="swap-focus-sprite"></div>
      </span>
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
    ]),
    switchFocus () {
      this.setfocusedEntityOverride(this.currentTurn.outworldTileOccupied);
    },
    exploreStructure () {
      this.setStructureExplored(this.focusedEntity);
      this.$root.$emit('lootAdded', this.focusedEntity.structure && this.focusedEntity.structure.loot || []);
    },
    tourStructure () {
      this.$root.$emit('dwellingEntered', this.focusedEntity.structure.dwelling);
    },
  },
  computed: {
    ...mapGetters('world', [
      'focusedEntity',
      'currentTurn',

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
  top: 32px;
  left: 620px;
  float: right;
  width: 196px;
  height: 128px;
  background-color: transparent;
  z-index: 11;
  margin-right: 69px;
  pointer-events: none;
}
.entity-ui.filled {
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
.entity-info {
  color: white;
  font-size: 8px;
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
  right: 10px;
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
  left: 50px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-def {
  position: absolute;
  top: 52px;
  left: 50px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-mp {
  position: absolute;
  top: 52px;
  left: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-int {
  position: absolute;
  top: 70px;
  left: 50px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.info-row-wis {
  position: absolute;
  top: 70px;
  left: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.health-icon {
  background-image: url('/assets/hudSprites/healthIcon.png');
  width: 14px;
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
.wis-sprite {
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
  transform: scale(1.1,1.1)
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
  transform: scale(1.1,1.1)
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
