import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import NavBar from '../components/NavBar'

const PRESET_COLORS = [
  { label: '淡粉', value: '#FFE4E1' },
  { label: '淡蓝', value: '#D6EAF8' },
  { label: '淡绿', value: '#D5F5E3' },
  { label: '淡紫', value: '#E8DAEF' },
  { label: '淡橙', value: '#FAE5D3' },
  { label: '淡黄', value: '#FCF3CF' },
]

export default function Settings() {
  const { profile, refreshProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [nickname, setNickname] = useState(profile?.nickname || '')
  const [color, setColor] = useState(profile?.color || '#FFE4E1')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!nickname.trim()) return
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('profiles')
      .update({ nickname: nickname.trim(), color })
      .eq('id', profile!.id)

    if (error) {
      setMessage('保存失败：' + error.message)
    } else {
      await refreshProfile()
      setMessage('保存成功')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen">
      <NavBar
        center={<span className="font-semibold">设置</span>}
        right={
          <button onClick={() => navigate('/')} className="text-beige-600 hover:text-beige-800 text-sm transition-colors">返回</button>
        }
      />

      <div className="page-enter max-w-3xl mx-auto px-4 py-8">
        <div className="bg-beige-50 rounded-2xl paper-card p-6 space-y-5">
          <div>
            <label className="block text-beige-700 text-sm mb-1">昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 focus:outline-none focus:ring-2 focus:ring-beige-400"
            />
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-2">日记代表色</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      color === c.value ? 'border-beige-700 scale-110' : 'border-beige-300'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                  <span className="text-xs text-beige-600">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-1">自定义颜色</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          {/* 预览卡片 */}
          <div>
            <label className="block text-beige-700 text-sm mb-2">预览效果</label>
            <div
              className="rounded-xl p-4 transition-colors duration-300"
              style={{ backgroundColor: color }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-beige-800 text-sm">{nickname || '你的昵称'}</span>
                <span className="text-beige-600 text-xs">12:00</span>
              </div>
              <p className="text-beige-800 text-sm leading-relaxed">
                这是日记卡片的预览效果。改颜色后这里会实时变化，帮助你选择最喜欢的颜色。
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`text-sm rounded-lg p-3 ${
                message.startsWith('保存失败')
                  ? 'bg-red-50 text-red-600'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !nickname.trim()}
            className="w-full py-3 rounded-lg bg-beige-700 hover:bg-beige-800 text-white font-medium transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>

          <button
            onClick={signOut}
            className="w-full py-2.5 rounded-lg text-beige-500 hover:text-beige-700 hover:bg-beige-200 text-sm transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}
