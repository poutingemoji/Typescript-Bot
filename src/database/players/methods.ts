import { Parser } from "expr-eval";
import { expFormulas } from "../../utils/enumHelper";
import { IPlayerDocument } from "./types";
const inventoryCategories = {
  weapons: ["weapon"],
  artifacts: ["artifact"],
  characterDevelopmentItems: [
    "characterLevelUpMaterial",
    "weaponAscensionMaterial",
    "talentLevelUpMaterial",
  ],
  food: ["food", "potion"],
  materials: [
    "localSpecialtyMondstadt",
    "localSpecialtyLiyue",
    "material",
    "cookingIngredient",
  ],
  gadget: ["gadget"],
  quests: ["questItem"],
  preciousItems: ["consumable"],
};

/*
export async function setLastUpdated(this: IPlayerDocument): Promise<void> {
  const now = new Date();
  if (!this.lastUpdated || this.lastUpdated < now) {
    this.lastUpdated = now;
    await this.save();
  }
}
export async function sameLastName(this: IPlayerDocument): Promise<Document[]> {
  return this.model("player").find({ lastName: this.lastName });
}
*/

export async function addExp(
  this: IPlayerDocument,
  expToAdd: number
): Promise<void> {
  addExpToObject(this, expToAdd, expFormulas.mediumSlow);
  await this.save();
}

export async function addExpToCharacter(
  this: IPlayerDocument,
  expToAdd: number,
  characterId: string
): Promise<void> {
  const character = this.characters.get(characterId);
  if (!character) return;
  addExpToObject(character, expToAdd, expFormulas.mediumFast);
  await this.save();
}

export async function addCharacter(player, characterId) {
  player.characters.set(characterId, {});
  await this.save();
}

export async function addItem(this: IPlayerDocument, item, amount = 1) {
  console.log("ITEM", item)
  for (const [key, value] of Object.entries(inventoryCategories)) {
    console.log(value);
    //, item, value.find((constructor) => item instanceof constructor)
    if (value.map(c => {console.log(c, item instanceof Weapon)})) {
      const curInv = this.inventory[key];
      console.log("REEEEE", typeof curInv);
      return;
      if (curInv instanceof Array) {
        player.equipment.push({ id: item.id, lvl: item.lvl });
      } else {
        player.inventory.get(item)
          ? player.inventory.set(item, player.inventory.get(item) + amount)
          : player.inventory.set(item, amount);
      }
    }
  }

  //this.updateQuestProgress(player, "Collect", item);
  await this.save();
}

/*
export async function removeItem(player, item, amount = 1) {
  if (isNaN(item)) item--;
    ? items[item]
    : items[player.equipment[item].id];
  if (!item) return;
  if (itemCategories.equipment.includes(item.type)) {
    player.equipment.splice(item);
  } else {
    player.inventory.get(item) >= 2
      ? player.inventory.set(
          item,
          player.inventory.get(item) -
            clamp(amount, 0, player.inventory.get(item))
        )
      : player.inventory.delete(item);
  }
  this.savePlayer(player);
}

export async function findQuestType(player, type, id) {
  for (let i = 0; i < player.quests.story.length; i++) {
    if (player.quests.story[i].type == type) {
      if (id && player.quests.story[i].questId == id) {
        return player.quests.story[i];
      } else if (!id) {
        return player.quests.story[i];
      }
    }
  }
  return false;
}

export async function updateQuestProgress(player, type, id, value = 1) {
  const quest = this.findQuestType(player, type, id);
  console.log(quest, id);
  if (!quest || quest.progress == quest.goal) return;
  console.log(quest, id);
  if (isNaN(value)) {
    quest.progress = value;
  } else {
    quest.progress += Math.min(value, quest.goal - quest.progress);
    console.log(quest.progress);
  }
}

export async function addQuests(player) {
  this.savePlayer(player, {
    "quests.story":
      arcs[player.progression.story.arc].chapters[
        player.progression.story.chapter
      ].quests,
  });
}

export async function getAdventureRankRange(player) {
  let previousAR = 1; 
  for (let ar in adventureRankRanges) {
    console.log(ar);
    if (isBetween(player.adventureRank.cur, previousAR, ar))
      return adventureRankRanges[ar];
    previousAR = ar + 1;
  }
}
*/

function addExpToObject(obj, expToAdd: number, expFormula) {
  let prop = "lvl";
  if (obj.get("ar")) prop = "ar";
  obj.exp.cur += expToAdd;
  while (obj.exp.cur >= obj.exp.max && obj[prop].cur < obj[prop].max) {
    obj[prop].cur++;
    obj.exp.cur -= obj.exp.max;
    obj.exp.max = Parser.evaluate(expFormula, {
      lvl: obj[prop].cur + 1,
    });
  }
}
