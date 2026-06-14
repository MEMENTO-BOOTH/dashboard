const FEMALE_AVATARS = [2, 4, 6, 8, 11, 13, 16, 18, 20];
const MALE_AVATARS = [1, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19];

const FEMALE_NAMES = new Set([
  "lea",
  "marie",
  "sophie",
  "sophia",
  "emma",
  "julie",
  "camille",
  "sarah",
  "laura",
  "chloe",
  "manon",
  "clara",
  "alice",
  "lucie",
  "pauline",
  "charlotte",
  "marine",
  "justine",
  "elise",
  "anais",
  "oceane",
  "jade",
  "louise",
  "eva",
  "mathilde",
  "nathalie",
  "isabelle",
  "sandrine",
  "celine",
  "aurelie",
  "audrey",
  "amandine",
  "melanie",
  "caroline",
  "claire",
  "helene",
  "valerie",
  "sylvie",
  "christine",
  "catherine",
  "nicole",
  "monique",
  "francoise",
  "martine",
  "brigitte",
  "emily",
  "maria",
  "jennifer",
  "lisa",
  "michelle",
  "amanda",
  "rachel",
  "kelly",
  "stephanie",
  "anna",
  "elodie",
  "fanny",
  "margaux",
  "noemie",
  "ines",
  "lola",
  "zoe",
  "agnes",
  "delphine",
]);

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function isFemaleName(name: string): boolean {
  const first = normalize(name.trim().split(/\s+/)[0] ?? "");
  return FEMALE_NAMES.has(first);
}

export function avatarUrl(name: string): string {
  const pool = isFemaleName(name) ? FEMALE_AVATARS : MALE_AVATARS;
  const index = pool[hash(name) % pool.length] ?? pool[0];
  return `/avatars/avatar-${index}.png`;
}
