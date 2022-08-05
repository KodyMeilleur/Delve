<template>
  <div
  class="dwelling-ui"
  >
  <div
    v-bind:class="{ 'inventory-open': inventoryExpanded === true}"
    class="dwelling-menu"
    v-if="expanded"
  >
    <div class="close-sprite" v-on:click="toggle"></div>
    <div class="dwelling-content">
      <div class="dwelling-avatar">
        <div
        v-on:click="askInvestment"
        v-if="selectedPlace.currentTier"
        v-bind:class="{ 'temple': selectedPlace.type === 'Temple'}"
        class="invest unselectable"
        >
        Invest
        </div>
        <div
        v-bind:style="{'background-image': 'url(' + publicPath + selectedPlace.avatar}"
        class="avatar"
        v-bind:class="{ 'temple': selectedPlace.type === 'Temple'}"
        >
        </div>
        <div
        v-bind:class="{ 'grow': shrinkGrow, 'shrink': !shrinkGrow, 'temple': selectedPlace.type === 'Temple'}"
        class="avatar-speech font-style">
          <div
          v-bind:class="{ 'temple': selectedPlace.type === 'Temple'}"
          class="text-container unselectable">
            {{ currentLine }}
          </div>
        </div>
      </div>
      <div
      v-bind:class="{ 'temple': selectedPlace.type === 'Temple'}"
      class="dwelling-menus">
        <div
        v-bind:class="{ 'temple': selectedPlace.type === 'Temple'}"
        class="dwelling-body">
          <!-- SHOP -->
          <div v-if="selectedPlace && selectedPlace.type === 'Shop'">
            <div class="shop-list">
              <div class="player-coin unselectable">
                <span class="font-style" style="margin-right:10px;">Player Coin:</span>
                <div
                v-bind:style="{
                  'background-position': ((14 * currentFrame) - 14) + 'px ' + (0) + 'px',
                }"
                class="sm-sprite coin-sprite"></div>
                <div class="">{{ currentTurn.coin }}</div>
              </div>
              <div
              v-for="item in selectedPlace[selectedPlace.tierMap[selectedPlace.currentTier]].table"
              v-on:click="buyItem(item)"
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
          <!-- TEMPLE -->
          <div v-if="selectedPlace && selectedPlace.type === 'Temple'">
            <div class="temple-list">
              <div class="player-coin temple unselectable">
                <span class="font-style" style="margin-right:10px;">:Player Coin</span>
                <div
                v-bind:style="{
                  'background-position': ((14 * currentFrame) - 14) + 'px ' + (0) + 'px',
                }"
                class="sm-sprite coin-sprite"></div>
                <div class="">{{ currentTurn.coin }}</div>
              </div>
              <div
              v-for="item in selectedPlace[selectedPlace.tierMap[selectedPlace.currentTier]].table"
              :key="item.service.name"
              class="shop-item temple"
              >
              <div class="item-slot">
                <div
                v-bind:style="{'background-image': 'url(' + publicPath + item.service.sprite}"
                class="item-icon"
                >
                </div>
                <div class="item-name">{{ item.service.name }}</div>
                <div class="item-cost">
                  <div
                  v-bind:style="{
                    'background-position': ((14 * currentFrame) - 14) + 'px ' + (0) + 'px',
                  }"
                  class="sm-sprite coin-sprite temple"></div>
                  <div class="cost-text temple">{{ item.cost }}</div>
                </div>
              </div>
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
      :key="place.type"
      >
        {{ place[place.tierMap[place.currentTier]].name }}
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getRandomInt } from '../services/generateLand';

