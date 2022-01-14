<template>
  <div class="dwelling-ui"
  >
  <div class="dwelling-menu" v-if="expanded">
    <div class="close-sprite" v-on:click="toggle"></div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
// import { getRandomInt } from '../services/generateLand';

export default {
  name: 'Dwelling',
  props: {
    lootTile: {
      default: null,
    },
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
      dwelling: null,
    }
  },
  mounted: function() {
    this.$root.$on('dwellingEntered', this.openDwelling);
  },
  beforeDestroy() {
    this.$root.$off('dwellingEntered');
  },
  methods: {
    ...mapMutations('world', [
      'addItemsToInventory'
    ]),
    take () {
      this.addItemsToInventory(this.currentLoot);
      this.clear();
    },
    openDwelling (dwelling) {
      this.expanded = true;
      this.dwelling = dwelling;
      console.log(dwelling);
    },
    toggle () {
      this.expanded = !this.expanded;
      if (this.expanded === false) {
        this.dwelling = null;
      }
    },
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn',
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dwelling-ui {
  position: sticky;
  left: 105px;
  top: 415px;
  background-color: transparent;
  z-index: 13;
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 578px;
}

.dwelling-menu {
  width: 320px;
  height: 320px;
  position: absolute;
  background-image: url('/assets/hudSprites/dwellingBg.png');
  top: -310px;
  left: 145px;
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
.close-sprite {
  background-image: url('/assets/hudSprites/closeIcon.png');
  width: 14px;
  height: 14px;
  position: absolute;
  top: -1px;
  right: 0px;
  cursor: pointer;
}
.close-sprite:hover {
  transform: scale(1.1,1.1);
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
