<template>
  <div v-bind:style="{
    width: 64 + 'px',
    height: 64 + 'px',
  }"
  v-bind:class="{
    'projectile-component': true,
    'east ': this.direction === 2,
    'west': this.direction === 4,
    'north': this.direction === 1,
    'south': this.direction === 3,
    }"
  >
  <div class="projectile-wrapper" ref="skillSprite">
  <!-- RESUSE EFFECTS -->
    <img
    v-bind:class="{
      visibility: this.animationComplete === false,
      'projectile-sprite': true,
      }"

    :src="skill && skill.effectSprite"
    />
    <!-- SPLASH -->
    <img
    v-bind:class="{
      visibility: this.showSplash,
      'splash-sprite': true,
      'projectile-sprite': true,
      'east-splash': this.direction === 2,
      'west-splash': this.direction === 4,
      'north-splash': this.direction === 1,
      'south-splash': this.direction === 3,
      }"
    :src="skill && skill.splashSprite"
    />
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Beam',
  props: {
    activeBeamSkill: {
      default: null
    },
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      skill: this.activeBeamSkill && this.activeBeamSkill.skill,
      width: this.activeBeamSkill && this.activeBeamSkill.skill.spriteWidth,
      height: this.activeBeamSkill && this.activeBeamSkill.skill.spriteHeight,
      animationComplete: true,
      showSplash: false,
      direction: 0,
    }
  },
  watch: {
    activeBeamSkill: {
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
      const travelDirection = this.activeBeamSkill.direction;
      this.direction = travelDirection;
      const projectileElem = this.$refs.skillSprite;
      const stepSize = 8;
      const tilesToTravel = this.activeBeamSkill.tileCount;
      let pixelsTraveled = 0;
      let xPosition = 0;
      let yPosition = 0;

      function doAnimation() {

        pixelsTraveled += (stepSize);

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
        if (pixelsTraveled >= (tilesToTravel * 64) - 32) {
          that.animationComplete = true;
          that.showSplash = true;
          that.$root.$emit('damageTaken');
          setTimeout(() => {
            that.showSplash = false;
            that.$emit('toggleAttackState', false);
            if (that.activeBeamSkill.targetId) {
              that.$root.$emit('applyMonsterSkillEffect', {monsterID: that.activeBeamSkill.targetId, skill: that.skill, damage: that.activeBeamSkill.damage});
            }
          }, that.skill.splashDelay);

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
.splash-sprite {
  position: absolute;
}
.visibility {
  visibility: visible!important;
}
.east {
  right: -25px;
}
.north {
  top: -25px;
}
.south {
  bottom: -25px;
}
.west {
  left: -25px;
}
.east-splash {
  left: -26px;
}
.west-splash {
  left: 26px;
  transform: rotate(180deg);
}
.north-splash {
  top: 26px;
  left: 0;
  transform: rotate(270deg);
}
.south-splash {
  bottom: -26px;
  transform: rotate(90deg);
  left: 0;
}
</style>
