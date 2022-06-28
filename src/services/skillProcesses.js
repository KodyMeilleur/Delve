import { getCardinalTilesWithoutEntity } from './pathfinding';
import { getRandomInt } from './generateLand';

export function processPlacement(skill, tile, userID, name) {
  if (skill.takeDominion) {
    tile.manaOwnerId = userID;
    tile.manaOwnerName = name;
    skill.dominionType.forEach((item, i) => {
      if (i === 0) {
        tile.manaTypeSlotOne = item;
        tile.manaValueSlotOne += skill.dominionValues[i];
      } else {
        tile.manaTypeSlotTwo = item;
        tile.manaValueSlotTwo += skill.dominionValues[i];
      }
    });
  }
  if (skill.turnEffectActive) {
    tile.turnEffectActive = true;
    tile.turnEffect = Object.assign(new Object(), skill.turnEffect);
    tile.turnEffect.triggerId = userID;
  }
}

export function executeTileEffect(tile, battleMap) {
  const effect = tile.turnEffect;
  // TODO: Spin off functions for each effect type
  if (effect.effectType === 'expansion') {
    if (effect.expansion.type === 'dominion') {
      const potentialTiles = getCardinalTilesWithoutEntity(tile, battleMap, effect.expansion.range);
      for(var i = 0; i < effect.expansion.amountToEffect; i++) {
        const randomInt = getRandomInt(0, potentialTiles.length - 1);
        const effectedTile = potentialTiles.splice(randomInt, 1)[0];
        effectedTile.manaValueSlotOne = effect.expansion.value;
        effectedTile.manaTypeSlotOne = effect.expansion.color;
        console.log(effectedTile);
      }
    }
  }

  if (effect.recurring) {
    effect.turnCountdown = effect.maxTurnCountdown;
  } else {
    tile.turnEffectActive = false;
  }
}
