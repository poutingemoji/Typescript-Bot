import { Parser } from "expr-eval";
import { expFormulas } from "../../utils/enumHelper";
import { IPlayerDocument } from "./types";
import characters from "../../data/characters.json";
const inventoryCategories = {
  weapons: ["sword", "bow", "claymore", "polearm", "catalyst"],
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

export async function addCharacter(this: IPlayerDocument, id: string) {
  const char = this.characters.get(id);
  console.log(id)
  char ? (char.constellation += 1) : this.characters.set(id, characters[id]);
}

export async function addItem(this: IPlayerDocument, item, amount = 1) {
  for (const [key, value] of Object.entries(inventoryCategories)) {
    if (value.find((type) => item.type == type)) {
      const curInv = this.inventory[key];
      if (curInv instanceof Array) {
        curInv.push({ id: item.id });
      } else {
        curInv.get(item.id)
          ? curInv.set(item.id, curInv.get(item.id) + amount)
          : curInv.set(item.id, amount);
      }
    }
  }
  //this.updateQuestProgress(player, "Collect", item);
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
