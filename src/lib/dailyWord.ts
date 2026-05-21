import type { GradeId, WordList } from '../types'

const EPOCH = new Date(2026, 0, 1)
const SEED = 0x76_63_73_31 // "vcs1" — change to rotate the daily mapping

function cyrb53(input: string, seed = SEED): number {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export function dayIndex(now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((today.getTime() - EPOCH.getTime()) / 86_400_000)
}

function dateKey(now: Date): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function pickDailyWord(
  list: WordList,
  gradeId: GradeId,
  now: Date = new Date(),
): string | null {
  if (list.words.length === 0) return null
  const h = cyrb53(`${dateKey(now)}|${gradeId}`)
  const i = h % list.words.length
  return list.words[i]
}
