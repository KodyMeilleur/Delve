import { Monster } from '../Monster';
import { Animation } from '../Animation.js';

export function Skeleton(x, y) {
  Monster.call(this, x, y);

  this.mp = 2; // moving points
  this.maxMp = 2; // moving points
  this.type = 'Skeleton';
  this.name = 'Skeleton';
  this.sprite = 'assets/Characters/Skeleton/Outworld/';
  this.animation = new Animation(2, 'Idle', true);
  this.defaultAnimation = this.animation;
  // STATS
  this.hp = 5;
  this.en = 7;
  this.str = 2;
  this.def = 3;
  this.int = 4;
  this.wis = 4;
}
