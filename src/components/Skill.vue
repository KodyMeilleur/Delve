<template>
  <div class="skill"
  >
  <span class="skill-number text-style">{{number + 1}}</span>
  <div class="skill-disabled"></div>
  <div
  v-on:click="useSkill"
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
    },
    number: {
      type: Number
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
    useSkill() {
      this.$emit('clearPotentialPath');
      this.$root.$emit('clearPlayerMoveState');
      this.$root.$emit('useSkill', this.skill);
    }
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
.skill-number {
  position: absolute;
  top: -9px;
  left: -4px;
  z-index: 4;
}
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.text-style {
  font-weight: 800;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
.skill-disabled {
  width: 32px;
  height: 32px;
  position: absolute;
  display: none;
}
</style>
