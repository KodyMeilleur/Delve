import { RED, BLUE, GREEN, BLACK, WHITE, PURPLE } from './combatFields/combatFields';

const NEUTRAL = 'NEUTRAL';

export function Skill() {
  this.type = NEUTRAL;
  this.costType = 'AP'; // MP
  this.costSlotOne = 0;
  this.costSlotTwo = 0;
  this.costColorSlotOne = null;
  this.costColorSlotTwo = null;
  this.icon = '';
  this.range = 0;
  this.anchored = false;
  this.nature = 'defensive';
}

export const SKILL_TYPES = {
  NEUTRAL,
  RED,
  BLUE,
  GREEN,
  WHITE,
  BLACK,
  PURPLE
}

export const MeleeAttack = {
  type: NEUTRAL,
  baseDmg: 'might',
  addedDmg: 'weapon',
  costType: 'ap',
  costSlotOne: 1,
  costSlotTwo: 0,
  range: 1,
  anchored: true, // anchored to user
  placementShape: null, // default placement shape is single tile. Placements start at mouselocation - upper left corner
  icon: 'assets/Icons/Skills/Neutral/meleeAttack.png',
  nature: 'aggressive',
}
