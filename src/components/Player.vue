<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
    top: (((this.player.isBattling === true ? this.battleX : this.x) * CONST.tileHeight) + movingVerticalOffset + bumpVerticalFramePosition) + 'px',
    left: (((this.player.isBattling === true ? this.battleY : this.y) * CONST.tileWidth) + movingHorizontalOffset + bumpHorizontalFramePosition) + 'px',
    'background-position': -(64 * currentFrame) + 'px ' + (0) + 'px',
  }"
  v-on:click="setEntity"
  v-bind:class="{ selected: focusedEntity === this.player, movingToStructure: this.movingToStructure, moveFocused: this.showMoveTiles, hoverAvailable: !this.showBattleTiles}"
  class="player-component"
  >
    <!-- IN STRUCTURE SPRITE -->
    <div
    v-bind:style="{
      'background-image': 'url(' + publicPath + player.occupiedSprite + '.png)',
      'background-position': this.playerFrameData,
      'top': (-30) + 'px',
      'z-index': '4',
    }"
    v-if="inStructure && isMoving === false && player.isBattling === false"
    class="player-sprite"
    >
    </div>
    <!-- PLAYER SPRITE -->
    <div
    v-on:click.stop="setEntity"
    v-bind:style="{
      'background-image': 'url(' + publicPath + player.sprite + (player.isBattling ? 'Inworld/' : 'Outworld/') + animation.state + '/' + direction + '/sheet.png)',
      'background-position': -((64) * animation.currentFrame) + 'px ' + (0) + 'px'
    }"
    v-bind:class="{ inStructure: inStructure && isMoving === false && player.isBattling === false, isBattling: player.isBattling === true}"
    class="player-sprite"
    >
    </div>
    <!-- PLAYER PROJECTILES -->
    <Projectile v-if="player.isBattling" :activeProjectileSkill="activeProjectileSkill" v-on:toggleAttackState="toggleAttackState"/>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getEntityDirection, returnShallowMapChunk, getCardinalTiles, getCardinalTilesWithoutDensity, getDirectionToTile, getTilesInDirectionUntilDense } from '../services/pathfinding';
import { processPlacement } from '../services/skillProcesses';
import { Animation } from '../models/Animation.js';
import Projectile from './Projectile.vue';

