<template>
  <div v-bind:style="{
    minWidth: width + 'px',
    minHeight: height + 'px'
  }"
  class="active tile-component"
  >
  <div
  v-if="shouldShow"
  v-on:mouseover="onMouseOver"
  v-on:mouseleave="onMouseExit"
  v-on:click="setEntity"
  >
    <span
      v-if="(this.showMoveTiles && !this.moveHighlighted && this.hover) || (this.hover && this.showMoveTiles && (this.tile.x === this.currentTurn.x && this.tile.y === this.currentTurn.y))"
      class="out-range"
      v-bind:style="{
        'background-position': this.frameStyle,
      }"
      >
    </span>
    <span
      v-if="(this.showBattleTiles && !this.attackHighlighted && !this.rangedHighlighted && this.hover)"
      v-on:click="exitBattleState"
      class="battle-out-range"
      v-bind:style="{
        'background-position': this.frameStyle,
      }"
      >
    </span>
    <span v-if="(this.moveHighlighted || focusedEntity === this.tile || this.hover && !this.showMoveTiles && !this.moveHighlighted) && !potentialPath && !this.attackHighlighted && !this.showBattleTiles"
    v-on:click="goToTile"
    class="highlighted"
    v-bind:style="{
      'background-position': this.frameStyle,
    }"
    >
    </span>
    <span v-if="(this.attackHighlighted && !this.hover)"
    class="attack-highlighted"
    v-bind:style="{
      'background-position': this.frameStyle,
    }"
    >
    </span>
    <span v-if="(this.rangedHighlighted && !this.hover)"
    class="range-highlighted"
    v-bind:style="{
      'background-position': this.frameStyle,
    }"
    >
    </span>
    <span v-if="(this.attackHighlighted && this.hover)"
    v-on:click.stop="skillOnTile"
    class="attack-highlighted-hover"
    v-bind:style="{
      'background-position': this.frameStyle,
    }"
    >
    </span>
    <span v-if="(this.rangedHighlighted && this.hover)"
    v-on:click.stop="skillOnTile"
    class="range-highlighted-hover"
    v-bind:style="{
      'background-position': this.frameStyle,
    }"
    >
    </span>
    <span v-if="potentialPath"
    v-on:click.stop="goToTile"
    class="potentialPath"
    v-bind:style="{
      'background-position': this.frameStyle,
    }"
    >
    </span>
      <div class="tile-sprite">
        <!-- RESUSE EFFECTS -->
        <img
        v-if="tile.battleTile"
        ref="dominionChangeSprite"
        class="dominion-change"
        src=""
        />
        <img
        v-if="showSkillEffect"
        ref="currentSkillEffectSprite"
        class="skill-sprite"
        :src="currentSkillEffectSpritePath"
        v-bind:style="{
          width: (currentSkillData.spriteWidth) + 'px',
          height: (currentSkillData.spriteHeight) + 'px',
          top: (currentSkillData.top) + 'px',
          left: (currentSkillData.left) + 'px',
        }"
        />
        <img
        v-if="tile.battleTile"
        ref="manaCollectSprite"
        class="mana-charge"
        src=""
        />
        <!-- Structure Markup -->
        <div class="tile-structure" v-if="tile && tile.structure">
          <div>
            <!-- DEMOLISH EFFECT -->
            <div
            v-if="tile.structure.demolished === true && demolishFrame < 20"
            v-bind:style="{
              'background-position': -(65 * demolishFrame) + 'px ' + (0) + 'px',
              top: (bumpVerticalFramePosition - 5) + 'px',
              left: (bumpHorizontalFramePosition) + 'px',
            }"
            class="demolish-sprite"
            >
            </div>
            <div
            v-bind:style="{
              top: (bumpVerticalFramePosition - 20) + 'px',
              left: (bumpHorizontalFramePosition) + 'px',
            }"
            v-if="tile.structure.explorable && tile.structure.explored === false"
            class="structure-sprite-effect unexplored"
            >
            </div>
          </div>
          <div
          v-if="!tile.structure.eventStructure"
          v-bind:style="{
            'background-image': 'url(' + publicPath + structureSprite + '01' +'.png)',
            'background-position': (64 * currentFrame) + 'px ' + (0) + 'px',
            top: (bumpVerticalFramePosition + tile.structure.structureVerticalOffset) + 'px',
            left: (bumpHorizontalFramePosition) + 'px',
          }"
          v-bind:class="{ unexplored: tile.structure.explorable && tile.structure.explored === false}"
          class="structure-sprite"
          >
          </div>
        </div>
        <!-- PATHS -->
        <Paths v-if="!tile.structure" :tile="tile" :bumpVerticalFramePosition="bumpVerticalFramePosition"/>
        <!-- DOMINIONS -->
        <div class="tile-dominions" v-if="tile.battleTile">
          <div>
            <div
            ref="manaValueSlotOne"
            v-bind:style="{
              'background-position': this.quarterFrameStyle,
              'background-image': 'url(' + publicPath + 'assets/Tiles/Dominions/' + capitalizeString(tile.manaTypeSlotOne) + '/sheet0.png' + ')',

            }"
            class="dominion-sprite"
            >
            </div>
            <div
            ref="manaValueSlotTwo"
            v-bind:style="{
              'background-position': this.quarterFrameStyle,
              'background-image': 'url(' + publicPath + 'assets/Tiles/Dominions/' + capitalizeString(tile.manaTypeSlotTwo) + '/sheet0.png' + ')',

            }"
            class="dominion-sprite"
            >
            </div>
          </div>
        </div>
        <!-- EVENT SPRITE -->
        <!-- TODO: Make Event GIF -->
        <!-- <div
        v-if="tile.structure && tile.structure.eventStructure || tile.event"
        v-bind:style="{
          'background-position': (64 * eventSpriteFrames) + 'px ' + (0) + 'px',
          top: (bumpVerticalFramePosition - 5) + 'px',
          left: (bumpHorizontalFramePosition) + 'px',
        }"
        class="event-sprite"
        >
        </div> -->
        <div
        v-bind:style="{
          'background-image': 'url(' + publicPath + tile.sprite + ')',
          'background-position': (64 * (isBattling ? quarterFrame : currentFrame)) + 'px ' + (0) + 'px',
          top: (tile.type === 'Void' || tile.battleTile ? 0 : bumpVerticalFramePosition) + 'px',
          left: (tile.type === 'Void' ? 0 : bumpHorizontalFramePosition) + 'px',
        }"
        class="tile-sprite tile-sprite-img"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CONST from '../CONST';
