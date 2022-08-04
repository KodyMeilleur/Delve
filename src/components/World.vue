<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="world-container">
      <div
      v-on:scroll.passive="handleScroll"
      v-bind:class="{ 'isBattling': isBattling}"
      class="world-box"
      ref="world"
      >
        <BattleLayer />
        <SelectedEntity />
        <LootMenu :lootTile="lootTile"/>
        <Dwelling
          v-on:dwellingToggled="toggleDwelling"
          :inventoryExpanded="inventoryExpanded"
        />
        <!-- <Log /> -->
        <ItemSpinner />
        <Header
          v-if="!isBattling"
        />
        <Inventory
          v-on:inventoryToggled="toggleInventory"
          v-if="!isBattling"
          :dwellingExpanded="dwellingExpanded"
        />
        <FocusStats
          v-if="!isBattling"
        />
        <div
          class="focus-icon"
          v-if="!isBattling"
          v-on:click="centerPlayer"
        >
        </div>
        <div
        v-bind:class="{
          shaking,
        }"
        >
          <div class="entities" v-if="isBattling === false">
            <EntityLayer :key="JSON.stringify(map[0])"/>
          </div>
          <TileLayer :map="map" :shouldShow="!isBattling"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import SelectedEntity from './selectedEntity.vue';
import Inventory from './Inventory.vue';
// import Log from './Log.vue';
import FocusStats from './FocusStats.vue';
import LootMenu from './LootMenu.vue';
import Header from './Header.vue';
import Dwelling from './Dwelling.vue';
import BattleLayer from './BattleLayer.vue';
import EntityLayer from './EntityLayer.vue';
import TileLayer from './TileLayer.vue';
import ItemSpinner from './ItemSpinner.vue';
import CONST from '../CONST';

export default {
  name: 'World',
  props: [
    'msg',
  ],
  components: {
    SelectedEntity,
    // Log,
    BattleLayer,
    EntityLayer,
    TileLayer,
    Inventory,
    FocusStats,
    LootMenu,
    Header,
    Dwelling,
    ItemSpinner,
  },
  mounted () {
    this.$root.$on('shakeWorld', this.shakeEffect);
    this.$root.$on('centerPlayer', this.centerPlayer);
    this.$root.$on('resetScreenPosition', this.resetScreenPosition);
  },
  updated () {
    console.log('world render');
  },
  data () {
    return {
      repositories: [],
      scrollLeftCache: 0,
      scrollTopCache: 0,
      shakeVerticalOffset: 0,
      shakeHorizontalOffset: 0,
      shaking: false,
      lootTile: null,
      dwellingExpanded: false,
      inventoryExpanded: false,
    }
  },
  computed: {
    ...mapGetters('world', [
      'map',
      'players',
      'currentTurn',
      'isBattling',
      'leftOffset',
      'topOffset',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setScroll',
      'focusPlayer',
    ]),
    shakeEffect () {
      this.shaking = !this.shaking;
    },
    centerPlayer (offset) {
      const playerX = this.currentTurn.x;
      const playerY = this.currentTurn.y;

      const topOffset = offset.topOffset || ((playerX * CONST.tileWidth) - (CONST.viewHeight / 2)) || 0;
      const leftOffset = offset.leftOffset || ((playerY * CONST.tileWidth) - (CONST.viewWidth / 2)) + (CONST.tileWidth / 2) || 0;

      if (this.$refs.world) {
        this.$refs.world.scrollTop = topOffset;
        this.$refs.world.scrollLeft = leftOffset;
        this.setScroll({scrollLeft: leftOffset, scrollTop: topOffset});
        this.focusPlayer();
      }
    },
    resetScreenPosition () {
      if (this.$refs.world) {
        this.$refs.world.scrollTop = 0;
        this.$refs.world.scrollLeft = 0;
      }
    },
    handleScroll ($event) {
      const that = this;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        // your action
        const scrollLeft = parseInt($event.srcElement.scrollLeft);
        const scrollTop = parseInt($event.srcElement.scrollTop);
        that.scrollLeftCache = scrollLeft;
        that.scrollTopCache = scrollTop;
        that.setScroll({scrollLeft, scrollTop});
      }, 1); // delay
    },
    toggleDwelling (bool) {
      if (this.dwellingExpanded !== bool) {
        this.dwellingExpanded = bool;
      }
    },
    toggleInventory (bool) {
      if (this.inventoryExpanded !== bool) {
        this.inventoryExpanded = bool;
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.world-container {
  caret-color: rgba(0,0,0,0);
  display: flex;
  justify-content: center;
}
.world-box {
  width: 896px;
  height: 576px;
  overflow: scroll;
  background-color: #33232a;
  position: relative;
}
.world-box.isBattling {
  overflow: hidden;
}
.world-ui-elements.isBattling {
  display: none;
}
.world-ui-elements {
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  position: absolute;
}
.entities {
  width: 0;
  height: 0;
  float: left;
  position: absolute;
  z-index: 3;
}
.turn-order {
  position: relative;
  top: -10px;
}
.focus-icon {
  position: sticky;
  top: 510px;
  background-color: transparent;
  float: right;
  margin-right: 578px;
  width: 31px;
  height: 32px;
  z-index: 11;
  bottom: 12px;
  left: 83px;
  cursor: pointer;
  background-image: url('/assets/hudSprites/centerIcon.png');
}
.focus-icon:hover {
  transform: scale(1.1,1.1);
  background-image: url('/assets/hudSprites/centerIconFocus.png');

}
.shaking {
  animation: shake 0.5s;

/* When the animation is finished, start again */
  animation-iteration-count: infinite;
}
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
