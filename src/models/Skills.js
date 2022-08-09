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
  this.nature = 'defensive'; // aggressive, placement
  // stepType: 'walk', used for pathing algorithm potential effected tiles. walk uses mp/range cardinally. crow includes diagonal
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
  name: 'Melee Attack',
  animation: 'Attack',
  animationFrames: 4,
  type: NEUTRAL,
  typeTwo: null,
  baseDmg: 'might',
  addedDmg: 3,
  costType: 'ap',
  costSlotOne: 1,
  costSlotTwo: 0,
  range: 1,
  stepType: 'foot',
  anchored: true, // anchored to user
  placementShape: null, // default placement shape is single tile. Placements start at mouselocation - upper left corner
  icon: 'assets/Icons/Skills/Neutral/meleeAttack.png',
  nature: 'aggressive',
  takeDominion: false,
  dominionValue: 0,
  dominionType: NEUTRAL,
  overchargeUnlocked: false,
}

export const SculptEarth = {
  name: 'Sculpt Earth',
  animation: 'homingCast',
  type: GREEN,
  typeTwo: null,
  baseDmg: 'intelligence',
  addedDmg: 7,
  // needed frames for cast animation
  animationFrames: 5,
  costType: 'mp',
  costSlotOne: 1,
  costSlotTwo: 0,
  range: 3,
  stepType: 'foot',
  anchored: true, // anchored to user
  placementShape: null, // default placement shape is single tile. Placements start at mouselocation - upper left corner
  icon: 'assets/Icons/Skills/Green/sculptEarth.png',
  effectSprite: 'assets/Spells/Green/sculptEarth/sheet.gif',
  spriteWidth: 128,
  spriteHeight: 128,
  top: 0,
  left: -32,
  effectDelay: 1000,
  nature: 'aggressive',
  takeDominion: false,
  dominionValue: 0,
  dominionType: NEUTRAL,
  overchargeUnlocked: false,
}

export const Thunder = {
  name: 'Thunder',
  animation: 'homingCast',
  type: BLUE,
  typeTwo: null,
  baseDmg: 'intelligence',
  addedDmg: 10,
  animationFrames: 5,
  costType: 'mp',
  costSlotOne: 1,
  costSlotTwo: 0,
  range: 3,
  stepType: 'foot',
  anchored: true, // anchored to user
  placementShape: null, // default placement shape is single tile. Placements start at mouselocation - upper left corner
  icon: 'assets/Icons/Skills/Blue/thunder.png',
  effectSprite: 'assets/Spells/Blue/thunder/sheet.gif',
  spriteWidth: 128,
  spriteHeight: 192,
  top: -144,
  left: -32,
  effectDelay: 2300,
  nature: 'aggressive',
  takeDominion: false,
  dominionValue: 0,
  dominionType: NEUTRAL,
  overchargeUnlocked: true,
}

export const Fireball = {
  name: 'Fireball',
  animation: 'directionCast',
  type: RED,
  typeTwo: null,
  baseDmg: 'intelligence',
  addedDmg: 12,
  animationFrames: 2,
  costType: 'mp',
  costSlotOne: 1,
  costSlotTwo: 0,
  range: 1,
  stepType: 'projectile',
  anchored: true, // anchored to user
  placementShape: null, // default placement shape is single tile. Placements start at mouselocation - upper left corner
  icon: 'assets/Icons/Skills/Red/fireball.png',
  effectSprite: 'assets/Spells/Red/fireBall/sheet.gif',
  splashSprite: 'assets/Spells/Red/fireBall/splash.gif',
  projectileClass: 'small',
  spriteWidth: 32,
  spriteHeight: 32,
  top: 0,
  left: 0,
  effectDelay: 0,
  nature: 'aggressive',
  takeDominion: false,
  dominionValue: 0,
  dominionType: NEUTRAL,
  overchargeUnlocked: false,
}

export const Reforestation = {
  name: 'Reforestation',
  animation: 'homingCast',
  animationFrames: 5,
  type: GREEN,
  typeTwo: null,
  baseDmg: '',
  addedDmg: '',
  costType: 'mp',
  costSlotOne: 2,
  costSlotTwo: 0,
  range: 2,
  stepType: 'foot',
  anchored: true,
  placementShape: null,
  icon: 'assets/Icons/Skills/Green/reforestation.png',
  nature: 'placement',
  takeDominion: true,
  turnEffectActive: true, // creates recurring or delayed turn effect
  turnEffect: {
    triggerId: null,
    turnCountdown: 1,
    maxTurnCountdown: 1, // for recurring effects
    recurring: false,
    effectType: 'expansion',
    expansion: { // unique config for expansion types
      traversal: 'cardinal',
      direction: 'random',
      range: 1,
      amountToEffect: 1,
      type: 'dominion',
      color: GREEN,
      value: 1,
    }
  },
  dominionValues: [1],
  dominionType: [GREEN],
  overchargeUnlocked: false,
}
