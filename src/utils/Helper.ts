//http://patorjk.com/software/taag/#p=testall&f=Modular

/**
 * Returns a number within a min and max
 */
export function clamp(int: number, min: number, max: number): number {
  return int <= min ? min : int >= max ? max : int;
}

/**
 * Removes emojis from a string
 * https://stackoverflow.com/a/61783246
 */
export function containsOnlyEmojis(text: string): string {
  const onlyEmojis = text.replace(/[\u0000-\u1eeff]/g, "");
  return onlyEmojis;
  /*
    const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
    return onlyEmojis.length === visibleChars.length
  */
}

export function convertArrayToObject(
  array: unknown[],
  key: string = "id"
): Object {
  return array.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj;
  }, {});
}

export function convertMapToArray(obj): unknown[] {
  if (obj instanceof Map) {
    return Array.from(obj, ([id, value]) => {
      return typeof value == "object"
        ? Object.assign({ id }, value)
        : { id, value };
    });
  }
}

export function convertObjectToArray(obj) {
  if (obj instanceof Object)
    return Object.keys(obj).map((id) => Object.assign({ id }, obj[id]));
}
/**
 * Fills the given array with the given value x times.
 */
export function fillArray(value: unknown, length: number, arr: unknown[] = []) {
  for (let i = 0; i < length; i++) {
    arr.push(value);
  }
  return arr;
}

/**
 * Returns a shallow copy of the object only with filtered properties.
 * https://stackoverflow.com/a/38750895
 */
export function filterObject(raw: Object, filter: (arg0: string) => boolean) {
  return Object.keys(raw)
    .filter(filter)
    .reduce((obj, key) => {
      obj[key] = raw[key];
      return obj;
    }, {});
}

export function getNested(obj, path, separator = ".") {
  return path
    .replace("[", separator)
    .replace("]", "")
    .split(separator)
    .reduce(function (o, prop) {
      return o[prop];
    }, obj);
}

/**
 * Returns time passed in seconds since timestamp
 */
export function getTimePassed(timestamp: Date): number {
  return (new Date().getTime() - timestamp.getTime()) / 1000;
}

/**
 * Groups values of an array into categories and returns as an object
 */
export function groupBy(arr: unknown[], fn: (arg0: unknown) => string): Object {
  return arr.reduce((result, item) => {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    console.log(result);
    return result;
  }, {});
}

/**
 * Recursively checks the object for a property
 */
export function hasOwnDeepProperty(obj: Object, prop: string): boolean {
  if (typeof obj === "object" && obj !== null) {
    if (obj.hasOwnProperty(prop)) {
      return true;
    }
    for (let p in obj) {
      if (obj.hasOwnProperty(p) && hasOwnDeepProperty(obj[p], prop)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns a boolean if a number is within a min and max
 */
export function isBetween(int: number, min: number, max: number): boolean {
  return (int - min) * (int - max) <= 0;
}

/**
 * Returns a number with commas
 */
export function numberWithCommas(int: number): string {
  return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Returns a random number between a min and max
 * https://www.geeksforgeeks.org/how-to-generate-random-number-in-given-range-using-javascript/
 */
export function randomBetween(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random value from an array
 */
export function randomChoice(arr: unknown[]) {
  return arr[randomBetween(0, arr.length - 1)];
}

export function randomWeightedChoice(
  arr: unknown[],
  weight: (obj) => number
): any {
  return randomChoice(
    [].concat(
      ...arr.map((obj) => Array(Math.ceil(weight(obj) * 100)).fill(obj))
    )
  );
}

export function secondsToTimeFormat(
  seconds: number,
  conjunction: string = " and ",
  abbreviate: boolean = true
): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  let Display = [
    d > 0 ? d + (abbreviate ? "d" : d == 1 ? " day" : " days") : false,
    h > 0 ? h + (abbreviate ? "h" : h == 1 ? " hour" : " hours") : false,
    m > 0 ? m + (abbreviate ? "m" : m == 1 ? " minute" : " minutes") : false,
    s > 0 ? s + (abbreviate ? "s" : s == 1 ? " second" : " seconds") : false,
  ];

  Display = Display.filter(Boolean);
  if (abbreviate) {
    Display.length = Math.min(Display.length, 2);
  }

  return Display.join(conjunction);
}

/**
 * Returns a codeblock for Discord
 */
export function setImportantMessage(
  message: string,
  syntax: string = ""
): string {
  return `\`\`\`${syntax}\n${message}\`\`\``;
}

/**
 * Put program to sleep for x milliseconds
 * https://www.sitepoint.com/delay-sleep-pause-wait/
 */
export async function sleep(milliseconds: number) {
  const date = Date.now();
  let curDate = null;
  do {
    curDate = Date.now();
  } while (curDate - date < milliseconds);
}
