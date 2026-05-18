import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    if (err) setError(err)
    else navigate('/')
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-beige-100 flex items-center justify-center p-4">
      <div className="bg-beige-50 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-beige-800 text-center mb-6">登录</h1>

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-beige-300 bg-white text-beige-800 placeholder-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-400"
              placeholder="输入密码"
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
            {submitting ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-beige-600 text-sm text-center mt-4">
          没有账号？<Link to="/register" className="text-beige-800 underline">去注册</Link>
        </p>
      </div>
    </div>
  )
}
