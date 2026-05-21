import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import NavBar from '../components/NavBar'

interface Result {
  id: number
  content: string
  diary_date: string
  created_at: string
  user_id: string
  nickname: string
  color: string
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    const q = query.trim()
    if (!q) return
    setLoading(true)
    setSearched(true)

    try {
      const { data } = await supabase
        .from('diaries')
        .select('id, content, diary_date, created_at, user_id')
        .ilike('content', `%${q}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (data && data.length > 0) {
        const ids = [...new Set(data.map((d) => d.user_id))]
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, nickname, color')
          .in('id', ids)

        const profileMap: Record<string, { nickname: string; color: string }> = {}
        profiles?.forEach((p) => {
          profileMap[p.id] = { nickname: p.nickname, color: p.color }
        })

        setResults(
          data.map((d) => ({
            ...d,
            nickname: profileMap[d.user_id]?.nickname || '未知',
            color: profileMap[d.user_id]?.color || '#f5e4c4',
          }))
        )
      } else {
        setResults([])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <NavBar
        center={<span className="font-semibold">搜索</span>}
      />

      <div className="page-enter max-w-3xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索日记内容..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 rounded-lg bg-beige-700 hover:bg-beige-800 text-white font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '搜索中...' : '搜索'}
          </button>
        </div>

        {searched && !loading && results.length === 0 && (
          <div className="text-center text-beige-500 py-12">没有找到相关日记</div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-beige-500 text-sm">找到 {results.length} 篇日记</p>
            {results.map((r) => {
              const matchStart = r.content.toLowerCase().indexOf(query.trim().toLowerCase())
              const snippet =
                matchStart >= 0
                  ? '...' + r.content.slice(Math.max(0, matchStart - 15), matchStart + query.length + 60) + '...'
                  : r.content.slice(0, 80) + '...'

              return (
                <Link
                  key={r.id}
                  to={`/diary/${r.id}`}
                  className="block rounded-xl p-4 paper-card hover:-translate-y-0.5"
                  style={{ backgroundColor: r.color }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-beige-800 text-sm font-medium">{r.nickname}</span>
                    <span className="text-beige-600 text-xs">{r.diary_date}</span>
                  </div>
                  <p className="text-beige-700 text-sm leading-relaxed">{snippet}</p>
                </Link>
              )
            })}
          </div>
        )}

        {!searched && (
          <div className="text-center text-beige-400 py-12">输入关键词搜索你们的日记</div>
        )}
      </div>
    </div>
  )
}
