<template>
  <div class="creature-container" v-if="shouldShow">
    <div class="body">
      <div>
        <input type="radio" name="monster" value="skeleton"
               checked>
        <label for="skeleton">Skeleton</label>
      </div>

      <!-- <div>
        <input type="radio" name="monster" value="goblin">
        <label for="goblin">Goblin</label>
      </div> -->

    </div>
    <div class="footer">
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
// import CONST from '../CONST';
// import { mapGetters } from 'vuex';

export default {
  name: 'CreatureSpawner',
  props: [
    'shouldShow',
  ],
  data () {
    return {
      publicPath: process.env.BASE_URL,
    }
  },
  computed: {
    //   ...mapGetters('world', [
    //   'frame',
    // ])
  },
  methods: {
    close () {
      this.$emit('close');
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
</style>
