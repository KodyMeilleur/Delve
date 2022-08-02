<template>
  <div
  v-if="showSpinner"
  class="itemSpinner unselectable"
  v-on:click="showSpinner = false;"
  >
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
    ]),
    openSpinner () {
      const that = this;
      this.showSpinner = true;

      setTimeout(() => {
        that.spinnerStartup();
      }, 100);

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

      function roulette_spin(){
        // set initial force randomly
        force = Math.floor(Math.random() * randForce) + minForce;
        doAnimation();
      }

      function doAnimation() {
        console.log('spin');
        // new angle is previous angle + force modulo 360 (so that it stays between 0 and 360)
        angle = (angle + force) % 360;
        // decay force according to inertia parameter
        force *= inertia;
        rouletteElem.style.transform = 'rotate('+ angle +'deg)';
        // stop animation if force is too low
        if (force < 0.05) {
          // score roughly estimated
          console.log('spin done');
          that.selectedItem = values[Math.floor(((angle / 360) * values.length) - 0.5)];
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

.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
