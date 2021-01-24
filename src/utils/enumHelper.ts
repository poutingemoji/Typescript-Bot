export const talkedRecently = new Set();
export const waitingOnResponse = new Set();
export const isInBattle = new Set();
export const links = {
  commandList: "https://poutingemoji.github.io/poutingbot/commands.html",
  repository: "https://github.com/poutingemoji/Typescript-Bot",
  supportServer: "",
  website: "https://poutingemoji.github.io/poutingbot/",
};
export const commandGroups = {
  administrative: "Administrative Commands",
  adventure: "Adventure Commands",
  fighting: "Fighting Commands",
  general_info: "General Info Commands",
  user_info: "User Info Commands",
};
export const expFormulas = {
  fast: "floor(((4*lvl)^3)/5)",
  mediumFast: "floor(lvl^3)",
  mediumSlow: "floor((6/5*lvl^3)-(15*lvl^2)+(100*lvl)-140)",
  slow: "floor(((5*lvl)^3)/4)",
};

export const ascensions = [
  { lvl: 20, ar: 0 },
  { lvl: 40, ar: 15 },
  { lvl: 50, ar: 25 },
  { lvl: 60, ar: 30 },
  { lvl: 70, ar: 35 },
  { lvl: 80, ar: 40 },
  { lvl: 90, ar: 50 },
];

export const rarities = [
  {
    emoji: "⬜",
    hex: "#e5e7e9",
    weight: 30,
  },
  {
    emoji: "🟩",
    hex: "#79b15a",
    weight: 25,
  },
  {
    emoji: "🟦",
    hex: "#55acef",
    weight: 10,
  },
  {
    emoji: "🟪",
    hex: "#aa8fd6",
    weight: 5,
  },
  {
    emoji: "🟨",
    hex: "#fdcb58",
    weight: 1,
  },
];