import { Monster } from '../Monster';
import { Animation } from '../Animation.js';

export function Dummy(x, y) {
  Monster.call(this, x, y);

  this.movement = 0; // moving points
  this.maxMovement = 0; // moving points
  this.type = 'Dummy';
  this.name = 'Dummy';
  this.outWorldSprite = 'assets/Characters/Dummy/Outworld/';
  this.inWorldSprite = 'assets/Characters/Dummy/Inworld/';
  this.animation = new Animation(1, 'Idle', true);
  this.defaultAnimation = this.animation;

  // STATS
  this.hp = 20;
  this.might = 0;
  this.toughness = 0;
  this.intelligence = 0;
  this.arcana = 0;
}
