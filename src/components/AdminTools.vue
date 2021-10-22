<template>
  <div class="tools">
    <button @click="generateContinent">Generate Continent</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    generateContinent () {
      refineLandmass();
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
