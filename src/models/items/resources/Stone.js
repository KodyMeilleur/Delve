export function Stone (quantity) {
  this.sprite = 'assets/Icons/Items/Resources/commonStone.png';
  this.quantity = quantity;
  this.name = "Common Stone";
  this.description = 'A slab of stone from the flatlands. Many a kingdom have risen and fallen, all built on this rock.';
  this.averageCost = 2;
  this.rarity = 1;
  this.usable = false;
}

export function EnchantedStone (quantity) {
  this.sprite = 'assets/Icons/Items/Resources/enchantedStone.png';
  this.quantity = quantity;
  this.name = "Enchanted Stone";
  this.description = 'A magic rock hard as a gemstone. Highly prized by artisans.';
  this.averageCost = 12;
  this.rarity = 2;
  this.usable = false;
}

export function RedStone (quantity) {
  this.sprite = 'assets/Icons/Items/Resources/redStone.png';
  this.quantity = quantity;
  this.name = "Red Stone";
  this.description = 'Stone cut deep below the Red Mountains. Brittle, but unusually sharp.';
  this.averageCost = 8;
  this.rarity = 1;
  this.usable = false;
}
