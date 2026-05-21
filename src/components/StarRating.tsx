import { useState } from 'react'

interface Props {
  value: number
  onChange: (v: number) => void
}

export default function StarRating({ value, onChange }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const display = hovered ?? value

  const handleClick = (starIndex: number, half: boolean) => {
    onChange(half ? starIndex + 0.5 : starIndex + 1)
  }

  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = display >= i + 1 ? 1 : display >= i + 0.5 ? 0.5 : 0

        return (
          <button
            key={i}
            type="button"
            className="relative w-8 h-8 cursor-pointer"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const half = e.clientX - rect.left < rect.width / 2
              setHovered(i + (half ? 0.5 : 1))
            }}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const half = e.clientX - rect.left < rect.width / 2
              handleClick(i, half)
            }}
          >
            {/* 背景空星 */}
            <span className="absolute inset-0 flex items-center justify-center text-2xl text-beige-300 select-none">★</span>
            {/* 实心星 */}
            <span
              className="absolute inset-0 flex items-center justify-center text-2xl text-yellow-500 select-none overflow-hidden transition-[width] duration-75"
              style={{ width: filled === 1 ? '100%' : filled === 0.5 ? '50%' : '0%' }}
            >
              ★
            </span>
          </button>
        )
      })}
      <span className="text-beige-600 text-sm ml-2 min-w-[2ch]">{display > 0 ? display : '-'}</span>
    </div>
  )
}
