'use client'
import { useEffect, useRef, useState } from 'react'

export function useElapsed(active: boolean) {
  const [elapsed, setElapsed] = useState('0:00')
  const startRef = useRef(Date.now())

  useEffect(() => {
    if (!active) return
    startRef.current = Date.now()
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - startRef.current) / 1000)
      setElapsed(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(id)
  }, [active])

  return elapsed
}
