import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface DiaryDate {
  diary_date: string
  count: number
}

export default function Home() {
  const { profile, signOut } = useAuth()
  const [dates, setDates] = useState<DiaryDate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('diaries')
      .select('diary_date')
      .order('diary_date', { ascending: false })
      .then(({ data }) => {
        if (data) {
          const grouped: Record<string, number> = {}
          data.forEach((row) => {
            const d = row.diary_date
            grouped[d] = (grouped[d] || 0) + 1
          })
          const list = Object.entries(grouped).map(([diary_date, count]) => ({
            diary_date,
            count,
          }))
          setDates(list)
        }
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-beige-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-bold text-beige-800">我们的日记</h1>
            <p className="text-beige-600 text-sm mt-0.5">{profile?.nickname}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/write"
              className="px-4 py-2 rounded-lg bg-beige-700 hover:bg-beige-800 text-white text-sm font-medium transition-colors"
            >
              写日记
            </Link>
            <Link
              to="/settings"
              className="px-4 py-2 rounded-lg bg-beige-200 hover:bg-beige-300 text-beige-700 text-sm transition-colors"
            >
              设置
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg bg-beige-50 hover:bg-beige-200 text-beige-600 text-sm transition-colors"
            >
              退出
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-beige-500 py-20">加载中...</div>
        ) : dates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-beige-500 text-lg mb-4">还没有写过日记</p>
            <Link
              to="/write"
              className="inline-block px-6 py-2.5 rounded-lg bg-beige-700 hover:bg-beige-800 text-white transition-colors"
            >
              写第一篇
            </Link>
          </div>
        ) : (
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-beige-300" />

            <div className="space-y-6">
              {dates.map((d, i) => (
                <div key={d.diary_date} className="relative">
                  <div
                    className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 ${
                      i === 0
                        ? 'bg-beige-600 border-beige-600'
                        : 'bg-beige-100 border-beige-400'
                    }`}
                  />

                  <Link
                    to={`/day/${d.diary_date}`}
                    className="block bg-beige-50 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-beige-800 font-medium">{d.diary_date}</span>
                      <span className="text-beige-500 text-sm">{d.count} 篇日记</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
