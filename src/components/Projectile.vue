<template>
  <div v-bind:style="{
    width: 64 + 'px',
    height: 64 + 'px',
  }"
  class="projectile-component"
  >
  <!-- RESUSE EFFECTS -->

    <img
    v-bind:class="{ visibility: this.animationComplete === false, 'projectile-sprite': true}"
    ref="skillSprite"
    :src="skill && skill.effectSprite"
    />
  </div>
</template>

<script>
// import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Projectile',
  props: {
    activeProjectileSkill: {
      default: null
    }
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      skill: this.activeProjectileSkill && this.activeProjectileSkill.skill,
      width: this.activeProjectileSkill && this.activeProjectileSkill.skill.spriteWidth,
      height: this.activeProjectileSkill && this.activeProjectileSkill.skill.spriteHeight,
      animationComplete: true,
    }
  },
  watch: {
    activeProjectileSkill: {
      handler (newVal) {
        this.skill = newVal.skill;
        this.width = newVal.skill.spriteWidth;
        this.height = newVal.skill.spriteHeight;
        this.projectileStartup();
      },
       deep: true
     },
  },
  methods: {
    projectileStartup () {
      this.animationComplete = false;
      const that = this;
      const travelDirection = this.activeProjectileSkill.direction;
      const projectileElem = this.$refs.skillSprite;
      const stepSize = 6;
      const tilesToTravel = this.activeProjectileSkill.tileCount;
      let pixelsTraveled = 0;
      let xPosition = 0;
      let yPosition = 0;

      function doAnimation() {

        pixelsTraveled += stepSize;

        if (travelDirection === 1) {
          xPosition = 0;
          yPosition = -(pixelsTraveled);
        }
        if (travelDirection === 2) {
          xPosition = pixelsTraveled;
          yPosition = 0;
        }
        if (travelDirection === 3) {
          xPosition = 0;
          yPosition = (pixelsTraveled);
        }
        if (travelDirection === 4) {
          xPosition = -(pixelsTraveled);
          yPosition = 0;
        }

        projectileElem.style.transform = 'translate3d(' + `${xPosition}px, ${yPosition}px, 0px)`;

        // stop animation if total pixels traveled completed
        if (pixelsTraveled >= (tilesToTravel * 64)) {
          that.animationComplete = true;

          return;
        } else {
          requestAnimationFrame(doAnimation);
        }
      }

      doAnimation();
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.projectile-component {
  position: absolute;
  cursor: default;
}
.small-projectile-sprite {
  position: absolute;
  min-width: 32px;
  max-width: 32px;
  min-height: 32px;
  max-height: 32px;
  transition: background-image .1s ease-in-out;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility:    hidden;
  -ms-backface-visibility:     hidden;
}
.projectile-sprite {
  visibility: hidden;
}
.visibility {
  visibility: visible!important;
}
</style>
