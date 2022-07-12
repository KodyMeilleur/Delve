<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    /* top: ((x * CONST.tileHeight) + movingVerticalOffset + bumpVerticalFramePosition) + 'px',
    left: ((y * CONST.tileWidth) + movingHorizontalOffset + bumpHorizontalFramePosition) + 'px', */
  }"
  class="projectile-component"
  >
  <!-- RESUSE EFFECTS -->
    <img
    v-if="skill"
    ref="dominionChangeSprite"
    class="dominion-change"
    :src="skill.effectSprite"
    />
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getEntityDirection } from '../services/pathfinding';

export default {
  name: 'Projectile',
  props: {
    skill: {
      default: {}
    }
  },
  mounted: function() {
    // this.$root.$on('frameBump', this.frameAdvance);
  },
  beforeDestroy() {
    // this.$root.$off('frameBump', this.frameAdvance);
  },
  data () {
    return {
      width: CONST.tileWidth,
      height: CONST.tileHeight,
      CONST: CONST,
      publicPath: process.env.BASE_URL,
      bumpVerticalFramePosition: 0,
      bumpHorizontalFramePosition: 0,
      movingVerticalOffset: 0,
      movingHorizontalOffset: 0,
      movingDirection: 4,
      x: this.skill.startingX,
      y: this.skill.startingY,
      tilesToTravel: 0,
    }
  },
  watch: {},
  methods: {
    ...mapMutations('world', [
    ]),
    updateMonsterMove () {
      if (this.movingVerticalOffset === 0 && this.movingHorizontalOffset === 0 && this.path.length) {
        const fullDirection = getEntityDirection({
          x: this.x,
          y: this.y,
          path: this.path
        });
        this.movingDirection = fullDirection.direction;

        this.animation = new Animation(8, 'Jump', false);
      }
      const moveDirection = this.movingDirection;

      // Failsafe for no found path
      if (this.path.length <= 0) {
        this.isMoving = false;
        this.$emit('turnEnded');

        return;
      }

      // 1N, 2E, 3S, 4W
      // south
      if (moveDirection === 3) {
        this.movingVerticalOffset += CONST.monsterAnimationPixelBump;
        if (this.movingVerticalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          this.x = parseInt(this.x) + 1;
          this.path.shift();
        }
      }
      // east
      if (moveDirection === 2) {
        this.movingHorizontalOffset += CONST.monsterAnimationPixelBump;
        if (this.movingHorizontalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          this.y = parseInt(this.y) + 1;
          this.path.shift();
        }
      }
      // north
      if (moveDirection === 1) {
        this.movingVerticalOffset -= CONST.monsterAnimationPixelBump;
        if (this.movingVerticalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          this.x = parseInt(this.x) - 1;
          this.path.shift();
        }
      }
      // west
      if (moveDirection === 4) {
        this.movingHorizontalOffset -= CONST.monsterAnimationPixelBump;
        if (this.movingHorizontalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          this.y = parseInt(this.y) - 1;
          this.path.shift();
        }
      }

      if (this.tilesToTravel === 0) {
        // TODO: REMEMBER TO SET inworldTileOccupied ON BATTLE MOVE!
        this.updateMonsterPosition({
          monster: this.monster,
          coords: {
            x: this.x,
            y: this.y,
          }
        })
        this.animation = new Animation(2, 'Idle', true);
        this.isMoving = false;
        this.$emit('turnEnded'); // trigger event on the current instance
      }
    },
    handleSkillEffect({monsterID, damage}) {
      if (monsterID === this.monster.id && this.monster.isDead === false) {
        this.animation = new Animation(2, 'hurt', false);
        this.lastDamageSuffered = damage;
        this.monster.hp = (this.monster.hp - damage < 0) ? 0 : this.monster.hp - damage;
        this.shrinkGrow = true;
        this.deathCheck();
      }
    },
  },
  computed: {
      ...mapGetters('world', [
    ]),
    direction: function () {
      // 1N, 2E, 3S, 4W,  0 non moving South
      switch (this.movingDirection) {
        case 0:
          return 'South'
        case 1:
          return 'North'
        case 2:
          return 'East'
        case 3:
          return 'South'
        case 4:
          return 'West'
        default:
          return '';
      }
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
</style>
