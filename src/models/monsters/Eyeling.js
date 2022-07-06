import { Monster } from '../Monster';
import { Animation } from '../Animation.js';

// export function Dummy(x, y) {
//   Monster.call(this, x, y);
//
//   this.movement = 0; // moving points
//   this.maxMovement = 0; // moving points
//   this.type = 'Dummy';
//   this.name = 'Dummy';
//   this.sprite = 'assets/Characters/Dummy/';
//   this.animation = new Animation(1, 'Idle', true);
//   this.defaultAnimation = this.animation;
//
//   // STATS
//   this.hp = 20;
//   this.might = 0;
//   this.toughness = 0;
//   this.intelligence = 0;
//   this.arcana = 0;
// }

export function Eyeling(x, y, isBattling) {
  Monster.call(this, x, y);

  this.movement = 2; // moving points
  this.maxMovement = 2; // moving points
  this.type = 'GREEN';
  this.name = 'Eyeling';
  this.sprite = 'assets/Characters/Eyeling/';
  this.deathSprite = 'assets/Characters/Eyeling/Death/';
  this.animation = new Animation(3, 'Idle', true);
  this.defaultAnimation = this.animation;
  this.isBattling = isBattling;
  // STATS
  this.hp = 10;
  this.maxHp = 10;
  this.might = 1;
  this.toughness = 1;
  this.intelligence = 5;
  this.arcana = 7;

  this.speed = 1;
}
