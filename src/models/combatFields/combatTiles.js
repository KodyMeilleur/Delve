import { v4 as uuidv4 } from 'uuid';
import { getRandomInt } from '../../services/generateLand';
import { TYPES } from './combatFields';

export function NeutralTile(x, y) {
  this.id = uuidv4();
  this.x = x;
  this.y = y;
  this.visited = false;
  this.isTile = true;
  this.moveHighlighted = false;
  this.players = [];
  this.monsters = [];
  this.structure = null;
  // this.structure = (getRandomInt(0, 3) === 2) ? { type: 'Woods', path: 'assets/Tiles/Plains/Woods/sheet.png'} : null;
  this.animationFrames = 1;
  this.density = 0;

  this.variants = 4;
  this.variant = (getRandomInt(0, this.variants - 1) < 3) ? getRandomInt(0, this.variants - 1) : null;
  this.sprite = `assets/Tiles/Battle/Neutral/sheet${this.variant !== null ? this.variant : ''}.png`;

  this.potentialPath = false;
  this.type = [TYPES.NEUTRAL];
  this.name = 'Neutral Ground';
  this.mpCost = 1;

  this.battleTile = true;
  this.manaValueSlotOne = 0;
  this.manaTypeSlotOne = null;
  this.manaValueSlotTwo = 0;
  this.manaTypeSlotTwo = null;
  this.manaOwnerId = null;
}
