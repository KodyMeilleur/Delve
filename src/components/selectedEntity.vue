<template>
  <div class="entity-ui"
    v-bind:class="{ filled: focusedEntity}"
  >
  <div v-if="focusedEntity" class="entity-info">
    <span class="info-row">Selected Tile X: {{ focusedEntity.x }}</span>
    <span class="info-row">Selected Tile Y: {{ focusedEntity.y }}</span>
    <span class="info-row">Tile Density: {{ focusedEntity.density }}</span>
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
  left: 538px;
  float: right;
  width: 80px;
  height: 80px;
  border: 2px solid white;
  border-radius: 5px;
  background-color: transparent;
  z-index: 5;
  pointer-events: none;
}
.entity-ui.filled {
  background-color: grey;
}
.entity-info {
  color: white;
  font-size: 6px;
}
.info-row {
  display: block;
}
</style>