export default {
  name: 'Player',
  props: {
    player: {
      default: {},
    },
    battleMap: {
      default: null
    }
  },
  components: {
    Projectile,
  },
  mounted: function() {
    this.$root.$on('frameBump', this.frameAdvance);
    this.$root.$on('clearAttackState', this.clearAttackState);
    this.$root.$on('clearPlayerMoveState', this.clearPlayerMoveState);
    this.$root.$on('useSkill', this.useSkill);
    this.$root.$on('applySkillEffect', this.applySkillEffect);
    this.$root.$on('playerDelay', this.setPlayerDelay);
  },
  beforeDestroy() {
    this.$root.$off('frameBump', this.frameAdvance);
    this.$root.$off('clearAttackState', this.clearAttackState);
    this.$root.$off('clearPlayerMoveState', this.clearPlayerMoveState);
    this.$root.$off('useSkill', this.useSkill);
    this.$root.$off('applySkillEffect', this.applySkillEffect);
    this.$root.$off('playerDelay', this.setPlayerDelay);
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
      movingDirection: this.player.movingDirection,
      isMoving: false,
      x: this.player.x,
      y: this.player.y,
      battleX: this.player.battleX,
      battleY: this.player.battleY,
      currentFrame: 0,
      tilesToTravel: 0,
      path: [],
      animation: { ...this.player.animation },
      skipFrames: [ ...this.player.animation.skipFrames ],
      movingToStructure: false,
      inMoveState: false,
      inAttackState: false,
      toggledSkill: null,
      activeProjectileSkill: null,
      delayed: false,
    }
  },
  watch: {
    'player.path': {
      handler (newVal) {
        this.path = Object.assign([], newVal);
        this.tilesToTravel = this.path.length;
        if (this.path.length) {
          this.$emit('toggleMoveState');
          this.isMoving = true;
        }
      },
       deep: true
     },
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
      'updatePlayerPosition',
      'toggleMovingTiles',
      'toggleAttackRangeTiles',
      'setfocusedEntityOverride',
      'applySkillEffectsOnPlayer',
      'unchargeTile',
      'toggleProjectileTiles'
    ]),
    frameAdvance () {

      let animation = this.animation;
      const bumpFrames = animation && animation.bumpFrames && animation.bumpFrames[this.currentFrame];

      if (this.skipFrames.length &&
          this.currentFrame === this.skipFrames[0]) {
        this.skipFrames.shift(); // problem
      } else {
        this.currentFrame += 1;
        animation.currentFrame += 1;
      }
      if (animation.currentFrame >= animation.maxNumberOfFrames) {
        this.currentFrame = 0;
        if (animation.shouldLoop === true) {
          animation.refreshSkipFrames();
          animation.currentFrame = 0;
          this.skipFrames = this.animation.skipFrames;
        } else {
          this.animation = Object.assign({}, this.player.defaultAnimation);
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
        if (this.delayed === true) {
          return;
        } else {
          this.updatePlayerMove();
        }
      }
    },
    updatePlayerMove () {
      let entityX = this.isBattling ? this.battleX : this.x;
      let entityY = this.isBattling ? this.battleY : this.y;

      if (this.movingVerticalOffset === 0 && this.movingHorizontalOffset === 0 && this.path.length) {
        const fullDirection = getEntityDirection({
          x: entityX,
          y: entityY,
          path: this.path
        });
        this.movingDirection = fullDirection.direction;
        this.animation = this.isBattling ? new Animation(8, 'Move', false) : new Animation(8, 'Jump', false);
        this.skipFrames = this.animation.skipFrames;
        if (fullDirection.movingToStructure) {
          this.movingToStructure = true;
        }
      }
      const moveDirection = this.movingDirection;
      const moveAnimationPixelBump = (64 / this.animation.maxNumberOfFrames);
      const that = this;

      function handleTileBump(x, y) {
        that.path.shift();
        that.movingToStructure = false;
        that.updatePlayerPosition({
          player: that.player,
          coords: {
            x,
            y,
            tilesToTravel: that.tilesToTravel
          },
          isBattling: that.isBattling,
          map: that.isBattling ? that.battleMap : that.map
        });

        // TODO: Move this to tile handling function
        const tileMovedTo = that.player.outworldTileOccupied;

        if (tileMovedTo.itemCharged) {
          that.$root.$emit('itemSpinner');
          that.delayed = true;
          that.unchargeTile(tileMovedTo);
        }
      }

      // 1N, 2E, 3S, 4W
      // south
      if (moveDirection === 3) {
        this.movingVerticalOffset += moveAnimationPixelBump;
        if (this.movingVerticalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          entityX = parseInt(entityX) + 1;
          if (this.isBattling) {
            this.battleX = entityX;
          } else {
            this.x = entityX;
          }
          handleTileBump(entityX, entityY);
        }
      }
      // east
      if (moveDirection === 2) {
        this.movingHorizontalOffset += moveAnimationPixelBump;
        if (this.movingHorizontalOffset === 64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          entityY = parseInt(entityY) + 1;
          if (this.isBattling) {
            this.battleY = entityY;
          } else {
            this.y = entityY;
          }
          handleTileBump(entityX, entityY);
        }
      }
      // north
      if (moveDirection === 1) {
        this.movingVerticalOffset -= moveAnimationPixelBump;
        if (this.movingVerticalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingVerticalOffset = 0;
          entityX = parseInt(entityX) - 1;
          if (this.isBattling) {
            this.battleX = entityX;
          } else {
            this.x = entityX;
          }
          handleTileBump(entityX, entityY);
        }
      }
      // west
      if (moveDirection === 4) {
        this.movingHorizontalOffset -= moveAnimationPixelBump;
        if (this.movingHorizontalOffset === -64) {
          this.tilesToTravel -= 1;
          this.movingHorizontalOffset = 0;
          entityY = parseInt(entityY) - 1;
          if (this.isBattling) {
            this.battleY = entityY;
          } else {
            this.y = entityY;
          }
          handleTileBump(entityX, entityY);
        }
      }

      if (this.tilesToTravel === 0) {
        this.animation = new Animation(4, 'Idle', true);
        this.skipFrames = this.animation.skipFrames;
        this.isMoving = false;
        this.inMoveState = false;
        this.$emit('toggleMoveState');
      }
    },
    useSkill (skill) {
      this.setfocusedEntityOverride(null);

      // get chunk of land around player if anchored
      if (skill.anchored === true && this.inAttackState === false && this.showMoveTiles === false) {
        this.inAttackState = true;
        const map = this.isBattling ? this.battleMap : this.map;
        const areaAroundPlayer = returnShallowMapChunk(this.player, map, this.isBattling, skill.range, true);
        const battleTilesToLight = getCardinalTilesWithoutDensity(this.player, areaAroundPlayer, this.isBattling, skill.range);

        if (skill.stepType === 'foot') {
          this.toggleAttackRangeTiles(battleTilesToLight);
        } else if (skill.stepType === 'projectile') {
          this.toggleProjectileTiles(battleTilesToLight);
        }
        this.toggledSkill = skill;
      } else {
        this.clearAttackState();
        this.clearPlayerMoveState();
      }
    },
    toggleAttackState (bool) {
      this.$emit('toggleAttackState', bool);
    },
    applySkillEffect(targetedTile) {
      this.$emit('toggleAttackState', true);
      if (this.toggledSkill.nature === 'aggressive') {

        const attackDirection = getDirectionToTile(this.player, targetedTile, this.isBattling);
        this.movingDirection = attackDirection.direction;

        if (this.toggledSkill.stepType === 'projectile') {

          const playerStatDamage = Math.floor(this.player[this.toggledSkill.baseDmg] * (1/4));
          const damage = (playerStatDamage + this.toggledSkill.addedDmg);
          // TODO: Add projectile moving logic
          this.projectileAnimation(targetedTile, damage);
        }
        if (this.toggledSkill.stepType === 'foot') {

          const targetedEntity = targetedTile.monsters[0] || targetedTile.players[0];
          if (targetedEntity && targetedEntity.isDead === false) {

            // TODO: ADD WEAPON DAMAGE AND EXTRA DAMAGE TO THIS FORMULA
            const playerStatDamage = Math.floor(this.player[this.toggledSkill.baseDmg] * (1/4));
            const damage = (playerStatDamage + this.toggledSkill.addedDmg);

            this.$root.$emit('applyTileSkillEffect', {skill: this.toggledSkill, tile: targetedTile, damage, targetedEntity});
          }
        }
      } else if (this.toggledSkill.nature === 'defensive') {
        console.log('defense');
      } else if (this.toggledSkill.nature === 'placement') {
        processPlacement(this.toggledSkill, targetedTile, this.player.id, this.player.name);
      }
      this.animation = new Animation(this.toggledSkill.animationFrames, this.toggledSkill.animation, false);
      this.applySkillEffectsOnPlayer({player: this.player, skill: this.toggledSkill});
      this.applyManaGains();
      this.clearAttackState();
    },
    applyManaGains () {
      if (this.toggledSkill.costType === 'mp') {
        let manaGains = {
          RED: 0,
          BLUE: 0,
          GREEN: 0,
          BLACK: 0,
          WHITE: 0,
          PURPLE: 0,
        };

        if (this.toggledSkill.costSlotOne) {
          manaGains[this.toggledSkill.type] -= this.toggledSkill.costSlotOne;
        }
        if (this.toggledSkill.costSlotTwo) {
          manaGains[this.toggledSkill.typeTwo] -= this.toggledSkill.costSlotTwo;
        }

        this.$root.$emit('manaGain', manaGains);
      }
    },
    setEntity () {
      this.inMoveState = false;
      this.setfocusedEntityOverride(null);
      if (this.showBattleTiles) {
        this.clearAttackState();
      } else {
        this.setfocusedEntity(this.player);
        if (this.currentTurn === this.player && this.inMoveState === false && this.showBattleTiles === false && this.delayed === false) {
          this.movePlayer();
        }
      }
    },
    movePlayer () {
        let tilesToLight;
        if (this.showMoveTiles === false) {
          const map = this.isBattling ? this.battleMap : this.map;
          const areaAroundPlayer = returnShallowMapChunk(this.focusedEntity, map, this.isBattling);
          tilesToLight = getCardinalTiles(this.focusedEntity, areaAroundPlayer, this.isBattling);
        }
        this.toggleMovingTiles(tilesToLight);
        this.inMoveState = true;
    },
    clearAttackState() {
      this.toggleAttackRangeTiles();
      this.toggleProjectileTiles();
      this.inAttackState = false;
      this.toggledSkill = null;
    },
    clearPlayerMoveState () {
      this.inMoveState = false;
      this.isMoving = false;
      this.$emit('clearPotentialPath');
      this.toggleMovingTiles();
    },
    setPlayerDelay (bool) {
      this.delayed = bool;
    },
    projectileAnimation(targetTile, damage) {
      const tileInfo = getTilesInDirectionUntilDense(this.battleMap, targetTile, this.movingDirection);
      const tileCount = tileInfo.tileCount;
      const targetId = tileInfo.monsterId;

      this.activeProjectileSkill = ({skill: this.toggledSkill, direction: this.movingDirection, tileCount, targetId, damage});
    }
  },
  computed: {
      ...mapGetters('world', [
      'focusedEntity',
      'currentTurn',
      'leftOffset',
      'topOffset',
      'showMoveTiles',
      'map',
      'isBattling',
      'showBattleTiles'
    ]),
    playerFrameData : function () {
        return ((64) * this.currentFrame) + 'px ' + (0) + 'px'
    },
    inStructure: function() {
      return this.player.outworldTileOccupied.structure ? true : false;
    },
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
.player-component:hover {
  cursor: pointer;
  background-image: url('/assets/hudSprites/selectOutRange.png');
}
.selected, .hoverAvailable.player-component:hover {
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 255, 255, 0.5);
  background-image: url('/assets/hudSprites/select.png');
}
.player-sprite {
  position: absolute;
  min-width: 64px;
  max-width: 64px;
  min-height: 64px;
  max-height: 64px;
  top: -7px;
}
.player-sprite.isBattling {
  top: 0;
}
.player-info {
  position: absolute;
}
.player-component {
  position: absolute;
  cursor: default;
  -webkit-transform: scale(1) rotate(0.01deg);
  transform: scale(1) rotate(0.01deg);
  -webkit-transition: -webkit-transform 0.5s;
  transition: transform 0.5s;
}
.moveFocused {
  pointer-events: none;
}
.player-component.movingToStructure {
  -webkit-transform: scale(0.5) rotate(0.01deg);
  transform: scale(0.5) rotate(0.01deg);
  -webkit-transition: -webkit-transform 0.5s;
  transition: transform 0.5s;
}
.player-sprite.inStructure {
  display: none;
}
.player-move-effect {
  position: absolute;
  width: 64px;
  height: 64px;
  animation: createBox .25s;
  z-index: 2;
}
.move-icon-container {
  z-index: 9;
}
.player-move-effect.top {
  top: -40px;
}
.player-move-effect.down {
  top: 40px;
}
.player-move-effect.right {
  left: 40px;
}
.player-move-effect.left {
  left: -40px;
}
.player-move-effect:hover {
  transform: scale(1.2,1.2);
}
@keyframes createBox {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
