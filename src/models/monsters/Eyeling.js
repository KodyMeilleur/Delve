import { Monster } from '../Monster';
import { Animation } from '../Animation.js';

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
