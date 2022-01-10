<template>
  <div class="inventory-ui"
  >
  <div class="inventory-sprite" v-on:click="toggle"></div>
  <div class="inventory-menu" v-if="expanded">
    <div class="close-sprite" v-on:click="toggle"></div>
    <div class="item-sprite-container" v-if="focusedItem.sprite">
      <div
      class="item-sprite"
      v-bind:style="{'background-image': 'url(' + publicPath + focusedItem.sprite}"
      >
      </div>
    </div>
    <div class="item-description unselectable">{{ focusedItem.description }}</div>
    <div class="items" v-for="item in inventory" v-bind:key="item.name + item.quantity">
      <div
      class="item-slot unselectable"
      v-bind:class="{ 'selected': focusedItem.name === item.name}"
      v-on:click="focus(item)">
        <div class="item-text">
          <span>{{ item.name }}</span>
          <span>x{{ item.quantity }}</span>
        </div>
        </div>
    </div>
  </div>
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
  name: 'Inventory',
  data () {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
      focusedItem: {}
    }
  },
  methods: {
    ...mapMutations('world', [
      'setLogFilter',
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
.inventory-sprite:hover, .close-sprite:hover {
  transform: scale(1.1,1.1)
}
.inventory-menu {
  width: 240px;
  height: 224px;
  background-image: url('/assets/hudSprites/inventory.png');
  position: absolute;
  top: -310px;
  left: 65px;
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
  top: -3px;
}
.item-slot.selected {
  background-image: url('/assets/hudSprites/hoverItemSlot.png');
}
.items {
  position: absolute;
  right: 5px;
  top: 20px;
  height: 183px;
  width: 105px;
  overflow-y: scroll;
}
.item-description {
  line-break: strict;
  position: absolute;
  width: 93px;
  top: 68px;
  font-size: 8px;
  font-weight: 700;
  left: 17px;
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
  top: 17px;
  left: 17px;
}
.item-sprite {
  width: 32px;
  height: 32px;
}
.item-text {
  position: relative;
  top: -5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
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