export default {
  name: 'Dwelling',
  props: {
    lootTile: {
      default: null,
    },
    inventoryExpanded: {
      default: false,
    }
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
      dwelling: null,
      selectedPlace: null,
      currentFrame: 0,
      currentLine: '',
      shrinkGrow: false
    }
  },
  mounted: function() {
    this.$root.$on('frameBump', this.frameAdvance);
    this.$root.$on('dwellingEntered', this.openDwelling);
    this.$root.$on('buyLine', this.buyLine);
    this.$root.$on('sellLine', this.sellLine);
  },
  beforeDestroy() {
    this.$root.$off('frameBump', this.frameAdvance);
    this.$root.$off('dwellingEntered', this.openDwelling);
    this.$root.$off('buyLine', this.buyLine);
    this.$root.$off('sellLine', this.sellLine);
  },
  methods: {
    ...mapMutations('world', [
      'addItemsToInventory',
      'addMoneyToPlayer',
      'subtractMoneyFromPlayer',
      'togglePlayerShop'
    ]),
    take () {
      this.addItemsToInventory(this.currentLoot);
      this.clear();
    },
    buyItem (item) {
      if (this.currentTurn.coin < item.cost) {
        this.denyLine();
      } else {
        this.subtractMoneyFromPlayer({
          player: this.currentTurn,
          count: item.cost
        });
        this.addItemsToInventory({
          items: [Object.assign({}, item.item)],
          player: this.currentTurn
        });
        this.buyLine();
      }
    },
    openDwelling (dwelling) {
      this.expanded = true;
      this.$emit('dwellingToggled', this.expanded);
      this.togglePlayerShop({
        player: this.currentTurn,
        status: true,
      });
      this.dwelling = dwelling;
      this.selectedPlace = this.dwelling[0];
      this.currentLine = this.randomLine(this.selectedPlace);
    },
    toggle () {
      this.expanded = !this.expanded;
      this.$emit('dwellingToggled', this.expanded);
      if (this.expanded === false) {
        this.dwelling = null;
        this.selectedPlace = null;
        this.currentLine = '';
        this.togglePlayerShop({
          player: this.currentTurn,
          status: false,
        });
      }
    },
    selectPlace (place) {
      this.selectedPlace = place;
      this.currentLine = this.randomLine(place);
    },
    frameAdvance (frame) {
      if (frame % 2 === 0) {
        this.currentFrame = frame === 4 ? 1 : 0;
      }
    },
    randomLine (place) {
      const lines = place.lines;

      return lines && lines[getRandomInt(0, lines.length - 1)];
    },
    buyLine () {
      const place = this.selectedPlace;
      const lines = place.buyLines;

      const line = lines && lines[getRandomInt(0, lines.length - 1)];
      this.currentLine = line;
    },
    sellLine () {
      const place = this.selectedPlace;
      const lines = place.sellLines;

      const line = lines && lines[getRandomInt(0, lines.length - 1)];
      this.currentLine = line;
    },
    denyLine() {
      const place = this.selectedPlace;
      const lines = place.denyLines;

      const line = lines && lines[getRandomInt(0, lines.length - 1)];
      this.currentLine = line;
    },
    askInvestment () {
      const nextTier = this.selectedPlace[this.selectedPlace.tierMap[this.selectedPlace.currentTier + 1]];
      console.log(nextTier);
      let line = `The cost of expansion will be `;
      nextTier.cost.forEach((stack) => {
        line += `${stack.quantity} ${stack.item.name} `;
      });
      line += '.';
      this.currentLine = line;
    },
  },
  watch: {
     'currentLine': {
       handler () {
         const that = this;
         this.shrinkGrow = true;
         setTimeout(() => {
           that.shrinkGrow = false;
         }, 250);
       }
     }
  },
  computed: {
    ...mapGetters('world', [
      'currentTurn',
      'leftOffset',
      'topOffset',
    ])
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
.dwelling-menus {
  width: 250px!important;
}
.dwelling-menus.temple {
  left: 16px;
  position: absolute;
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
.dwelling-menu.inventory-open {
  left: -145px;
}
.text-container {
  width: 175px;
  height: 54px;
  position: relative;
  top: 5px;
  left: 26px;
  font-size: 10px;
  -webkit-text-stroke-width: 0.8px;
}
.text-container.temple {
  left: 6px;
}
.dwelling-content {
  height: 100%;
  display: flex;
}
.dwelling-body {
  width: 250px;
  height: 200px;
  overflow-y: scroll;
  top: 15px;
  left: -12px;
  position: relative;
}
.dwelling-body::-webkit-scrollbar {
  width: 8px;
  background-image: url('/assets/hudSprites/scrollThumb.png');
}
.dwelling-body:hover::-webkit-scrollbar {
  background-image: url('/assets/hudSprites/scrollThumbHover.png');
  cursor: pointer;
}
.dwelling-body.temple {
  direction: rtl;
  left: -4px;
}
.dwelling-options {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  bottom: 5px;
  left: 0px;
  margin-left: 5px;
}
.invest {
  background-color: #FFE493;
  position: absolute;
  width: 68px;
  border-color: transparent;
  border-radius: 5px;
  padding: 2px;
  top: 13px;
  left: 64px;
  height: 24px;
  cursor: pointer;
}
.invest.temple {
  left: 280px;
}
.player-coin {
  width: 90%;
  height: 20px;
  display: flex;
  background-color: #ffe493;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
}
.player-coin.temple {
  display: flex;
  flex-direction: row-reverse;
}
.avatar {
  width: 100px;
  height: 230px;
  position: absolute;
  left: 45px;
  top: 41px;
}
.avatar.temple {
  left: 262px;
}
.avatar-speech {
  width: 210px;
  height: 64px;
  position: absolute;
  bottom: 51px;
  right: 25px;
  border-color: transparent;
  border-radius: 10px;
  background-image: url('/assets/hudSprites/speechBubble.png');
  z-index: 14;
}
.avatar-speech.temple {
  right: unset;
  left: 22px;
  background-image: url('/assets/hudSprites/speechBubbleReversed.png');
}
.place {
  margin-top: 4px;
  background-color: #FFE493;
  border-color: transparent;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
  margin: 4px 6px;
}
.place:hover {
  transform: scale(1.1, 1.1);
}
.shop-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sm-sprite {
  width: 14px;
  height: 14px;
  cursor: pointer;
}
.player-coin > .coin-sprite {
  position: relative;
  top: 0;
}
.coin-sprite {
  position: absolute;
  top: 8px;
  background-image: url('/assets/hudSprites/coinIcon.png');
}
.coin-sprite.temple {
  left: 2px;
}
.cost-text {
  position: absolute;
  right: 4px;
  top: 4px;
}
.cost-text.temple {
  right: 5px;
}
.item-slot {
  display: flex;
}
.shop-item:hover, .invest:hover {
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
.shop-item.temple {
  left: -11px;
}
.grow {
  animation: grow .25s;
}
.shrink {
  animation: shrink .25s;
}
@keyframes createBox {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
@keyframes grow {
    from {
        transform: scale(1);
    }
    to {
        transform: scale(1.5);
    }
}
@keyframes shrink {
    from {
        transform: scale(1.5);
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
.font-style {
  font-weight: 800;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
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
