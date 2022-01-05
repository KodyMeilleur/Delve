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
      <div v-if="focusedEntity.structure">
        <div class="explore-sprite"></div>
      </div>
    </span>
  </div>
  <div v-if="focusedEntity && focusedEntity.isCreature" class="entity-info">
    <span class="info-row info-row-name">{{ focusedEntity.name }}</span>
    <span class="info-row">Selected Tile X: {{ focusedEntity.x }}</span>
    <span class="info-row">Selected Tile Y: {{ focusedEntity.y }}</span>
    <span class="info-row">Name: {{ focusedEntity.name }}</span>
    <span class="info-row">HP: {{ focusedEntity.hp }}</span>
    <span class="info-row">STR: {{ focusedEntity.str }}</span>
    <span class="info-row">DEF: {{ focusedEntity.def }}</span>
    <span class="info-row">INT: {{ focusedEntity.int }}</span>
    <span class="info-row">WIS: {{ focusedEntity.wis }}</span>
    <span class="info-row">MP: {{ focusedEntity.mp }}</span>
    <!-- <span class="info-row">Path: {{ focusedEntity.path.length }}</span> -->
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters } from 'vuex';

export default {
  name: 'SelectedEntity',
  data () {
    return {
    }
  },
  methods: {
    saveTurn () {

    }
  },
  computed: {
    ...mapGetters('world', [
      'focusedEntity',
    ])
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.entity-ui {
  position: sticky;
  top: 32px;
  left: 620px;
  float: right;
  width: 196px;
  height: 128px;
  background-color: transparent;
  z-index: 5;
  /* pointer-events: none; */
}
.entity-ui.filled {
  background-image: url('/assets/hudSprites/tileInfo.png');
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  font-weight: 800;
  font-variant: small-caps;
  font-family: system-ui;
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
}
.tier-star {
  background-image: url('/assets/hudSprites/tierStar.png');
  width: 14px;
  height: 14px;
}
.mp-sprite {
  background-image: url('/assets/hudSprites/mpIcon.png');
  width: 14px;
  height: 14px;
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
.info-row-name {
  position: absolute;
  top: 9px;
  left: 12px;
  font-size: 18px;
}
</style>
