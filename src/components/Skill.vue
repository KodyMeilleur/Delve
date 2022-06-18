<template>
  <div class="skill"
  >
  <div
  v-if="skill"
  v-bind:style="{
    'background-image': 'url(' + publicPath + skill.icon,
    /* 'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px', */
  }"
  class="default-icon">
  </div>
  </div>
</template>

<script>
// import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Skill',
  props: {
    skill: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
    }
  },
  methods: {
    ...mapMutations('world', [
    ]),
  },
  computed: {
    ...mapGetters('world', [
    ]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.skill {
  position: relative;
  font-variant: small-caps;
  font-family: system-ui;
  width: 32px;
  height: 32px;
  background-image: url('/assets/hudSprites/skillSlotIcon.png');
}

.default-icon {
  position: relative;
  width: 32px;
  height: 32px;
  z-index: 2;
  /* top: 12px;
  left: 260px; */
  cursor: pointer;
}
.default-icon:hover {
  transform: scale(1.1,1.1);
}
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
