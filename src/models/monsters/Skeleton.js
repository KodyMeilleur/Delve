import { Monster } from '../Monster';
import { Animation } from '../Animation.js';

export function Skeleton(x, y) {
  Monster.call(this, x, y);

  this.movement = 2; // moving points
  this.maxMovement = 2; // moving points
  this.type = 'Skeleton';
  this.name = 'Skeleton';
  this.sprite = 'assets/Characters/Skeleton/Outworld/';
  this.animation = new Animation(4, 'Idle', true);
  this.defaultAnimation = this.animation;
  // STATS
  this.hp = 5;
  this.might = 2;
  this.toughness = 3;
  this.intelligence = 1;
  this.arcana = 4;

  this.speed = 1;
}
