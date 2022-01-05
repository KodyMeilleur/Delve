import { Structure } from '../Structure';

export function PlainsCity () {
  Structure.call(this);
  this.explorable = false;
  this.type = 'Settlement';
  this.sprite = 'assets/Tiles/Sections/Cities/plainsCity';
  this.hp = 10;
  this.mpCost = 1;
  this.name = 'Plains City';
  this.structureVerticalOffset = -2;
  this.loot = [];
}
