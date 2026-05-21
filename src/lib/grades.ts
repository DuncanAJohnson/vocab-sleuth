import type { GradeId, GradeMeta, WordList } from '../types'
import grades12 from '../data/grades-1-2.json'
import grades34 from '../data/grades-3-4.json'
import grades48 from '../data/grades-4-8.json'
// import grades912 from '../data/grades-9-12.json'

function validateList(raw: unknown): WordList {
  const list = raw as WordList
  if (!Array.isArray(list.words)) {
    throw new Error(`Invalid word list for grade ${list.grade}: words is not an array`)
  }
  for (const w of list.words) {
    if (typeof w !== 'string' || w.length !== list.wordLength || !/^[A-Z]+$/.test(w)) {
      throw new Error(
        `Invalid word "${w}" in grade ${list.grade}: must be ${list.wordLength} uppercase letters A-Z`,
      )
    }
  }
  return list
}

export const GRADES: GradeMeta[] = [
  { id: '1-2', label: 'Grades 1-2', list: validateList(grades12) },
  { id: '3-4', label: 'Grades 3-4', list: validateList(grades34) },
  { id: '4-8', label: 'Grades 4-8', list: validateList(grades48) },
  // { id: '9-12', label: 'Grades 9-12', list: validateList(grades912) },
]

export function getGrade(id: GradeId): GradeMeta {
  const g = GRADES.find((g) => g.id === id)
  if (!g) throw new Error(`Unknown grade: ${id}`)
  return g
}

export function isGradeId(value: unknown): value is GradeId {
  return GRADES.some((g) => g.id === value)
}
