import { DilutedHealthPotion, DilutedEnergyPotion } from './items/consumables/Potions.js';
import { MagicBean } from './items/nurture/MagicBean.js';
import { Wood, EnchantedWood } from './items/resources/Wood.js';
import { Stone, EnchantedStone, RedStone } from './items/resources/Stone.js';

export const PLAINS_REWARDS = [
  [
    new DilutedHealthPotion(1),
    new DilutedEnergyPotion(1),
    new MagicBean(1),
    new Wood(1),
    new Stone(1),
    new EnchantedWood(1),
    new EnchantedStone(1),
    new RedStone(1)
  ]
]
