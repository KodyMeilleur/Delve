<template>
  <div class="creature-container" v-if="shouldShow">
    <div class="body">
      <div>
        <input
        @change="changeValue"
        type="radio"
        id="Skeleton"
        name="monster"
        value="Skeleton"
        >
        <label for="Skeleton">Skeleton</label>
      </div>
    </div>
    <div class="footer">
      <div class="grid-location">
        <div class="grid-position">
          <label for="xPosition">X:</label>
          <input type="number" id="xPosition" name="xPosition" v-model="xPosition">
        </div>
        <div class="grid-position">
          <label for="yPosition">Y:</label>
          <input type="number" id="yPosition" name="yPosition" v-model="yPosition">
        </div>
      </div>
      <button @click="create" :disabled="!selectedEntity">Create</button>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
// import CONST from '../CONST';
import { Skeleton } from '../models/monsters/Skeleton';
import { mapMutations } from 'vuex';

export default {
  name: 'CreatureSpawner',
  props: [
    'shouldShow',
  ],
  data () {
    return {
      publicPath: process.env.BASE_URL,
      selectedEntity: null,
      xPosition: null,
      yPosition: null,
    }
  },
  computed: {
    //   ...mapGetters('world', [
    //   'frame',
    // ])
  },
  methods: {
    ...mapMutations('world', [
      'addMonsterToGame',
    ]),
    close () {
      this.selectedEntity = null;
      this.$emit('close');
    },
    changeValue ($event) {
      this.selectedEntity = $event.target.value;
    },
    create () {
      let creature;
      switch (this.selectedEntity) {
        case 'Skeleton':
          creature = new Skeleton(this.xPosition,this.yPosition);
          break;
        default:
          break;
      }
      console.log(creature)
      this.addMonsterToGame(creature);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.creature-container {
  position: absolute;
  width: 300px;
  height: 192px;
  background-color: grey;
  border: 2px solid white;
  border-radius: 5px;
  z-index: 20;
  top: 100px;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.grid-location {
  display: flex;
  justify-content: center;
  position: relative;
}
.grid-position > input {
  width: 69px;
}
</style>
