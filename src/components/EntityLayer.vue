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
    }
  },
  updated () {
    console.log('entitylayer re-render')
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
