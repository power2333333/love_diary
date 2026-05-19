import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import NavBar from '../components/NavBar'

interface DiaryEntry {
  id: number
  user_id: string
  content: string
  diary_date: string
  created_at: string
}

interface Profile {
  id: string
  nickname: string
  color: string
  gender: string
}

export default function DayDetail() {
  const { date } = useParams<{ date: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [diaryRes, profileRes] = await Promise.all([
        supabase.from('diaries').select('*').eq('diary_date', date).order('created_at', { ascending: true }),
        supabase.from('profiles').select('*'),
      ])

      if (diaryRes.data) {
        setEntries(diaryRes.data)
      }
      if (profileRes.data) {
        const map: Record<string, Profile> = {}
        profileRes.data.forEach((p) => {
          map[p.id] = p as Profile
        })
        setProfiles(map)
      }
      setLoading(false)
    }
    fetchData()
  }, [date])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-beige-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <NavBar
        center={<span className="font-semibold">{date}</span>}
        left={
          <button onClick={() => navigate('/')} className="text-beige-600 hover:text-beige-800 text-sm transition-colors">← 返回</button>
        }
        right={
          <Link to={`/write?date=${date}`} className="px-3 py-1.5 rounded-lg bg-beige-700 hover:bg-beige-800 text-white text-xs transition-colors">补一篇</Link>
        }
      />

      <div className="page-enter max-w-3xl mx-auto px-4 py-8">

        {entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-beige-500 mb-4">这一天还没有日记</p>
            <Link
              to={`/write?date=${date}`}
              className="inline-block px-6 py-2.5 rounded-lg bg-beige-700 hover:bg-beige-800 text-white transition-colors"
            >
              写一篇
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              const isMine = entry.user_id === user?.id
              const profile = profiles[entry.user_id]
              const color = profile?.color || '#f5e4c4'
              return (
                <div
                  key={entry.id}
                  className="rounded-xl p-5 paper-card"
                  style={{ backgroundColor: color }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-beige-800">
                      {profile?.nickname || '未知'}
                      {isMine && <span className="text-beige-500 text-xs ml-1">（我）</span>}
                    </span>
                    <span className="text-beige-600 text-xs">
                      {new Date(entry.created_at).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-beige-800 whitespace-pre-wrap leading-relaxed line-clamp-3">
                    {entry.content}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <Link
                      to={`/diary/${entry.id}`}
                      className="text-beige-600 text-xs hover:text-beige-800 transition-colors"
                    >
                      查看详情 →
                    </Link>
                    {isMine && (
                      <Link
                        to={`/write?edit=${entry.id}`}
                        className="text-beige-500 text-xs hover:text-beige-700 transition-colors"
                      >
                        编辑
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
