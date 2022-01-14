export function DilutedHealthPotion (quantity) {
  this.sprite = 'assets/Icons/Items/Consumables/healthPotion.png';
  this.quantity = quantity;
  this.name = "Diluted Health Potion";
  this.description = 'A reflection of the difficult times. Watered down to reach more mouths.';
  this.averageCost = 10;

  this.effect = {
    type: 'Consumable',
    stat: 'hp',
    value: 10
  }
}

export function DilutedEnergyPotion (quantity) {
  this.sprite = 'assets/Icons/Items/Consumables/manaPotion.png';
  this.quantity = quantity;
  this.name = "Diluted Energy Potion";
  this.description = 'A reflection of the difficult times. Watered down to reach more mouths.';
  this.averageCost = 10;

  this.effect = {
    type: 'Consumable',
    stat: 'en',
    value: 10
  }
}
