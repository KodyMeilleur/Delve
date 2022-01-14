import { Structure } from '../Structure';
import { PlainsShop } from './dwellings/PlainsShop.js';

export function PlainsCity () {
  Structure.call(this);
  this.explorable = false;
  this.type = 'Settlement';
  this.sprite = 'assets/Tiles/Sections/Cities/plainsCity';
  this.hp = 10;
  this.mpCost = 1;
  this.name = 'Plains City';
  this.structureVerticalOffset = -2;

  this.category = 'Dwelling';

  this.dwelling = [
    PlainsShop
  ];
}
