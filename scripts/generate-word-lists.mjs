/**
 * Generate grade-band word lists for vocab-sleuth.
 *
 * Each grade band has its own word length and difficulty source:
 *   1-2:   4-letter, Dale-Chall familiar, top half by frequency
 *   3-4:   4-letter, Dale-Chall familiar, bottom half by frequency
 *   5-6:   5-letter, Dale-Chall familiar, all (sorted by frequency)
 *   7-8:   6-letter, Dale-Chall difficult, top half by frequency
 *   9-10:  6-letter, Dale-Chall difficult, bottom half by frequency
 *   11-12: 7-letter, Dale-Chall difficult, all (sorted by frequency)
 *
 * Pipeline (per band):
 *   1. Load SUBTLEX-US (Brysbaert & New 2009), keep N-letter lowercase ASCII
 *      tokens with FREQlow >= 1. Using FREQlow (lowercase-only count) as the
 *      rank signal demotes proper nouns that appear almost exclusively
 *      capitalized.
 *   2. Cross-check against `an-array-of-english-words` dictionary.
 *   3. Drop profanity (`naughty-words` + scripts/data/blocklist.txt).
 *   4. Apply Dale-Chall split via daleChallFormula:
 *        difficultWord = 0 if in `dale-chall` familiar list, else 1
 *      Keep "easy" or "difficult" words per the band's config.
 *   5. Sort by frequency desc, take the configured slice.
 *   6. Write src/data/grades-{band}.json matching the app's WordList schema.
 *
 * Run with: `nvm use 22 && npm run generate-words`
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { daleChall } from 'dale-chall';
import { daleChallFormula, daleChallGradeLevel } from 'dale-chall-formula';
import naughtyWords from 'naughty-words';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SUBTLEX_PATH = path.join(__dirname, 'data', 'SUBTLEXus74286wordstextversion.txt');
const DICT_PATH = path.join(ROOT, 'node_modules', 'an-array-of-english-words', 'index.json');
const BLOCKLIST_PATH = path.join(__dirname, 'data', 'blocklist.txt');
const OUT_DIR = path.join(ROOT, 'src', 'data');

/**
 * Each band's `range` is a fraction-of-pool slice [start, end) after sorting by
 * frequency descending. Optional `cap` truncates the final result to N words.
 * For 9-12 we want only the most familiar advanced words (capped at 600).
 *
 * @type {Array<{grade: string, length: number, useEasy: boolean, range: [number, number], cap?: number}>}
 */
const BAND_CONFIGS = [
  { grade: '1-2',  length: 4, useEasy: true,  range: [0,   0.5] },
  { grade: '3-4',  length: 4, useEasy: true,  range: [0.5, 1.0] },
  { grade: '5-8',  length: 5, useEasy: true,  range: [0,   1.0] },
  { grade: '9-12', length: 5, useEasy: false, range: [0,   1.0], cap: 600 },
];

// --- Shared data ---
const subtlexRaw = await readFile(SUBTLEX_PATH, 'utf8');
const subtlexLines = subtlexRaw.split('\n');
const header = subtlexLines[0].split('\t');
const wordIdx = header.indexOf('Word');
const freqLowIdx = header.indexOf('FREQlow');
if (wordIdx === -1 || freqLowIdx === -1) {
  throw new Error(`Unexpected SUBTLEX header: ${header.join(', ')}`);
}

const dictSet = new Set(JSON.parse(await readFile(DICT_PATH, 'utf8')));
const daleChallSet = new Set(daleChall);
const naughtyEn = new Set((naughtyWords.en || []).map(s => s.toLowerCase()));

let extraBlock = new Set();
try {
  const txt = await readFile(BLOCKLIST_PATH, 'utf8');
  extraBlock = new Set(
    txt.split('\n').map(l => l.trim().toLowerCase()).filter(w => w && !w.startsWith('#'))
  );
} catch {
  // optional file
}

