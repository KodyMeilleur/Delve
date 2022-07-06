<template>
  <div
  v-on:mouseover="onMouseOver"
  v-on:mouseleave="onMouseExit"
  class="skill"
  >
    <span class="skill-number text-style">{{number + 1}}</span>
    <div
    v-on:click="useSkill"
    v-if="skill"
    v-bind:class="{ 'skill-disabled': !canUseSkill || isMoving}"
    v-bind:style="{
      'background-image': 'url(' + publicPath + skill.icon,
      /* 'background-position': ((64) * currentFrame) + 'px ' + (0) + 'px', */
    }"
    class="default-icon">
    </div>
    <div
    v-if="hover && skill"
    class="tooltip-container"
    >
      <div>{{ skill.name }}</div>
      <div class="skill-desc-body">
        <div class="skill-nature-container">
          <div
          v-bind:style="{
            'background-image': 'url(' + publicPath + 'assets/hudSprites/' + naturePath(skill.nature),
          }"
          class="skill-nature"
          >
          </div>
          <div
          v-if="skill.nature === 'aggressive'"
          class="skill-damage">
          {{ skill.addedDmg }}
          </div>
        </div>
        <div class="skill-color">
          <div class="color-body">
            <div
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/hudSprites/smMana' + (skill.type) + '.png',
            }"
            class="skill-color-one"
            >
            </div>
            <div
            class="skill-cost-one">
            {{ skill.costSlotOne }}
            </div>
          </div>
          <div v-if="skill.typeTwo" class="color-body">
            <div
            v-bind:style="{
              'background-image': 'url(' + publicPath + 'assets/hudSprites/smMana' + (skill.typeTwo) + '.png',
            }"
            class="skill-color-two"
            >
              {{ skill.costSlotTwo }}
            </div>
            <div
            class="skill-cost-one">
            {{ skill.costSlotOne }}
            </div>
          </div>
        </div>
      </div>
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
    },
    heldMana: {
      type: Object,
      default: null,
      overTimeout: null,
    },
    ap: {
      type: Number
    },
    isMoving: {
      type: Boolean
    }
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      hover: false,
    }
  },
  methods: {
    ...mapMutations('world', [
    ]),
    useSkill() {
      this.$emit('clearPotentialPath');
      this.$root.$emit('clearPlayerMoveState');
      this.$root.$emit('useSkill', this.skill);
    },
    onMouseOver() {
      if (this.hover === false) {
        if (this.overTimeout) {
          clearTimeout(this.overTimeout);
        }
        this.overTimeout = setTimeout(() => {
          this.hover = true;
        }, 250);
      }
    },
    onMouseExit() {
      this.hover = false;
      if (this.overTimeout) {
        clearTimeout(this.overTimeout);
      }
    },
    naturePath(natureString) {
      switch (natureString) {
        case 'aggressive':
          return 'categoryAggressive.png'
        case 'defensive':
          return 'categoryDefensive.png'
        case 'placement':
          return 'categoryPlacement.png'
        default:
          return ''
      }
    }
  },
  computed: {
    ...mapGetters('world', [
    ]),
    canUseSkill() {
      if (this.skill && this.skill.costType === 'ap') {
        return this.ap >= this.skill.costSlotOne;
      } else if (this.skill && this.skill.costType === 'mp') {
        let canAfford = true;
        canAfford = this.skill.costSlotOne ? (this.heldMana[this.skill.type] >= this.skill.costSlotOne) : true;
        if (canAfford) {
          canAfford = this.skill.costSlotTwo ? (this.heldMana[this.skill.typeTwo] >= this.skill.costSlotTwo) : true;
        }

        return canAfford;
      }

      return false;
    },
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
  pointer-events: none;
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%) brightness(60%);
}
.tooltip-container {
  position: absolute;
  width: 196px;
  height: 64px;
  background-image: url('/assets/hudSprites/skillTooltip.png');
  top: -66px;
}
.skill-desc-body, .color-body {
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}
.skill-nature, .skill-color-one, .skill-color-two {
  width: 32px;
  height: 32px;
}
.skill-nature-container, .skill-color {
  display: flex;
  align-items: center;
}
</style>
