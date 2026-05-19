import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

interface Props {
  diaryDates: Set<string>
}

export default function Calendar({ diaryDates }: Props) {
  const today = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [])

  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1)

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1)
    const lastDay = new Date(viewYear, viewMonth, 0)
    const startDow = firstDay.getDay()
    const totalDays = lastDay.getDate()
    const cells: (number | null)[] = []
    for (let i = 0; i < startDow; i++) cells.push(null)
    for (let d = 1; d <= totalDays; d++) cells.push(d)
    return cells
  }, [viewYear, viewMonth])

  const prevMonth = () => {
    if (viewMonth === 1) { setViewYear(viewYear - 1); setViewMonth(12) }
    else setViewMonth(viewMonth - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 12) { setViewYear(viewYear + 1); setViewMonth(1) }
    else setViewMonth(viewMonth + 1)
  }

  const dateStr = (d: number) =>
    `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  return (
    <div className="bg-beige-200/90 rounded-xl paper-card p-5 border border-beige-400/40">
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="w-8 h-8 rounded hover:bg-beige-200 flex items-center justify-center text-beige-600 text-sm transition-colors">‹</button>
        <span className="text-beige-700 text-sm font-semibold">{viewYear}年{viewMonth}月</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded hover:bg-beige-200 flex items-center justify-center text-beige-600 text-sm transition-colors">›</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-beige-600 text-xs py-0.5">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />
          const ds = dateStr(d)
          const hasDiary = diaryDates.has(ds)
          const isToday = ds === today
          const isFuture = ds > today

          return (
            <div key={ds} className="aspect-square flex items-center justify-center">
              {isFuture ? (
                <span className="text-beige-400 text-sm">{d}</span>
              ) : hasDiary ? (
                <Link
                  to={`/day/${ds}`}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:scale-110"
                  style={{
                    backgroundColor: isToday ? '#b8894a' : '#e5c48c',
                    color: isToday ? '#fff' : '#9a6e3a',
                  }}
                >
                  {d}
                </Link>
              ) : (
                <span className={`text-sm ${isToday ? 'w-8 h-8 rounded-full bg-beige-400 flex items-center justify-center font-medium text-beige-700' : 'text-beige-700'}`}>
                  {d}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
