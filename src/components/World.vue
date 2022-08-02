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
        <span
        v-bind:class="{ 'isBattling': isBattling}"
        class="world-ui-elements">
          <Header />
          <Dwelling />
          <Log />
          <Inventory />
          <FocusStats />
          <ItemSpinner />
        </span>
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
import Log from './Log.vue';
import FocusStats from './FocusStats.vue';
import LootMenu from './LootMenu.vue';
import Header from './Header.vue';
import Dwelling from './Dwelling.vue';
import BattleLayer from './BattleLayer.vue';
import EntityLayer from './EntityLayer.vue';
import TileLayer from './TileLayer.vue';
import ItemSpinner from './ItemSpinner.vue';

export default {
  name: 'World',
  props: [
    'msg',
  ],
  components: {
    SelectedEntity,
    Log,
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
      if (this.$refs.world) {
        this.$refs.world.scrollTop = offset.topOffset;
        this.$refs.world.scrollLeft = offset.leftOffset;
        this.setScroll({scrollLeft: offset.leftOffset, scrollTop: offset.topOffset});
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
    }
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
