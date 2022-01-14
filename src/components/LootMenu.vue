<template>
  <div class="loot-ui"
  >
  <div class="loot-menu" v-if="currentLoot.length">
    <span class="loot-text unselectable">Bounty</span>
    <div class="loot-container">
      <div class="loot-item unselectable" v-for="item in currentLoot" :key="item.name + Math.random()">
        <span>{{ item.name }}</span>
        <span>x{{ item.quantity }}</span>
      </div>
    </div>
    <div class="control-container">
      <div class="take-all c-btn" v-on:click="take"></div>
      <div class="dump-all c-btn" v-on:click="clear"></div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getRandomInt } from '../services/generateLand';

export default {
  name: 'LootMenu',
  props: {
    lootTile: {
      default: null,
    },
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
      currentLoot: [],
    }
  },
  mounted: function() {
    this.$root.$on('lootAdded', this.generateLoot);
  },
  beforeDestroy() {
    this.$root.$off('lootAdded');
  },
  methods: {
    ...mapMutations('world', [
      'setLogFilter',
      'addItemsToInventory'
    ]),
    clear () {
      this.currentLoot = [];
    },
    take () {
      this.addItemsToInventory({items: this.currentLoot, player: this.currentTurn});
      this.clear();
    },
    generateLoot (table) {
      const lootList = table || [];
      lootList.forEach((potential) => {
        const chance = getRandomInt(0, 100);
        if (chance <= potential.chance) {
          const amount = getRandomInt(1, potential.amount);
          this.currentLoot.push(new potential.item(amount));
        }
      })
    }
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
.loot-ui {
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

.loot-menu {
  width: 96px;
  height: 160px;
  position: absolute;
  background-image: url('/assets/hudSprites/lootBg.png');
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
.control-container {
  display: flex;
  position: absolute;
  bottom: 7px;
  width: 100%;
  justify-content: space-evenly;
}
.take-all {
  background-image: url('/assets/hudSprites/takeAll.png');
}
.dump-all {
  background-image: url('/assets/hudSprites/dumpAll.png');
}
.c-btn {
  width: 39px;
  height: 20px;
  cursor: pointer;
}
.c-btn:hover {
  transform: scale(1.1,1.1);
}
.loot-container {
  display: flex;
  flex-direction: column;
  width: 106px;
  height: 123px;
  overflow-y: scroll;
  margin-top: 16px;
  align-items: center;
}
.loot-item {
  background-image: url('/assets/hudSprites/lootSlot.png');
  width: 78px;
  height: 22px;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 2px;
}
.loot-slot {
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
.loot-text {
  position: absolute;
  top: -1px;
  left: 30px;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  color: white;
  font-weight: 800;
  font-variant: small-caps;
  font-family: system-ui;
  pointer-events: all;
  font-size: 12px;
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
