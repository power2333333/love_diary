import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Write() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const today = new Date().toISOString().slice(0, 10)
  const [diaryDate, setDiaryDate] = useState(today)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(!!editId)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editId) {
      supabase
        .from('diaries')
        .select('*')
        .eq('id', editId)
        .single()
        .then(({ data }) => {
          if (data) {
            setDiaryDate(data.diary_date)
            setContent(data.content)
          }
          setLoading(false)
        })
    }
  }, [editId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setError('')
    setSubmitting(true)

    if (editId) {
      const { error: updateError } = await supabase
        .from('diaries')
        .update({ content: content.trim(), diary_date: diaryDate })
        .eq('id', editId)

      if (updateError) {
        setError(updateError.message)
        setSubmitting(false)
      } else {
        navigate(`/diary/${editId}`)
      }
    } else {
      const { error: insertError } = await supabase
        .from('diaries')
        .insert({ user_id: user!.id, content: content.trim(), diary_date: diaryDate })

      if (insertError) {
        setError(insertError.message)
        setSubmitting(false)
      } else {
        navigate('/')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100 flex items-center justify-center">
        <p className="text-beige-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-beige-800">
            {editId ? '编辑日记' : '写日记'}
          </h1>
          <button
            onClick={() => navigate(editId ? `/diary/${editId}` : '/')}
            className="text-beige-600 hover:text-beige-800 text-sm transition-colors"
          >
            返回
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-beige-700 text-sm mb-1">日期</label>
            <input
              type="date"
              required
              value={diaryDate}
              max={today}
              onChange={(e) => setDiaryDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 focus:outline-none focus:ring-2 focus:ring-beige-400"
            />
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-1">
              日记内容 <span className="text-beige-400">（{profile?.nickname}）</span>
            </label>
            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400 resize-none"
              placeholder="今天发生了什么..."
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="w-full py-3 rounded-lg bg-beige-700 hover:bg-beige-800 text-white font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? '保存中...' : editId ? '保存修改' : '保存日记'}
          </button>
        </form>
      </div>
    </div>
  )
}
