import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'

const Home = lazy(() => import('./pages/Home'))
const Write = lazy(() => import('./pages/Write'))
const DayDetail = lazy(() => import('./pages/DayDetail'))
const Settings = lazy(() => import('./pages/Settings'))
const SingleDiary = lazy(() => import('./pages/SingleDiary'))

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-beige-500">加载中...</p>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <Suspense fallback={<Loading />}>{children}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/write" element={<ProtectedRoute><Write /></ProtectedRoute>} />
          <Route path="/day/:date" element={<ProtectedRoute><DayDetail /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/diary/:id" element={<ProtectedRoute><SingleDiary /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
