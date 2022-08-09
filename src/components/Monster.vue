<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    top: ((x * CONST.tileHeight) + movingVerticalOffset + bumpVerticalFramePosition) + 'px',
    left: ((y * CONST.tileWidth) + movingHorizontalOffset + bumpHorizontalFramePosition) + 'px',
    'background-position': (64 * currentFrame) + 'px ' + (0) + 'px'
  }"
  v-on:click="setEntity"
  v-bind:class="{ selected: focusedEntity === this.monster, hoverAvailable: !this.showBattleTiles }"
  class="monster-component"
  >
  <!-- <div class="monster-info">{{ monster.type }} ({{ monster.x }},{{ monster.y }})</div> -->
  <div
  v-bind:class="{ 'grow': shrinkGrow}"
  class="damage-number text-style"> {{ lastDamageSuffered }}
  </div>
  <div
  v-bind:style="{
    'background-image': 'url(' + publicPath + monster.sprite + (monster.isBattling ? 'Inworld/' : 'Outworld/') + animation.state + '/' + (direction || 'West') + '/sheet.png)',
    'background-position': -(64 * animation.currentFrame) + 'px ' + (0) + 'px'
  }"
  class="monster-sprite"
  >
  </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getEntityDirection } from '../services/pathfinding';
import { Animation } from '../models/Animation.js';

export default {
  name: 'Monster',
  props: {
    monster: {
      default: {},
    },
  },
  mounted: function() {
    this.$root.$on('frameBump', this.frameAdvance);
    this.$root.$on('applyMonsterSkillEffect', this.handleSkillEffect);
  },
  beforeDestroy() {
    this.$root.$off('frameBump', this.frameAdvance);
    this.$root.$off('applyMonsterSkillEffect', this.handleSkillEffect);
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
      x: this.monster.x,
      y: this.monster.y,
      currentFrame: 0,
      tilesToTravel: 0,
      path: [],
      animation: { ...this.monster.defaultAnimation },
      skipFrames: [ ...this.monster.animation.skipFrames ],
      isMoving: false,
      lastDamageSuffered: 0,
      shrinkGrow: false,
    }
  },
  watch: {
     // currentTurn: {
     //    handler (currentTurn) {
     //      if (currentTurn.name === 'World') {
     //        this.tilesToTravel = this.monster.path.length;
     //        this.path = this.monster.path;
     //        this.isMoving = true;
     //      }
     //    },
     // },
     'monster.activeBattleTurn': {
       handler (val) {
         if (val === true) {
           console.log(this.monster, 'active monster turn from component!');
           // do stuff and eventually emit turn ended

           setTimeout(this.endTurn, 1000);
         }
       },
       deep: false
      },
      'shrinkGrow': {
        handler (val) {
          const that = this;
          if (val) {
            setTimeout(() => {
              that.shrinkGrow = false;
            }, 250);
          }
        }
      }
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
      'updateMonsterPosition',
      'toggleAttackRangeTiles',
      'setfocusedEntityOverride'
    ]),
    endTurn () {
      this.$emit('turnEnded');
    },
    frameAdvance () {
      let animation = this.animation;
      const monster = this.monster;
      const bumpFrames = animation.bumpFrames && animation.bumpFrames[this.currentFrame];

      if (this.skipFrames.length &&
          this.currentFrame === this.skipFrames[0]) {
        this.skipFrames.shift(); // problem
      } else {
        this.currentFrame += 1;
        animation.currentFrame += 1;
      }
      if (this.animation.currentFrame >= animation.maxNumberOfFrames) {
        this.currentFrame = 0;
        if (animation.shouldLoop === true) {
          animation.refreshSkipFrames();
          animation.currentFrame = 0;
          this.skipFrames = this.animation.skipFrames;
        } else {
          if (animation.state === 'death') {
            this.monster.sprite = this.monster.deathSprite;
          }
          this.animation = Object.assign({}, monster.defaultAnimation);
        }
      }
      if (bumpFrames) {
        this.bumpVerticalFramePosition = bumpFrames.vertical;
        this.bumpHorizontalFramePosition = bumpFrames.horizontal;
      } else {
        this.bumpVerticalFramePosition = 0;
        this.bumpHorizontalFramePosition = 0;
      }

      if (this.isMoving) {
        this.updateMonsterMove();
      }
    },
    setEntity () {
      this.$root.$emit('clearPlayerMoveState');
      this.$root.$emit('clearAttackState');
      if (this.showBattleTiles) {
        this.setfocusedEntityOverride(null);
        this.toggleAttackRangeTiles();
      } else {
        this.setfocusedEntity(this.monster);
      }
    },
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
    handleSkillEffect({monsterID, damage, skill}) {
      if (monsterID === this.monster.id && this.monster.isDead === false) {
        this.animation = new Animation(2, 'hurt', false);
        this.$root.$emit('damageTaken');
        this.$emit('toggleAttackState', false);
        const totalDamage = this.handleDamage(damage, skill);
        this.lastDamageSuffered = totalDamage;
        this.monster.hp = (this.monster.hp - totalDamage < 0) ? 0 : this.monster.hp - totalDamage;
        this.shrinkGrow = true;
        this.deathCheck();
      }
    },
    handleDamage(damage, skill) {
      let totalDamage = 0;
      if (skill.baseDmg === 'intelligence') {
        totalDamage = (damage - this.monster.arcana);
      }
      if (skill.baseDmg === 'might') {
        totalDamage = (damage - this.monster.toughness);
      }

      return totalDamage;
    },
    deathCheck () {
      if (this.monster.hp <= 0) {
        this.animation = new Animation(4, 'death', false);
        this.monster.isDead = true;
        this.$emit('monsterDied', this.monster.id);
      }
    }
  },
  computed: {
      ...mapGetters('world', [
      'focusedEntity',
      'currentTurn',
      'isMonsterTurn',
      'showBattleTiles'
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
.monster-component {
  position: absolute;
  cursor: default;
}
.monster-component:hover {
  cursor: pointer;
  background-image: url('/assets/hudSprites/selectOutRange.png');
}
.selected,.hoverAvailable.monster-component:hover {
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 255, 255, 0.5);
  background-image: url('/assets/hudSprites/select.png');
}
.monster-sprite {
  position: absolute;
  min-width: 64px;
  max-width: 64px;
  min-height: 64px;
  max-height: 64px;
  transition: background-image .1s ease-in-out;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility:    hidden;
  -ms-backface-visibility:     hidden;
}
.monster-info {
  position: absolute;
}
.text-style {
  font-weight: 800;
  color: white;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
}
.damage-number {
  position: absolute;
  top: -16px;
  left: 28px;
  opacity: 0;
}
.grow {
  animation: grow .5s;
  animation-direction: alternate;
  /* animation-delay: 1s; */
}
@keyframes grow{
  0%{
    opacity: 1;
    transform: scale(1);
    top: -16px;
  }
  50%{
    opacity: 0.5;
    transform: scale(5);
  }
  100%{
    display: none;
    opacity: 0;
    top: -46px;
    transform: scale(0);
  }
}
</style>
