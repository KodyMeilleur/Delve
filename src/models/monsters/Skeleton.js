import { Monster } from '../Monster';

export function Skeleton(x, y) {
  Monster.call(this, x, y);

  this.mp = 2; // moving points
  this.type = 'Skeleton';
  // STATS
  this.hp = 5;
  this.en = 7;
  this.str = 2;
  this.def = 3;
  this.int = 4;
  this.wis = 4;

  // this.sprite = 'assets/Characters/Skeleton/';
  // this.animation = new Animation(1, 'Idle', true);
}
