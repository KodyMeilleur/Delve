<template>
  <div>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'Cache',
  // props: {
  //   currentTurn: {
  //     default: null,
  //   },
  //   turnIndex
  // },
  // constantly updated values that can be occasionally sent to the Vuex store.
  // made for performance
  data () {
    return {
      CONST: CONST,
      currentTurn: null,
      turnIndex: 0,
    }
  },
  methods: {
    ...mapMutations('world', [
      'cycleTurn',
    ]),
    saveTurn () {
      // if no currentTurn is set, grab first slot from players array
      // else get length and increment index. set currentPlayer from player array
      const playerAmount = this.players.length;
      if (this.currentTurn === null) {
        this.currentTurn = this.players[this.turnIndex];
      } else {
        this.turnIndex = (this.turnIndex >= (playerAmount - 1)) ? 0 : (this.turnIndex + 1);
        this.currentTurn = this.players[this.turnIndex];
      }
      console.log('save turn~!', this.turnIndex, this.currentTurn);
      this.$emit('updateTurn', this.currentTurn);
    }
  },
  computed: {
    ...mapGetters('world', [
      'players',
    ])
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
