import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const FEMALE_COLOR = '#FFE4E1'
const MALE_COLOR = '#D6EAF8'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [color, setColor] = useState(FEMALE_COLOR)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await signUp(email, password, nickname, gender, color)
    if (err) setError(err)
    else navigate('/')
    setSubmitting(false)
  }

  const handleGenderChange = (g: 'male' | 'female') => {
    setGender(g)
    setColor(g === 'male' ? MALE_COLOR : FEMALE_COLOR)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-beige-50 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-beige-800 text-center mb-6">注册账号</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-beige-700 text-sm mb-1">邮箱</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
              placeholder="输入邮箱"
            />
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-1">密码</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
              placeholder="至少 6 位"
            />
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-1">昵称</label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
              placeholder="你的昵称"
            />
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-2">身份</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleGenderChange('female')}
                className={`flex-1 py-2.5 rounded-lg border-2 transition-colors ${
                  gender === 'female'
                    ? 'border-pink-400 bg-pink-50 text-pink-700'
                    : 'border-beige-300 bg-white text-beige-600'
                }`}
              >
                👧 女生
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('male')}
                className={`flex-1 py-2.5 rounded-lg border-2 transition-colors ${
                  gender === 'male'
                    ? 'border-blue-400 bg-blue-50 text-blue-700'
                    : 'border-beige-300 bg-white text-beige-600'
                }`}
              >
                👦 男生
              </button>
            </div>
          </div>

          <div>
            <label className="block text-beige-700 text-sm mb-1">代表色</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-beige-700 hover:bg-beige-800 text-white font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="text-beige-600 text-sm text-center mt-4">
          已有账号？<Link to="/login" className="text-beige-800 underline">去登录</Link>
        </p>
      </div>
    </div>
  )
}
