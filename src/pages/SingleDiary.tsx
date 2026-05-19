import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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

function formatTime(iso: string) {
  const d = new Date(iso)
  return `记于${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}时${String(d.getMinutes()).padStart(2, '0')}分`
}

export default function SingleDiary() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<(DiaryEntry & { nickname?: string; color?: string }) | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDiary() {
      const { data: diaryData } = await supabase
        .from('diaries')
        .select('*')
        .eq('id', id)
        .single()

      if (diaryData) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('nickname, color')
          .eq('id', diaryData.user_id)
          .single()

        setEntry({
          ...diaryData,
          nickname: profileData?.nickname || '未知',
          color: profileData?.color || '#f5e4c4',
        })
      }
      setLoading(false)
    }
    fetchDiary()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-beige-500">加载中...</p>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-beige-500">日记不存在</p>
      </div>
    )
  }

  const isMine = entry.user_id === user?.id

  return (
    <div className="min-h-screen">
      <NavBar
        center={<span className="text-beige-600 text-sm">{entry.diary_date}</span>}
        left={
          <button onClick={() => navigate(`/day/${entry.diary_date}`)} className="text-beige-600 hover:text-beige-800 text-sm transition-colors">← 返回</button>
        }
        right={
          isMine ? (
            <Link to={`/write?edit=${entry.id}`} className="px-3 py-1.5 rounded-lg bg-beige-200 hover:bg-beige-300 text-beige-700 text-xs transition-colors">编辑</Link>
          ) : undefined
        }
      />

      <div className="page-enter max-w-3xl mx-auto px-4 py-8">

        <div
          className="rounded-2xl p-6 paper-card"
          style={{ backgroundColor: entry.color }}
        >
          <div className="mb-4">
            <span className="font-medium text-beige-800 text-lg">
              {entry.nickname}
              {isMine && <span className="text-beige-500 text-sm ml-1">（我）</span>}
            </span>
          </div>

          <p className="text-beige-900 whitespace-pre-wrap leading-relaxed text-base mb-4">
            {entry.content}
          </p>

          <p className="text-beige-600 text-sm text-right">
            {formatTime(entry.created_at)}
          </p>
        </div>
      </div>
    </div>
  )
}
