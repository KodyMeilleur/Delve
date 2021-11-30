<template>
  <div class="entity-ui"
    v-bind:class="{ filled: focusedEntity}"
  >
  <div v-if="focusedEntity && focusedEntity.isTile" class="entity-info">
    <span class="info-row">Selected Tile X: {{ focusedEntity.x }}</span>
    <span class="info-row">Selected Tile Y: {{ focusedEntity.y }}</span>
    <span class="info-row">MovingDirection: {{ focusedEntity.movingDirection }}</span>
    <span class="info-row">Tile Density: {{ focusedEntity.density }}</span>
    <span class="info-row">Structures: {{ focusedEntity.structure }}</span>
  </div>
  <div v-if="focusedEntity && focusedEntity.isCreature" class="entity-info">
    <span class="info-row">Selected Tile X: {{ focusedEntity.x }}</span>
    <span class="info-row">Selected Tile Y: {{ focusedEntity.y }}</span>
    <span class="info-row">Name: {{ focusedEntity.name || focusedEntity.type }}</span>
    <span class="info-row">MovingDirection {{ focusedEntity.movingDirection }}</span>
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
  top: 0;
  left: 518px;
  float: right;
  width: 100px;
  height: 100px;
  background-color: transparent;
  z-index: 5;
  pointer-events: none;
}
.entity-ui.filled {
  border: 2px solid white;
  border-radius: 5px;
  background-color: grey;
}
.entity-info {
  color: white;
  font-size: 8px;
}
.info-row {
  display: block;
}
</style>
