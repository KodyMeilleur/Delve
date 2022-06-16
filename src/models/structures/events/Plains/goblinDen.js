import { Structure } from '../../../Structure.js';

export function GoblinDen () {
  Structure.call(this);
  this.explorable = false;
  this.type = 'Dungeon';
  this.sprite = 'assets/Tiles/Outworld/Sections/Dungeons/goblinCity';
  this.hp = 3;
  this.mpCost = 1;
  this.name = 'Goblin Den';
  this.structureVerticalOffset = 0;
  this.eventStructure = true;

  this.category = 'Dungeon';
}
