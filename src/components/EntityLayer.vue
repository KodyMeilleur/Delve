<template>
  <div>
    <Player v-for="player in players" v-bind:key="player.name" :player="player"/>
    <Monster v-for="monster in monsters" v-bind:key="monster.id" :monster="monster"/>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters } from 'vuex';
import Player from './Player.vue';
import Monster from './Monster.vue';

export default {
  name: 'EntityLayer',
  props: {},
  components: {
    Player,
    Monster,
  },
  data () {
    return {
      CONST: CONST,
      totalMonsterCount: 0,
      // currentFinishedMonsterTurns: 0,
    }
  },
  updated () {
    console.log('entitylayer render...')
  },
  watch: {
    'monsters.length': {
      handler (newVal) {
        this.totalMonsterCount = newVal;
      },
       deep: true
     },
  },
  methods: {
    // ...mapMutations('world', [
    //   'cycleTurn',
    // ]),
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
