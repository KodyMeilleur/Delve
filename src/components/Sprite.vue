<template>
  <div v-bind:style="{
    width: '64px',
    height: '64px'
  }">
    <img

    :src="publicPath + path"
    class="tile-sprite-img"
    />
    <span class="frame-counter">{{ frame }}</span>
  </div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters } from 'vuex';

export default {
  name: 'Sprite',
  props: {
    path: {
      default: '',
    },
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
    }
  },
  computed: {
      ...mapGetters('world', [
      'frame',
    ])
  },
  methods: {},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.frame-counter {
  position: absolute;
}
</style>
