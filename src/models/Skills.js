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
  costType: 'AP',
  costSlotOne: 1,
  costSlotTwo: 0,
  icon: 'assets/Icons/Skills/Neutral/meleeAttack.png',
}
