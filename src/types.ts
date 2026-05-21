export type GradeId = '1-2' | '3-4' | '4-8' | '9-12'

export type LetterState = 'correct' | 'present' | 'absent'

export interface WordList {
  grade: GradeId
  wordLength: number
  words: string[]
}

export interface GradeMeta {
  id: GradeId
  label: string
  list: WordList
}

export type GameStatus = 'playing' | 'won' | 'lost'

export interface PersistedGame {
  guesses: string[]
}