import { mapGetters, mapMutations } from 'vuex';
import { getRandomInt } from '../services/generateLand';
import { findPath, returnShallowMapChunk } from '../services/pathfinding';
import Paths from './Paths.vue';

export default {
  name: 'Tile',
  props: {
    tile: {
      default: {},
    },
    battleMap: {
      default: null
    }
  },
  components: {
    Paths,
  },
  data () {
    return {
      width: CONST.tileWidth,
      height: CONST.tileHeight,
      publicPath: process.env.BASE_URL,
      shouldShow: false,
      hover: false,
      frame: 0,
      quarterFrame: 0,
      // Variables for scroll data
      xOffset: 0,
      attackHighlighted: false,
      rangedHighlighted: false,
      showSkillEffect: false,
      currentSkillEffectSpritePath: '',
      currentSkillData: null,
      yOffset: 0,
      currentFrame: 0,
      demolishFrame: 0,
      structureEffectDelayList: [],
      moveHighlighted: false,
      bumpVerticalFramePosition: 0,
      bumpHorizontalFramePosition: 0,
      overTimeout: null,
      travelPath: null,
      potentialPath: false,
      showCurrentEffect: false,
      bumpAnimationMap : {
        // pixels to bump by on frame
        0: {
          vertical: -7,
          horizontal: 0
        },
        1: {
          vertical: -7,
          horizontal: 0
        },
        2: {
          vertical: -6,
          horizontal: 0
        },
        3: {
          vertical: -6,
          horizontal: 0
        },
        4: {
          vertical: -5,
          horizontal: 0
        },
        5: {
          vertical: -5,
          horizontal: 0
        },
        6: {
          vertical: -6,
          horizontal: 0
        },
        7: {
          vertical: -6,
          horizontal: 0
        },
      },
    }
  },
  mounted: function() {
    this.$parent.$on('updateTilePaths', this.isPotentialPathTile);
    this.$root.$on('frameBump', this.frameAdvance);
    this.$root.$on('applyTileSkillEffect', this.showSkillEffectOnTile);
    this.checkShouldShow(this.leftOffset, this.topOffset);
  },
  beforeDestroy() {
    this.$parent.$off('updateTilePaths');
    this.$root.$off('frameBump', this.frameAdvance);
    this.$root.$off('applyTileSkillEffect', this.showSkillEffectOnTile);
    clearInterval(this.overTimeout);
  },
  watch: {
    leftOffset: function (val) {
      this.yOffset = val;
      this.checkShouldShow(val, this.topOffset);
    },
    topOffset: function (val) {
      this.xOffset = val;
      this.checkShouldShow(this.leftOffset, val);
    },
    // changing an image src is the only sure way to restart a gif from frame 0 without a library
    'tile.manaValueSlotOne': {
      handler () {
        this.$refs.dominionChangeSprite.src = '/assets/Tiles/Effects/dominionChange.gif';
        this.$refs.manaValueSlotOne.classList.add("fadeEffect");
        setTimeout(() => {
          this.$refs.dominionChangeSprite.src = '';
          this.$refs.manaValueSlotOne.classList.remove("fadeEffect");
        }, 900);
      },
    },
    'tile.manaValueSlotTwo': {
      handler () {
        this.$refs.dominionChangeSprite.src = '/assets/Tiles/Effects/dominionChange.gif';
        this.$refs.manaValueSlotTwo.classList.add("fadeEffect");
        setTimeout(() => {
          this.$refs.dominionChangeSprite.src = '';
          this.$refs.manaValueSlotTwo.classList.remove("fadeEffect");
        }, 900);
      },
    },
    'tile.showManaCollect': {
      handler (val) {
        if (val) {
          const seedDelay = this.getRandomIntBetween(0, 3);
          setTimeout(() => {
            this.$refs.manaCollectSprite.src = '/assets/Tiles/Effects/manaCharge.gif';
            setTimeout(() => {
              this.$refs.manaCollectSprite.src = '';
              this.tile.showManaCollect = false;
            }, 1400);
          }, (seedDelay * 100))
        }
      },
    },
    showMoveTiles: function(val) {
      if (this.shouldShow) {
        if (val) {
          const thisTile = this.moveTiles.filter((tile) => {
            return tile.x === this.tile.x && tile.y === this.tile.y;
          })
          if (thisTile.length) {
            this.moveHighlighted = true;
          }
        } else {
          if (this.moveHighlighted === true) {
            this.moveHighlighted = false;
          }
        }
      }
    },
    attackTiles: function(val) {
      if (this.shouldShow) {
        if (val.length) {
          const thisTile = val.filter((tile) => {
            return tile.x === this.tile.x && tile.y === this.tile.y;
          })
          if (thisTile.length) {
            this.attackHighlighted = true;
          }
        } else {
          if (this.attackHighlighted === true) {
            this.attackHighlighted = false;
          }
        }
      }
    },
    rangeTiles: function(val) {
      if (this.shouldShow) {
        if (val.length) {
          const thisTile = val.filter((tile) => {
            return tile.x === this.tile.x && tile.y === this.tile.y;
          })
          if (thisTile.length) {
            this.rangedHighlighted = true;
          }
        } else {
          if (this.rangedHighlighted === true) {
            this.rangedHighlighted = false;
          }
        }
      }
    }
  },
  computed: {
      ...mapGetters('world', [
      'map',
      'leftOffset',
      'topOffset',
      'focusedEntity',
      'currentTurn',
      'currentBattleTurn',
      'moveTiles',
      'attackTiles',
      'rangeTiles',
      'showMoveTiles',
      'isBattling',
      'showBattleTiles'
    ]),
    structureSprite () {
      return this.tile.structure.demolished && this.demolishFrame >= 7 ? this.tile.structure.demolishedSprite : this.tile.structure.sprite;
    },
    frameStyle () {
      return (-(64 * this.frame) + 'px ' + (0) + 'px')
    },
    quarterFrameStyle () {
      return (64 * this.quarterFrame) + 'px ' + (0) + 'px';
    },
  },
  methods: {
    ...mapMutations('world', [
      'setfocusedEntity',
      'setfocusedEntityOverride',
      'setPath',
      'updateLogs',
      'toggleMovingTiles',
      'toggleAttackRangeTiles',
      'toggleProjectileTiles'
    ]),
    checkShouldShow (leftOffset, topOffset) {
      const yOffset = leftOffset;
      const xOffset = topOffset;

      const xRange = ((this.tile.x * CONST.tileWidth));
      const yRange = ((this.tile.y * CONST.tileWidth));
      const xShouldShow = (yRange >= (yOffset - (CONST.tileWidth * 2)) && (yRange <= yOffset + 896)) &&
        (xRange >= (xOffset - (CONST.tileWidth * 2)) && xRange <= xOffset + 576 + (CONST.tileWidth));

      const yShouldShow = (yRange >= (yOffset - (CONST.tileWidth * 2)) && (yRange <= yOffset + 896)) &&
        (xRange >= (xOffset - (CONST.tileWidth * 2)) && xRange <= xOffset + 576 + (CONST.tileWidth));

      this.shouldShow = xShouldShow && yShouldShow;
    },
    frameAdvance (frame) {
      if (!this.shouldShow) {
        return;
      }

      this.frame = frame;

      if (this.tile.structure && this.tile.structure.demolished === true && this.demolishFrame < 20) {
        this.demolishFrame += 1;
      }

      const bumpFrames = this.bumpAnimationMap;

      const delayOption = this.getRandomIntBetween(0, 1);
      let nextFrame = delayOption ? (this.currentFrame + 1) : this.currentFrame;
      this.currentFrame = this.currentFrame >= this.tile.animationFrames ? 0 : nextFrame;

      const isFourthFrame = (frame % 4 === 0);
      if (isFourthFrame && !delayOption) {
        this.quarterFrame += 1;
      }

      const isFourQuartersLater = (this.quarterFrame === 4);

      if (isFourQuartersLater) {
        this.quarterFrame = 0;
      }

      const bFrame = bumpFrames[this.currentFrame];
      if (bFrame) {
        this.bumpVerticalFramePosition = bFrame.vertical;
        this.bumpHorizontalFramePosition = bFrame.horizontal;
      } else {
        this.bumpVerticalFramePosition = 0;
        this.bumpHorizontalFramePosition = 0;
      }

    },
    getImgUrl(path) {
      return `${path}`
    },
    setEntity () {
      if (this.showMoveTiles) {
        this.toggleMovingTiles();
      } else {
        this.$root.$emit('clearAttackState');
        this.setfocusedEntity(this.tile);
      }
    },
    capitalizeString(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    goToTile () {
      if (this.travelPath) {
        this.setPath({entity: this.isBattling ? this.currentBattleTurn : this.currentTurn, path: this.travelPath});
        this.$emit('clearPotentialPath');
        this.updateLogs(`${this.currentTurn.name} is on the move.`);
      }
    },
    skillOnTile () {
      this.$root.$emit('applySkillEffect', this.tile);
    },
    exitBattleState() {
      this.attackHighlighted = false;
      this.rangedHighlighted = false;
      this.setfocusedEntityOverride(null);
      this.toggleAttackRangeTiles();
      this.toggleProjectileTiles();
    },
    showSkillEffectOnTile({skill, tile, targetedEntity, damage}) {
      if (this.shouldShow && (this.tile.x === tile.x && this.tile.y === tile.y)) {
        this.showSkillEffect = true;
        this.currentSkillData = skill;
        this.currentSkillEffectSpritePath = skill.effectSprite;
        setTimeout(() => {
          this.$root.$emit('applyMonsterSkillEffect', {monsterID: targetedEntity.id, skill, damage});
          this.currentSkillEffectSpritePath = '';
          this.showSkillEffect = false;
        }, skill.effectDelay);
      }
    },
    getRandomIntBetween(min, max) {
      return getRandomInt(min, max);
    },
    isPotentialPathTile(path) {
      if (path.length && this.shouldShow) {
        for (let i = 0; i < path.length; i++) {
          if(path[i].x === this.tile.x && path[i].y === this.tile.y) {
            this.potentialPath = true;
          }
        }
      } else {
        this.potentialPath = false;
      }
    },
    lookForPath() {
      if (this.moveHighlighted) {
        const map = this.isBattling ? this.battleMap : this.map;
        const entityX = this.isBattling ? this.currentTurn.battleX : this.currentTurn.x;
        const entityY = this.isBattling ? this.currentTurn.battleY : this.currentTurn.y;
        const areaAroundPlayer = returnShallowMapChunk(this.focusedEntity, map, this.isBattling);
        const path = findPath(areaAroundPlayer, {x: entityX, y: entityY, movement: this.currentTurn.movement}, {x: this.tile.x, y: this.tile.y});
        this.travelPath = path;
        this.$emit('potentialPathCalc', path)
        // this.lightPotentialPath(path);
      }
    },
    onMouseOver() {
      if (this.hover === false && this.shouldShow) {
        if (this.overTimeout) {
          clearTimeout(this.overTimeout);
        }
        if (this.showMoveTiles || this.showBattleTiles) {
          this.overTimeout = setTimeout(() => {
            this.hover = true;
            this.lookForPath();
          }, 100);
        } else {
          this.overTimeout = setTimeout(() => {
            this.hover = true;
          }, 50);
        }
      }
    },
    onMouseExit() {
      this.hover = false;
      if (this.overTimeout) {
        clearTimeout(this.overTimeout);
      }
      if (this.potentialPath) {
        this.$emit('clearPotentialPath');
      }
      this.travelPath = null;
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile-component {
  /* display: inline-block; */
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.1);
  position: relative;
}
/* .tile-component:hover {
  cursor: pointer;
  z-index: 1;
  color: rgba(255, 255, 255, 0.5);
  background-image: url('/assets/hudSprites/select.png');
} */
/* .highlighted.tile-component:hover {
  background-image: none
} */
.active {
  background-color: #200b24;
}
.location {
  font-size: 8px;
  position: absolute;
  bottom: 0px;
  left: 19px;
  display: none;
}
.tile-sprite {
  min-width: 64px;
  min-height: 64px;
  position: relative;
  max-width: 64px;
  max-height: 64px;
}
.tile-sprite-img {
  /* position: relative;
  top: 2px; */
}
.frame-counter {
  position: absolute;
  left: 28px;
  top: 22px;
  visibility: hidden;
}
.highlighted {
  /* width: 14px;
  height: 14px; */
  width: 100%;
  height: 100%;
  z-index: 4;
  position: absolute;
  left: 0;
  background-image: url('/assets/hudSprites/select.png');
}
.attack-highlighted {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: absolute;
  left: 0;
  background-image: url('/assets/hudSprites/battleHighlightSheet.png');
}
.attack-highlighted-hover {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: absolute;
  left: 0;
  cursor: pointer;
  background-image: url('/assets/hudSprites/battleHighlightSheetHover.png');
}
.range-highlighted {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: absolute;
  left: 0;
  background-image: url('/assets/hudSprites/rangedHighlightSheet.png');
}
.range-highlighted-hover {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: absolute;
  left: 0;
  cursor: pointer;
  background-image: url('/assets/hudSprites/rangedHighlightSheetHover.png');
}
.out-range, .battle-out-range {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: absolute;
  left: 0;
  cursor: pointer;
  background-image: url('/assets/hudSprites/selectOutRange.png');
}
.potentialPath, .potentialPath.highlighted {
  width: 100%;
  height: 100%;
  z-index: 9;
  position: absolute;
  left: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  background-image: url('/assets/hudSprites/potential.png')!important;
}
.event-sprite {
  background-image: url('/assets/Tiles/Outworld/Sections/event.png');
  width: 64px;
  height: 64px;
  position: absolute;
  z-index: 1;
}
.demolish-sprite {
  width: 65px;
  height: 70px;
  background-image: url('/assets/Tiles/Outworld/Sections/smoke.png');
  z-index: 10;
  position: absolute;
}
.structure-sprite {
  min-width: 64px;
  min-height: 64px;
  position: absolute;
  max-width: 64px;
  max-height: 64px;
  z-index: 1;
}
.structure-sprite-effect {
  min-width: 64px;
  min-height: 64px;
  position: absolute;
  max-width: 64px;
  max-height: 64px;
  z-index: 2;
  pointer-events: none;
}
.dominion-change, .dominion-sprite {
  width: 64px;
  height: 64px;
  /* background-image: url('/assets/Tiles/Effects/dominionChange.gif'); */
  position: absolute;
  z-index: 1;
  left: 0;
}
.fadeEffect {
  animation: fadeIn 3s;
}
.dominion-change[src=""] {
  display:none;
}
.dominion-change {
  width: 128px;
  height: 128px;
  left: -48px;
  top: -32px;
}
.skill-sprite {
  position: absolute;
  width: 128px;
  height: 128px;
  z-index: 3;
}
.mana-charge[src=""] {
  display:none;
}
.mana-charge {
  width: 128px;
  height: 128px;
  z-index: 3;
  position: absolute;
  left: -32px;
  top: -54px;
}
.unexplored {
  background-image: url('/assets/Tiles/Outworld/Sections/Status/Unexplored/sheet.gif');
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
