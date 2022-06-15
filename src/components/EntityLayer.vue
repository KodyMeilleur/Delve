<template>
  <div>
    <Player v-for="player in players" v-bind:key="player.name + entitySeed" :player="player"/>
    <Monster v-for="monster in monsters" v-bind:key="monster.id" :monster="monster"/>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapActions } from 'vuex';
import Player from './Player.vue';
import Monster from './Monster.vue';

export default {
  name: 'EntityLayer',
  props: {
    frame: Number,
  },
  components: {
    Player,
    Monster,
  },
  data () {
    return {
      CONST: CONST,
      currentFrame: 0,
      entitySeed: 0,
    }
  },
  updated () {
    console.log('entitylayer render...');
  },
  mounted: function() {
    this.entitySeed = Math.random();
  },
  methods: {
    // ...mapMutations('world', [
    //   'cycleTurn',
    // ]),
    ...mapActions('world', [
      'cycleTurn',
    ]),
  },
  computed: {
    ...mapGetters('world', [
      'players',
      'monsters',
    ])
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
