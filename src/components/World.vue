<template>
  <div>
    <h1>{{ msg }}</h1>
    <div class="world-container">
      <div
      v-on:scroll.passive="handleScroll"
      class="world-box"
      >
        <SelectedEntity />
        <div class="landmass">
          <div class="entities">
            <EntityLayer :frame="frame"/>
          </div>
          <div class="row" v-for="row in map" v-bind:key="row.length + Math.random()">
              <Tile v-for="cell in row"
                :tile="cell"
                v-on:potentialPathCalc="updatePotentialPath"
                v-on:clearPotentialPath="clearPotentialPath"
                v-bind:key="cell.density + Math.random()"
              />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

import Tile from './Tile.vue';
import SelectedEntity from './selectedEntity.vue';
import EntityLayer from './EntityLayer.vue';

export default {
  name: 'World',
  props: [
    'msg',
    'currentTurn',
    'frame'
  ],
  components: {
    Tile,
    SelectedEntity,
    EntityLayer,
  },
  updated () {
    console.log('world re-render')
    this.setScroll({scrollLeft: this.scrollLeftCache += 2, scrollTop: this.scrollTopCache += 2});
  },
  data () {
    return {
      repositories: [],
      scrollLeftCache: 0,
      scrollTopCache: 0,
      potentialPath: [],
    }
  },
  // watch: {
  //   frame: function (frame) {
  //     this.$emit('frameBump', frame);
  //   },
  // },
  computed: {
    ...mapGetters('world', [
      'map',
      'players',
      // 'currentTurn',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'setScroll',
    ]),
    updatePotentialPath (path) {
      this.potentialPath = path;
      this.$emit('updateTilePaths', this.potentialPath);
    },
    clearPotentialPath () {
      this.potentialPath = [];
      this.$emit('updateTilePaths', this.potentialPath);

    },
    handleScroll ($event) {
      // console.log($event);
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
  width: 640px;
  height: 448px;
  overflow: scroll;
  background-color: #33232a;
  position: relative;
}
.landmass {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
  left: 0;
}
.row {
  display: inline-flex;
  height: 64px;
}
.entities {
  width: 0;
  height: 0;
  float: left;
  position: absolute;
  z-index: 2;
}
.turn-order {
  position: relative;
  top: -10px;
}
</style>
