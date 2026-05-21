import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

// 预加载页面组件（鼠标悬停时提前下载）
const prefetch = (path: string) => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = 'document'
  link.href = path
  document.head.appendChild(link)
}
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import NavBar from '../components/NavBar'
import Calendar from '../components/Calendar'
import OnThisDay from '../components/OnThisDay'
import StatsCard from '../components/StatsCard'
import FoodCard from '../components/FoodCard'

interface DiaryDate {
  diary_date: string
  count: number
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function formatDateCN(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${WEEKDAYS[d.getDay()]}`
}

export default function Home() {
  const { profile } = useAuth()
  const [dates, setDates] = useState<DiaryDate[]>([])
  const [loading, setLoading] = useState(true)

  const daysTogether = useMemo(() => {
    const start = new Date(2026, 3, 12)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('diaries')
          .select('diary_date')
          .order('diary_date', { ascending: false })
        if (data) {
          const grouped: Record<string, number> = {}
          data.forEach((row) => {
            const d = row.diary_date
            grouped[d] = (grouped[d] || 0) + 1
          })
          setDates(Object.entries(grouped).map(([diary_date, count]) => ({ diary_date, count })))
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen">
      <NavBar
        left={<span className="text-beige-700 text-sm font-medium">{profile?.nickname}</span>}
        center={<span className="text-beige-800 font-semibold">我们的日记</span>}
        right={
          <>
            <Link to="/search" onMouseEnter={() => prefetch('/search')} className="px-3 py-1.5 rounded-lg hover:bg-beige-200 text-beige-600 text-xs transition-colors">搜索</Link>
            <Link to="/write" onMouseEnter={() => prefetch('/write')} className="px-3 py-1.5 rounded-lg bg-beige-700 hover:bg-beige-800 text-white text-xs font-medium transition-colors">写日记</Link>
            <Link to="/settings" onMouseEnter={() => prefetch('/settings')} className="px-3 py-1.5 rounded-lg bg-beige-200 hover:bg-beige-300 text-beige-700 text-xs transition-colors">设置</Link>
          </>
        }
      />

      {/* 左上角浮动月历 */}
      <div className="fixed left-4 top-20 z-20 w-80 hidden md:block" style={{ animation: 'fadeIn 0.35s ease-out' }}>
        <Calendar diaryDates={new Set(dates.map((d) => d.diary_date))} />
      </div>

      {/* 左下角那年今日 */}
      <OnThisDay />

      {/* 左下角数据统计 */}
      <StatsCard />

      {/* 右侧美食记录 */}
      <FoodCard />

      <div className="page-enter max-w-3xl mx-auto px-4 py-8 relative">

        {/* 纪念日卡片 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-beige-200 via-beige-100 to-beige-300 py-5 sm:py-6 px-5 sm:px-8 mb-8 sm:mb-10 shadow-sm">
          <div className="absolute top-2 right-3 text-3xl sm:text-5xl opacity-20 select-none">💕</div>
          <div className="relative">
            <p className="text-beige-700 text-xs sm:text-sm tracking-wider">我们已经在一起</p>
            <p className="anniversary-number text-beige-800 text-3xl sm:text-5xl font-bold my-1 sm:my-2 tracking-tight">{daysTogether}</p>
            <p className="text-beige-700 text-xs sm:text-sm">天</p>
          </div>
        </div>

        {/* 时间轴 */}
        {loading ? (
          <div className="text-center text-beige-500 py-20">加载中...</div>
        ) : dates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-beige-500 text-lg mb-4">还没有写过日记</p>
            <Link to="/write" className="inline-block px-6 py-2.5 rounded-lg bg-beige-700 hover:bg-beige-800 text-white transition-colors">写第一篇</Link>
          </div>
        ) : (
          <div className="relative pl-7 sm:pl-10">
            {/* 时间轴装饰 */}
            {[
              { top: '2%', left: 8, emoji: '✨', size: 16, opacity: 0.35 },
              { top: '16%', left: 0, emoji: '💫', size: 14, opacity: 0.3 },
              { top: '30%', left: 7, emoji: '🌸', size: 18, opacity: 0.3 },
              { top: '44%', left: 1, emoji: '💕', size: 15, opacity: 0.28 },
              { top: '58%', left: 6, emoji: '⭐', size: 14, opacity: 0.32 },
              { top: '72%', left: 2, emoji: '🌿', size: 16, opacity: 0.28 },
              { top: '86%', left: 5, emoji: '✨', size: 14, opacity: 0.3 },
            ].map((d, i) => (
              <span
                key={i}
                className="absolute select-none pointer-events-none"
                style={{ top: d.top, left: d.left, fontSize: d.size, opacity: d.opacity, transform: 'translateY(-50%)' }}
              >
                {d.emoji}
              </span>
            ))}
            <div
              className="absolute left-[14px] top-3 bottom-3 w-0.5"
              style={{
                background: 'linear-gradient(to bottom, #b8894a 0%, #e5c48c 40%, #eed4a8 100%)',
              }}
            />

            <div className="space-y-8">
              {dates.map((d, i) => (
                <div key={d.diary_date} className="relative group timeline-item">
                  <div
                    className="absolute -left-[21px] top-2 w-4 h-4 rounded-full border-2 shadow-sm transition-all group-hover:scale-125"
                    style={{
                      backgroundColor: i === 0 ? '#b8894a' : '#fdf9f1',
                      borderColor: i === 0 ? '#b8894a' : '#d4a96a',
                    }}
                  />

                  <Link
                    to={`/day/${d.diary_date}`}
                    className="block bg-beige-50/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 group-hover:-translate-y-0.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-beige-800 font-medium text-xs sm:text-base">{formatDateCN(d.diary_date)}</span>
                      <span className="text-beige-500 text-sm bg-beige-200 rounded-full px-3 py-0.5">{d.count} 篇</span>
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
