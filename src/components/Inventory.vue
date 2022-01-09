<template>
  <div class="inventory-ui"
  >
  <!-- <div class="log-info">
    <div v-for="item in inventory" :key="log.length + Math.random()">
      {{ log }}
    </div>
  </div> -->
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Log',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations('world', [
      'setLogFilter',
    ]),
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn',
    ]),
    inventory: function() {
      if (this.currentTurn.items) {
        return this.currentTurn.items;
      }

      return [];
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inventory-ui {
  position: sticky;
  left: 15px;
  top: 425px;
  width: 256px;
  height: 128px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/itemGraphic.png');
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 610px;
}
</style>
