<template>
  <div class="tools">
    <button @click="generateContinent">Generate Continent</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { refineLandmass } from '../services/generateLand';


export default {
  name: 'AdminTools',
  props: {},
  data () {
    return {
      repositories: [],
    }
  },
  computed: {
    ...mapGetters('world', [
      'map',
    ])
  },
  methods: {
    ...mapMutations('world', [
      'mergeFirstLandmass',
    ]),
    generateContinent () {
      const randomLandmass = refineLandmass();

      // let longestRowInIteration = 0;
      // randomLandmass.forEach((row) => {
      //   longestRowInIteration = (row.length > longestRowInIteration) ? row.length : longestRowInIteration;
      // })

      // 12 x 14
      this.mergeFirstLandmass(randomLandmass);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tools {
  display: flex;
}
</style>
