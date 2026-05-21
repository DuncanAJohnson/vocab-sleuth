import { useMemo, useState } from 'react'
import type { GradeId } from '../types'
import { GRADES, getGrade } from '../lib/grades'
import { loadSelectedGrade } from '../lib/storage'
import { Header } from '../components/Header'

export function WordListPage() {
  const [gradeId, setGradeId] = useState<GradeId>(
    () => loadSelectedGrade() ?? GRADES[0].id,
  )
  const grade = getGrade(gradeId)

  const alphabetized = useMemo(
    () => [...grade.list.words].sort((a, b) => a.localeCompare(b)),
    [grade],
  )

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header rightLink={{ href: '#/', label: '← Back to game' }} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <h1 className="mb-1 text-2xl font-bold">Word Lists</h1>
        <p className="mb-5 text-sm text-slate-600">
          The full vocabulary pool for each grade band, alphabetized.
        </p>

        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Grade band">
          {GRADES.map((g) => {
            const active = g.id === gradeId
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setGradeId(g.id)}
                className={
                  'rounded-md px-3 py-1.5 text-sm font-medium ring-1 transition ' +
                  (active
                    ? 'bg-slate-800 text-amber-50 ring-slate-800'
                    : 'bg-white text-slate-800 ring-slate-300 hover:bg-amber-50 hover:ring-amber-400')
                }
              >
                {g.label}
              </button>
            )
          })}
        </div>

        <div className="mb-3 text-sm text-slate-600">
          {grade.list.wordLength} letters · {alphabetized.length} words
        </div>

        {alphabetized.length === 0 ? (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-amber-200">
            No words yet for {grade.label}.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
            {alphabetized.map((word) => (
              <li
                key={word}
                className="rounded px-2 py-1 font-mono text-sm font-semibold uppercase text-slate-900"
              >
                {word}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
