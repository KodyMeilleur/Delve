export function processPlacement(skill, tile, userID) {
  if (skill.takeDominion) {
    tile.manaOwnerId = userID;
    skill.dominionType.forEach((item, i) => {
      if (i === 0) {
        tile.manaTypeSlotOne = item;
        tile.manaValueSlotOne += skill.dominionValues[i];
      } else {
        tile.manaTypeSlotTwo = item;
        tile.manaValueSlotTwo += skill.dominionValues[i];
      }
    });
    // skill entity logic

  }
}
