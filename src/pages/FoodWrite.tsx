import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import NavBar from '../components/NavBar'
import StarRating from '../components/StarRating'

export default function FoodWrite() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const [status, setStatus] = useState<'visited' | 'wishlist'>('visited')
  const [restaurantName, setRestaurantName] = useState('')
  const [dishes, setDishes] = useState('')
  const [rating, setRating] = useState(0)
  const [tasteReview, setTasteReview] = useState('')
  const [notes, setNotes] = useState('')
  const [visitDate, setVisitDate] = useState(todayStr)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(!!editId)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editId) {
      supabase
        .from('food_records')
        .select('*')
        .eq('id', editId)
        .single()
        .then(({ data }) => {
          if (data) {
            setStatus(data.status || 'visited')
            setRestaurantName(data.restaurant_name)
            setDishes(data.dishes)
            setRating(data.rating || 0)
            setTasteReview(data.taste_rating || '')
            setNotes(data.notes || '')
            setVisitDate(data.visit_date)
          }
          setLoading(false)
        })
    }
  }, [editId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!restaurantName.trim() || !dishes.trim()) return
    setError('')
    setSubmitting(true)

    const payload = {
      user_id: user!.id,
      status,
      restaurant_name: restaurantName.trim(),
      dishes: dishes.trim(),
      rating: status === 'wishlist' ? null : (rating || null),
      taste_rating: status === 'wishlist' ? null : (tasteReview.trim() || null),
      notes: notes.trim() || null,
      visit_date: visitDate,
    }

    if (editId) {
      const { error: updateError } = await supabase
        .from('food_records')
        .update(payload)
        .eq('id', editId)

      if (updateError) {
        setError(updateError.message)
        setSubmitting(false)
      } else {
        navigate('/')
      }
    } else {
      const { error: insertError } = await supabase
        .from('food_records')
        .insert(payload)

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-beige-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <NavBar
        center={<span className="font-semibold">{editId ? '编辑美食' : '记录美食'}</span>}
        right={
          <button onClick={() => navigate('/')} className="text-beige-600 hover:text-beige-800 text-sm transition-colors">返回</button>
        }
      />

      <div className="page-enter max-w-2xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setStatus('visited')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${status === 'visited' ? 'bg-beige-700 text-white' : 'bg-beige-200 text-beige-600 hover:bg-beige-300'}`}
          >
            ✅ 打过卡
          </button>
          <button
            type="button"
            onClick={() => setStatus('wishlist')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${status === 'wishlist' ? 'bg-beige-700 text-white' : 'bg-beige-200 text-beige-600 hover:bg-beige-300'}`}
          >
            📝 想去吃
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-beige-700 text-sm mb-1">餐厅名称</label>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
              placeholder="如：海底捞、巷子口火锅..."
            />
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-1">吃了什么</label>
            <input
              type="text"
              required
              value={dishes}
              onChange={(e) => setDishes(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
              placeholder="如：毛肚火锅、红糖糍粑..."
            />
          </div>

          {status === 'visited' && (
            <>
              <div>
                <label className="block text-beige-700 text-sm mb-1">🌟 评分</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="block text-beige-700 text-sm mb-1">评语（可选）</label>
                <input
                  type="text"
                  value={tasteReview}
                  onChange={(e) => setTasteReview(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
                  placeholder="如：毛肚很新鲜，下次还来..."
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-beige-700 text-sm mb-1">小笔记（可选）</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400 resize-none"
              placeholder="有什么想记住的..."
            />
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-1">日期</label>
            <input
              type="date"
              required
              value={visitDate}
              max={todayStr}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 focus:outline-none focus:ring-2 focus:ring-beige-400"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || !restaurantName.trim() || !dishes.trim()}
            className="w-full py-3 rounded-lg bg-beige-700 hover:bg-beige-800 text-white font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? '保存中...' : editId ? '保存修改' : '保存'}
          </button>
        </form>
      </div>
    </div>
  )
}
