import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Stats {
  total: number
  days: number
  thisMonth: number
}

export default function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('diaries').select('diary_date')

        if (data) {
          const now = new Date()
          const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
          const days = new Set(data.map((d) => d.diary_date))

          setStats({
            total: data.length,
            days: days.size,
            thisMonth: data.filter((d) => d.diary_date.startsWith(thisMonth)).length,
          })
        }
      } catch {}
    })()
  }, [])

  if (!stats) return null

  return (
    <div
      className="fixed left-4 bottom-4 z-20 w-80 hidden md:block bg-beige-200/90 rounded-xl paper-card p-4 border border-beige-400/40"
      style={{ animation: 'fadeIn 0.35s ease-out' }}
    >
      <p className="text-beige-600 text-xs mb-3">📊 我们的数据</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-beige-800 text-lg font-bold">{stats.total}</p>
          <p className="text-beige-500 text-[10px]">总篇数</p>
        </div>
        <div>
          <p className="text-beige-800 text-lg font-bold">{stats.days}</p>
          <p className="text-beige-500 text-[10px]">写作天</p>
        </div>
        <div>
          <p className="text-beige-800 text-lg font-bold">{stats.thisMonth}</p>
          <p className="text-beige-500 text-[10px]">本月</p>
        </div>
      </div>
    </div>
  )
}
