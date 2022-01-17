export const HalfHeal = {
  sprite : 'assets/Icons/Services/halfHeal.png',
  name : "Half Heal",
  description : "In his infinite pity, Archon restores half of your health.",
  averageCost : 3,

  effect : {
    type: 'Heal',
    stat: 'hp',
    value: 'half'
  }
}

export const FullHeal = {
  sprite : 'assets/Icons/Services/fullHeal.png',
  name : "Full Heal",
  description : "Archon restores you to your full fighting strength",
  averageCost : 6,

  effect : {
    type: 'Heal',
    stat: 'hp',
    value: 'full'
  },
}
