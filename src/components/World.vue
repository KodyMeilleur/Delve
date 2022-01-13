<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="world-container">
      <div
      v-on:scroll.passive="handleScroll"
      class="world-box"
      ref="world"
      >
        <SelectedEntity v-on:lootStructure="loot"/>
        <Log />
        <Inventory />
        <FocusStats />
        <LootMenu :lootTile="lootTile"/>
        <div
        v-bind:class="{
          shaking,
        }"
        >
          <div class="entities">
            <EntityLayer />
          </div>
          <TileLayer :map="map"/>
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

import EntityLayer from './EntityLayer.vue';
import TileLayer from './TileLayer.vue';

export default {
  name: 'World',
  props: [
    'msg',
  ],
  components: {
    SelectedEntity,
    Log,
    EntityLayer,
    TileLayer,
    Inventory,
    FocusStats,
    LootMenu,
  },
  mounted () {
    this.$root.$on('shakeWorld', this.shakeEffect);
    this.$root.$on('centerPlayer', this.centerPlayer);
  },
  updated () {
    console.log('world render');
    this.setScroll({scrollLeft: this.scrollLeftCache += 2, scrollTop: this.scrollTopCache += 2});
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
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setScroll',
    ]),
    loot (tile) {
      const newTile = Object.assign({}, tile);
      this.lootTile = newTile;
    },
    shakeEffect () {
      this.shaking = !this.shaking;
    },
    centerPlayer (offset) {
      this.$refs.world.scrollTop = offset.topOffset;
      this.$refs.world.scrollLeft = offset.leftOffset;
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
