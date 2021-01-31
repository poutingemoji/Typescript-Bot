import { Document } from "mongoose";
import { IPlayerDocument } from "./types";
import { PlayerModel } from "./model";
import { expFormulas } from "../../utils/enumHelper";
import { Parser } from "expr-eval";
import { convertMapToArray } from "../../utils/Helper";
import { User } from "discord.js";

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
  console.log(this);
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

export async function addItem(player, itemId, amount = 1) {
  const item = this.getObjectStats(
    typeof itemId == "object" ? itemId : newEquipmentObj(itemId)
  );
  console.log("TYPE", item.type);
  if (itemCategories.equipment.includes(item.type)) {
    player.equipment.push({ id: item.id, lvl: item.lvl });
  } else {
    player.inventory.get(itemId)
      ? player.inventory.set(itemId, player.inventory.get(itemId) + amount)
      : player.inventory.set(itemId, amount);
  }
  //this.updateQuestProgress(player, "Collect", itemId);
  this.savePlayer(player);
}

export async function removeItem(player, itemId, amount = 1) {
  if (isNaN(itemId)) itemId--;
  const item = isNaN(itemId)
    ? items[itemId]
    : items[player.equipment[itemId].id];
  if (!item) return;
  if (itemCategories.equipment.includes(item.type)) {
    player.equipment.splice(itemId);
  } else {
    player.inventory.get(itemId) >= 2
      ? player.inventory.set(
          itemId,
          player.inventory.get(itemId) -
            clamp(amount, 0, player.inventory.get(itemId))
        )
      : player.inventory.delete(itemId);
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
  for (let AR in adventureRankRanges) {
    console.log(AR);
    if (isBetween(player.adventureRank.cur, previousAR, AR))
      return adventureRankRanges[AR];
    previousAR = AR + 1;
  }
}

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
