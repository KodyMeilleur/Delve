<template>
  <div class="inventory-ui"
  >
  <div class="inventory-sprite" v-on:click="toggle"></div>
  <div class="inventory-menu" v-if="expanded">
    <div class="close-sprite" v-on:click="toggle"></div>
    <div class="player-cash unselectable">
      <div
      v-bind:style="{
        'background-position': ((14 * currentFrame) - 14) + 'px ' + (0) + 'px',
      }"
      class="sm-sprite coin-sprite"></div>
      <div class="cost-text">{{ currentTurn.coin }}</div>
    </div>
    <div class="sell-cash unselectable">
      <div
      v-if="focusedItem.name"
      v-bind:style="{
        'background-position': ((14 * currentFrame) - 14) + 'px ' + (0) + 'px',
      }"
      class="sm-sprite sell-sprite"></div>
      <div class="cost-text">{{ focusedItem.averageCost }}</div>
    </div>
    <div class="item-sprite-container">
      <div
      class="item-sprite"
      v-if="focusedItem.sprite"
      v-bind:style="{'background-image': 'url(' + publicPath + focusedItem.sprite}"
      >
      </div>
      <div
      class="item-use-sprite"
      v-bind:class="{ 'active': focusedItem.name }"
      >
      </div>
      <div
      class="item-sell-sprite"
      v-bind:class="{ 'active': focusedItem.name && currentTurn.inShop }"
      v-on:click="sellItem(focusedItem)">
      </div>
    </div>
    <div class="item-description unselectable">{{ focusedItem.description }}</div>
    <div class="items">
      <div
      class="item-slot unselectable"
      v-for="item in inventory" v-bind:key="item.name + item.quantity"
      v-bind:class="{ 'selected': focusedItem.name === item.name}"
      v-on:click="focus(item)">
        <div class="item-text">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-quantity">x{{ item.quantity }}</span>
        </div>
        </div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Inventory',
  data () {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
      focusedItem: {},
      currentFrame: 0,
    }
  },
  mounted: function() {
    this.$root.$on('frameBump', this.frameAdvance);
  },
  beforeDestroy() {
    this.$root.$off('frameBump');
  },
  methods: {
    ...mapMutations('world', [
      'sellPlayerItem',
    ]),
    toggle () {
      this.expanded = !this.expanded;
      if (this.expanded === false) {
        this.focusedItem = {};
      }
    },
    focus (item) {
      if (this.focusedItem.name == item.name) {
        this.focusedItem = {};
      } else {
        this.focusedItem = item;
      }
    },
    frameAdvance (frame) {
      if (frame % 2 === 0) {
        this.currentFrame = frame === 4 ? 1 : 0;
      }
    },
    sellItem (item) {
      this.sellPlayerItem({player: this.currentTurn, merch: item});
      this.focusedItem = {};
      this.$root.$emit('sellLine');
    },
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn',
      'leftOffset',
      'topOffset',
      'worldSeed'
    ]),
    inventory: function() {
      if (this.currentTurn.items) {
        return this.currentTurn.items;
      }

      return [];
    },
  },
  watch: {
    'worldSeed': {
      handler () {
        this.$root.$off('frameBump', this.frameAdvance);
        this.$root.$on('frameBump', this.frameAdvance);
      },
       deep: false
     },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inventory-ui {
  position: sticky;
  left: 275px;
  top: 510px;
  background-color: transparent;
  z-index: 11;
  font-variant: small-caps;
  font-family: system-ui;
  float: right;
  margin-right: 578px;
}
.inventory-sprite {
  background-image: url('/assets/hudSprites/inventoryIcon.png');
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.inventory-sprite:hover, .close-sprite:hover, .item-use-sprite.active:hover, .item-sell-sprite.active:hover {
  transform: scale(1.1,1.1);
}
.inventory-menu {
  width: 240px;
  height: 258px;
  background-image: url('/assets/hudSprites/inventory.png');
  position: absolute;
  top: -345px;
  left: 333px;
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
.item-slot {
  width: 91px;
  height: 31px;
  background-image: url('/assets/hudSprites/itemSlot.png');
  cursor: pointer;
  font-variant: small-caps;
  font-family: system-ui;
  font-size: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}
.item-slot:hover {
  background-image: url('/assets/hudSprites/hoverItemSlot.png');
}
.item-slot:hover > .item-text, .item-slot.selected > .item-text {
  top: 3px;
}
.item-slot.selected {
  background-image: url('/assets/hudSprites/hoverItemSlot.png');
}
.items {
  position: absolute;
  right: 5px;
  top: 49px;
  height: 183px;
  width: 105px;
  overflow-y: scroll;
}
.item-description {
  line-break: strict;
  position: absolute;
  width: 93px;
  top: 95px;
  font-size: 8px;
  font-weight: 700;
  left: 18px;
}
.item-name {
  overflow: hidden;
  white-space: nowrap;
  font-size: 9px;
  text-overflow: ellipsis;
  padding: 3px;
  width: 100%;
}
.item-quantity {
  padding: 4px;
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
.item-sprite-container {
  position: absolute;
  top: 45px;
  left: 50px;
  display: flex;
}
.item-sprite {
  width: 32px;
  height: 32px;
  cursor: pointer;
  position: absolute;
  left: -34px;
}
.item-use-sprite {
  width: 33px;
  height: 33px;
  background-image: url('/assets/hudSprites/inactiveUseIcon.png');
  pointer-events: none;
}
.item-use-sprite.active {
  background-image: url('/assets/hudSprites/activeUseIcon.png');
  cursor: pointer;
  pointer-events: all;
}
.item-sell-sprite {
  margin-left: 1px;
  width: 33px;
  height: 33px;
  background-image: url('/assets/hudSprites/inactiveSellIcon.png');
  pointer-events: none;
}
.item-sell-sprite.active{
  background-image: url('/assets/hudSprites/activeSellIcon.png');
  cursor: pointer;
  pointer-events: all;
}
.item-text {
  position: absolute;
  top: 1px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}
.player-cash {
  position: absolute;
  top: 10px;
  left: 15px;
  display: flex;
  width: 32px;
}
.sm-sprite {
  width: 14px;
  height: 14px;
  min-width: 14px;
  min-height: 14px;
}
.coin-sprite {
  position: relative;
  top: 4px;
  background-image: url('/assets/hudSprites/coinIcon.png');
}
.sell-sprite {
  position: relative;
  top: 4px;
  background-image: url('/assets/hudSprites/sellCoinIcon.png');
}
.sell-cash {
  position: absolute;
  right: 20px;
  display: flex;
  top: 11px;
}
.cost-text {
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
