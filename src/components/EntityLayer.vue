<template>
  <div>
    <Player :frame="frame" v-for="player in players" v-bind:key="player.name" :player="player"/>
    <Monster :frame="frame" v-for="monster in monsters" v-bind:key="monster.id" :monster="monster" v-on:turnEnded="incrementTurnsCompleted"/>
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
      totalMonsterCount: 0,
      currentFinishedMonsterTurns: 0,
    }
  },
  updated () {
    console.log('entitylayer render...');
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
    ...mapActions('world', [
      'cycleTurn',
    ]),
    incrementTurnsCompleted () {
      this.currentFinishedMonsterTurns += 1;
      if (this.currentFinishedMonsterTurns === this.totalMonsterCount) {
        console.log('All monster turns over!');
        this.currentFinishedMonsterTurns = 0;
        this.cycleTurn();
      }
    }
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
