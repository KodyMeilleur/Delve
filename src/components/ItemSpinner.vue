<template>
  <div
  v-if="showSpinner"
  class="itemSpinner unselectable"
  >
  <div
    v-if="this.potentialItems.length"
    class="potentialItems"
  >
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[0].sprite,
    }"
    class="potential-item potential-item-1">
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[1].sprite,
    }"
    class="potential-item potential-item-2">
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[2].sprite,
    }"
    class="potential-item potential-item-3">
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[3].sprite,
    }"
    class="potential-item potential-item-4">
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[4].sprite,
    }"
    class="potential-item potential-item-5">
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[5].sprite,
    }"
    class="potential-item potential-item-6">
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[6].sprite,
    }"
    class="potential-item potential-item-7">
    </div>
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + potentialItems[7].sprite,
    }"
    class="potential-item potential-item-8">
    </div>
  </div>
  <div
  ref="spinner"
  class="pointer"></div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { PLAINS_REWARDS } from '../models/RewardMap';

export default {
  name: 'ItemSpinner',
  data () {
    return {
      showSpinner: false,
      selectedItem: null,
      potentialItems: [],
      publicPath: process.env.BASE_URL,
    }
  },
  mounted: function() {
    this.$root.$on('itemSpinner', this.openSpinner);
  },
  beforeDestroy() {
    this.$root.$off('itemSpinner', this.openSpinner);
  },
  methods: {
    ...mapMutations('world', [
      'addItemsToInventory',
    ]),
    openSpinner () {
      const that = this;
      this.showSpinner = true;

      setTimeout(() => {
        that.spinnerStartup();
      }, 150);

    },
    spinnerStartup () {
      let force = 0;
      let angle = 0;
      let inertia = 0.985;
      const minForce = 15;
      const randForce = 15;
      const rouletteElem = this.$refs.spinner;
      const that = this;
      const values = PLAINS_REWARDS[0].reverse();
      this.potentialItems = values;

      function roulette_spin(){
        // set initial force randomly
        force = Math.floor(Math.random() * randForce) + minForce;
        doAnimation();
      }

      function doAnimation() {
        // new angle is previous angle + force modulo 360 (so that it stays between 0 and 360)
        angle = (angle + force) % 360;
        // decay force according to inertia parameter
        force *= inertia;
        rouletteElem.style.transform = 'rotate('+ angle +'deg)';
        // stop animation if force is too low
        if (force < 0.20) {
          // score roughly estimated
          that.selectedItem = values[Math.floor(((angle / 360) * values.length) - 0.20)];
          that.$root.$emit('lootAdded', {items: [ that.selectedItem ]});
          that.showSpinner = false;
          that.$root.$emit('playerDelay', false);
          return;
        } else {
          requestAnimationFrame(doAnimation);
        }
      }

      roulette_spin();
    }
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn'
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.itemSpinner {
  position: sticky;
  left: 415px;
  top: 125px;
  width: 128px;
  height: 128px;
  background-color: transparent;
  z-index: 11;
  background-image: url('/assets/hudSprites/itemSpinner.png');
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 614px;
}

.pointer {
  position: absolute;
  width: 7px;
  height: 48px;
  z-index: 11;
  background-image: url('/assets/hudSprites/spinnerArrow.png');
  left: 61px;
  top: 14px;
  transform-origin: bottom center;
}

.potential-item  {
  position: absolute;
  width: 32px;
  height: 32px;
  transform: scale(0.5);
}
.potentialItems {
  width: 128px;
  height: 128px;
}
.potential-item-1 {
  top: 7px;
  right: 32px;
}
.potential-item-2 {
  top: 27px;
  right: 9px;
}
.potential-item-3 {
  top: 62px;
  right: 6px;
}
.potential-item-4 {
  bottom: 10px;
  left: 64px;
}
.potential-item-5 {
  left: 31px;
  bottom: 10px;
}
.potential-item-6 {
  top: 64px;
  left: 6px;
}
.potential-item-7 {
  top: 28px;
  left: 7px;
}
.potential-item-8 {
  left: 32px;
  top: 5px;
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
