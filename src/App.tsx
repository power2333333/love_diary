import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

const ProtectedApp = lazy(() => import('./ProtectedApp'))

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-beige-500">加载中...</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Suspense fallback={<Loading />}><ProtectedApp /></Suspense>} />
      </Routes>
    </BrowserRouter>
  )
}
