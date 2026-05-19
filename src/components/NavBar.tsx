import type { ReactNode } from 'react'

interface Props {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}

export default function NavBar({ left, center, right }: Props) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-beige-100/70 border-b border-beige-200/50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="w-24 flex justify-start">{left}</div>
        <div className="flex-1 text-center text-beige-800 font-medium text-sm">{center}</div>
        <div className="w-24 flex justify-end gap-1">{right}</div>
      </div>
    </header>
  )
}
