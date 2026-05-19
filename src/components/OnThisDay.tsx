import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Entry {
  id: number
  content: string
  nickname: string
}

export default function OnThisDay() {
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const lastYear = `${year - 1}-${month}-${day}`

        const { data } = await supabase
          .from('diaries')
          .select('id, content, user_id')
          .eq('diary_date', lastYear)
          .limit(1)

        if (data && data.length > 0) {
          const d = data[0]
          const { data: profile } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', d.user_id)
            .single()

          setEntry({
            id: d.id,
            content: d.content.slice(0, 40) + (d.content.length > 40 ? '...' : ''),
            nickname: profile?.nickname || '回忆',
          })
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return null

  return (
    <div
      className="fixed left-4 bottom-4 z-20 w-72 hidden md:block bg-beige-200/90 rounded-xl paper-card p-4 border border-beige-400/40"
      style={{ animation: 'fadeIn 0.35s ease-out' }}
    >
      <p className="text-beige-600 text-xs mb-1">📅 那年今日</p>
      {entry ? (
        <>
          <p className="text-beige-800 text-sm leading-relaxed mb-2">{entry.content}</p>
          <p className="text-beige-500 text-xs">
            — {entry.nickname} · {new Date().getFullYear() - 1}年
          </p>
          <Link
            to={`/diary/${entry.id}`}
            className="block mt-2 text-beige-600 text-xs hover:text-beige-800 transition-colors"
          >
            查看全文 →
          </Link>
        </>
      ) : (
        <p className="text-beige-500 text-xs leading-relaxed">
          等到明年今天，这里就会显示去年今日你们写下的回忆。
        </p>
      )}
    </div>
  )
}
