import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface FoodRecord {
  id: number
  restaurant_name: string
  dishes: string
  taste_rating: string | null
  visit_date: string
  status: string
  nickname: string
  color: string
}

export default function FoodCard() {
  const [visited, setVisited] = useState<FoodRecord[]>([])
  const [wishlist, setWishlist] = useState<FoodRecord[]>([])

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('food_records')
          .select('id, restaurant_name, dishes, taste_rating, visit_date, status, user_id')
          .order('visit_date', { ascending: false })
          .limit(20)

        if (data && data.length > 0) {
          const ids = [...new Set(data.map((d) => d.user_id))]
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, nickname, color')
            .in('id', ids)

          const map: Record<string, { nickname: string; color: string }> = {}
          profiles?.forEach((p) => { map[p.id] = { nickname: p.nickname, color: p.color } })

          const mapped = data.map((d) => ({
            ...d,
            nickname: map[d.user_id]?.nickname || '未知',
            color: map[d.user_id]?.color || '#f5e4c4',
          }))

          setVisited(mapped.filter((d) => d.status === 'visited').slice(0, 3))
          setWishlist(mapped.filter((d) => d.status === 'wishlist').slice(0, 3))
        }
      } catch {}
    })()
  }, [])

  return (
    <>
      {/* PC：右侧浮动 */}
      <div className="fixed right-4 top-20 z-20 w-80 hidden lg:block bg-beige-200/90 rounded-xl paper-card p-4 border border-beige-400/40" style={{ animation: 'fadeIn 0.35s ease-out' }}>
        <Link to="/food/write" onMouseEnter={() => { const l = document.createElement('link'); l.rel = 'prefetch'; l.as = 'document'; l.href = '/food/write'; document.head.appendChild(l) }} className="flex justify-between items-center mb-3 hover:opacity-70 transition-opacity">
          <p className="text-beige-600 text-sm">🍽️ 美食地图</p>
          <span className="text-beige-500 text-lg leading-none">+</span>
        </Link>

        {/* 去过 */}
        <p className="text-beige-500 text-xs mb-1.5">✅ 打过卡</p>
        {visited.length === 0 ? (
          <Link to="/food/write" className="block text-beige-400 text-xs mb-3 hover:text-beige-600 transition-colors">还没记录，点此添加</Link>
        ) : (
          <div className="space-y-1.5 mb-3">
            {visited.map((r) => (
              <Link key={r.id} to={`/food/write?edit=${r.id}`} className="block rounded-lg p-2 hover:opacity-80 transition-opacity" style={{ backgroundColor: r.color }}>
                <p className="text-beige-800 text-sm font-medium truncate">{r.restaurant_name}</p>
                <p className="text-beige-600 text-xs truncate">{r.dishes}</p>
                {r.taste_rating && <p className="text-beige-500 text-xs mt-0.5">{r.taste_rating}</p>}
              </Link>
            ))}
          </div>
        )}

        {/* 想去 */}
        <p className="text-beige-500 text-xs mb-1.5">📝 想去吃</p>
        {wishlist.length === 0 ? (
          <Link to="/food/write" className="block text-beige-400 text-xs hover:text-beige-600 transition-colors">还没想好，点此添加</Link>
        ) : (
          <div className="space-y-1.5">
            {wishlist.map((r) => (
              <Link key={r.id} to={`/food/write?edit=${r.id}`} className="block rounded-lg p-2 hover:opacity-80 transition-opacity" style={{ backgroundColor: r.color }}>
                <p className="text-beige-800 text-sm font-medium truncate">{r.restaurant_name}</p>
                <p className="text-beige-600 text-xs truncate">{r.dishes}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 手机：底部入口 */}
      <Link to="/food/write" className="fixed right-4 bottom-20 z-20 lg:hidden w-12 h-12 rounded-full bg-beige-200/90 border border-beige-400/40 flex items-center justify-center text-xl shadow-lg hover:scale-105 transition-transform" style={{ animation: 'fadeIn 0.35s ease-out' }}>
        🍽️
      </Link>
    </>
  )
}