/** Memoize candidate pools by length so we only parse SUBTLEX once per length. */
const poolCache = new Map();
function poolForLength(length) {
  if (poolCache.has(length)) return poolCache.get(length);
  const lengthRe = new RegExp(`^[a-z]{${length}}$`);
  const candidates = new Map();
  for (let i = 1; i < subtlexLines.length; i++) {
    const line = subtlexLines[i];
    if (!line) continue;
    const cols = line.split('\t');
    const raw = cols[wordIdx];
    const freqLow = Number(cols[freqLowIdx]);
    if (!raw || !Number.isFinite(freqLow) || freqLow < 1) continue;
    const word = raw.toLowerCase();
    if (!lengthRe.test(word)) continue;
    const freq = Math.log10(freqLow + 1);
    const prev = candidates.get(word);
    if (!prev || freq > prev.freq) candidates.set(word, { word, freq });
  }
  const pool = [...candidates.values()]
    .filter(e => dictSet.has(e.word))
    .filter(e => !naughtyEn.has(e.word) && !extraBlock.has(e.word));
  poolCache.set(length, pool);
  return pool;
}

await mkdir(OUT_DIR, { recursive: true });
const generated = new Date().toISOString();

const cmp = (a, b) => (b.freq - a.freq) || a.word.localeCompare(b.word);

for (const cfg of BAND_CONFIGS) {
  const pool = poolForLength(cfg.length);

  const split = { easy: [], hard: [] };
  for (const e of pool) {
    const difficultWord = daleChallSet.has(e.word) ? 0 : 1;
    const score = daleChallFormula({ word: 1, sentence: 1, difficultWord });
    const dcBand = daleChallGradeLevel(score);
    const decorated = { ...e, dcScore: score, dcBand };
    (difficultWord === 0 ? split.easy : split.hard).push(decorated);
  }

  const side = cfg.useEasy ? split.easy : split.hard;
  side.sort(cmp);

  const start = Math.floor(side.length * cfg.range[0]);
  const end = Math.floor(side.length * cfg.range[1]);
  let items = side.slice(start, end);
  if (cfg.cap) items = items.slice(0, cfg.cap);

  const payload = {
    grade: cfg.grade,
    wordLength: cfg.length,
    words: items.map(i => i.word.toUpperCase()),
    meta: {
      count: items.length,
      generated,
      source: 'SUBTLEX-US (Brysbaert & New, 2009) + dale-chall',
      difficulty: cfg.useEasy ? 'Dale-Chall familiar' : 'Dale-Chall difficult',
      range: cfg.range,
      cap: cfg.cap ?? null,
    },
  };

  const file = path.join(OUT_DIR, `grades-${cfg.grade}.json`);
  await writeFile(file, JSON.stringify(payload, null, 2) + '\n');
  console.log(
    `grades-${cfg.grade}: len=${cfg.length}, ${cfg.useEasy ? 'easy' : 'hard'}, range=[${cfg.range.join(', ')}], ${items.length} words → ${path.relative(ROOT, file)}`
  );
}

// --- Guess pools ---
// Large valid-guess lists for each supported length. Source is the full
// `an-array-of-english-words` dictionary (no SUBTLEX frequency cutoff, no
// Dale-Chall filter), so rare/archaic/technical words are included. The only
// filters applied are length, lowercase ASCII, and the profanity blocklist.
const GUESS_LENGTHS = [4, 5];
for (const length of GUESS_LENGTHS) {
  const lengthRe = new RegExp(`^[a-z]{${length}}$`);
  const words = [];
  for (const w of dictSet) {
    if (!lengthRe.test(w)) continue;
    if (naughtyEn.has(w) || extraBlock.has(w)) continue;
    words.push(w.toUpperCase());
  }
  words.sort();

  const payload = {
    wordLength: length,
    words,
    meta: {
      count: words.length,
      generated,
      source: 'an-array-of-english-words',
      filters: 'profanity blocklist only (no Dale-Chall, no frequency cutoff)',
    },
  };
  const file = path.join(OUT_DIR, `guesses-${length}.json`);
  await writeFile(file, JSON.stringify(payload, null, 2) + '\n');
  console.log(`guesses-${length}: ${words.length} words → ${path.relative(ROOT, file)}`);
}
