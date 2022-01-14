<template>
  <div class="dwelling-ui"
  >
  <div class="dwelling-menu" v-if="expanded">
    <div class="close-sprite" v-on:click="toggle"></div>
    <div class="dwelling-content">
      <div class="dwelling-avatar">
        <div
        v-bind:style="{'background-image': 'url(' + publicPath + selectedPlace.avatar}"
        class="avatar"
        >
        </div>
      </div>
      <div class="dwelling-menus">
        <div class="dwelling-body">
          <div v-if="selectedPlace && selectedPlace.type === 'Shop'">
            <div class="shop-list">
              <div
              v-for="item in selectedPlace[selectedPlace.tierMap[selectedPlace.currentTier]].table"
              :key="item.name"
              class="shop-item"
              >
              <div class="item-slot">
                <div
                v-bind:style="{'background-image': 'url(' + publicPath + item.item.sprite}"
                class="item-icon"
                >
                </div>
                <div class="item-name">{{ item.item.name }}</div>
                <div class="item-cost">
                  <div
                  v-bind:style="{
                    'background-position': ((14 * currentFrame) - 14) + 'px ' + (0) + 'px',
                  }"
                  class="sm-sprite coin-sprite"></div>
                  <div class="cost-text">{{ item.cost }}</div>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>
        <div class="dwelling-options">
          <div
          class="place unselectable"
          v-on:click="selectPlace(place)"
          v-for="place in dwelling"
          :key="place.currentTier"
          >
            {{ place[place.tierMap[place.currentTier]].name }}
          </div>
        </div>
      </div>
    </div>
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
      selectedPlace: null,
      currentFrame: 0,
    }
  },
  mounted: function() {
    this.$root.$on('frameBump', this.frameAdvance);
    this.$root.$on('dwellingEntered', this.openDwelling);
  },
  beforeDestroy() {
    this.$root.$off('frameBump');
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
      this.selectedPlace = this.dwelling[0];
    },
    toggle () {
      this.expanded = !this.expanded;
      if (this.expanded === false) {
        this.dwelling = null;
        this.selectedPlace = null;
      }
    },
    selectPlace (place) {
      this.selectedPlace = place;
    },
    frameAdvance (frame) {
      console.log(frame);
      if (frame % 2 === 0) {
        this.currentFrame = frame === 4 ? 1 : 0;
      }
    }
  },
  watch: {
    'leftOffset': {
      handler () {
        this.$root.$off('frameBump', this.frameAdvance);
        this.$root.$on('frameBump', this.frameAdvance);
      },
       deep: false
     },
     'topOffset': {
       handler () {
         this.$root.$off('frameBump', this.frameAdvance);
         this.$root.$on('frameBump', this.frameAdvance);
       },
        deep: false
      },
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn',
      'leftOffset',
      'topOffset',

    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dwelling-ui {
  position: sticky;
  left: 179px;
  top: 415px;
  background-color: transparent;
  z-index: 13;
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 578px;
}
.dwelling-menus, .dwelling-avatar {
  width: 50%;
}
.dwelling-menu {
  width: 420px;
  height: 320px;
  position: absolute;
  background-image: url('/assets/hudSprites/dwellingBg.png');
  top: -310px;
  left: 4px;
  animation: createBox .25s;
}
.dwelling-content {
  height: 100%;
  display: flex;
}
.dwelling-body {
  width: 100%;
  height: 258px;
}
.dwelling-options {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 5px;
  left: 0px;
}
.avatar {
  width: 100px;
  height: 250px;
  position: absolute;
  left: 45px;
  top: 20px;
}
.place {
  margin-top: 4px;
  background-color: #FFE493;
  border-color: transparent;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
}
.place:hover {
  transform: scale(1.1, 1.1);
}
.shop-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin-top: 12px;
  margin-right: 10px;
}
.sm-sprite {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
.coin-sprite {
  position: absolute;
  top: 8px;
  background-image: url('/assets/hudSprites/coinIcon.png');
}
.cost-text {
  position: absolute;
  right: 4px;
  top: 4px;
}
.item-slot {
  display: flex;
}
.shop-item:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}
.item-icon {
  width: 32px;
  height: 32px;
  position: absolute;
  left: 13px;
  top: 5px;
}
.item-name {
  position: absolute;
  top: 14px;
  width: 125px;
  left: 50px;
  height: 32px;
  font-size: 9px;
}
.item-cost {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 35px;
}
.shop-item {
  width: 219px;
  height: 44px;
  margin-top: 2px;
  background-image: url('/assets/hudSprites/shopItemBg.png');
  position: relative;
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
