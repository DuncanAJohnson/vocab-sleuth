# Word lists

The `grades-*.json` files in this directory are **generated** by
`scripts/generate-word-lists.mjs`. Do not edit them by hand — your changes will
be overwritten on the next run.

To regenerate:

```sh
nvm use 22
npm run generate-words
```

## Schema

Each file matches `WordList` in `src/types.ts`:

```ts
{
  grade: '1-2' | '3-4' | '5-8' | '9-12',
  wordLength: number,
  words: string[],  // all uppercase A–Z
  meta: { ... }     // generator metadata, not consumed by the app
}
```

## How words are bucketed

| Grade | Length | Source | Slice (by FREQlow rank) |
|-------|--------|--------|--------------------------|
| 1-2   | 4      | Dale-Chall familiar | top half (most common) |
| 3-4   | 4      | Dale-Chall familiar | bottom half |
| 5-8   | 5      | Dale-Chall familiar | all |
| 9-12  | 5      | Dale-Chall difficult | top 600 by frequency (most common advanced) |

Two signals drive the buckets:

- **Dale-Chall list membership** (`dale-chall-formula` / `dale-chall`) decides
  whether a word is "familiar to 4th-graders" or not. Lower grades get
  familiar words; the 9-12 band gets unfamiliar ones — but capped to the most
  *common* of the unfamiliar so the words remain approachable.
- **SUBTLEX-US frequency rank** (`FREQlow` from Brysbaert & New, 2009) orders
  words within a length. Using lowercase-only frequency demotes proper nouns
  that appear mostly capitalized.

Inappropriate words are filtered via the
[`naughty-words`](https://www.npmjs.com/package/naughty-words) package plus a
local `scripts/data/blocklist.txt` — edit the blocklist to tune the filter.

## Valid-guess pools

`guesses-4.json` and `guesses-5.json` are large pools of valid English words
the player may *guess* (but which won't appear as the daily answer). Source is
the full `an-array-of-english-words` dictionary filtered only by length and
the profanity blocklist — no Dale-Chall, no frequency cutoff — so rare,
archaic, and technical words are allowed.

```ts
{
  wordLength: number,
  words: string[],   // uppercase A–Z, sorted
  meta: { ... }
}
```

Every answer word in `grades-*.json` is guaranteed to be present in the
matching `guesses-{length}.json`.
