export function Wood (quantity) {
  this.sprite = 'assets/Icons/Items/Resources/commonWood.png';
  this.quantity = quantity;
  this.name = "Common Wood";
  this.description = 'Old, sturdy wood. The veins of a great forest.';
  this.averageCost = 2;
  this.rarity = 1;
  this.usable = false;
}

export function EnchantedWood (quantity) {
  this.sprite = 'assets/Icons/Items/Resources/enchantedWood.png';
  this.quantity = quantity;
  this.name = "Enchanted Wood";
  this.description = 'Wood that has been petrified by magic. If you listen closely, you can just make out the sounds of whispers.';
  this.averageCost = 10;
  this.rarity = 1;
  this.usable = false;
}
