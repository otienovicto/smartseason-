import React, { useEffect, useState } from 'react'
import { subscribePending, getPendingCount } from '../services/api'

export default function LoadingIndicator() {
  const [count, setCount] = useState(getPendingCount())
  useEffect(() => {
    const unsub = subscribePending((n) => setCount(n))
    return unsub
  }, [])
  if (!count) return null
  return (
    <div style={{
      position: 'fixed',
      top: 12,
      right: 12,
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '6px 10px',
      borderRadius: 6,
      zIndex: 1000,
      fontSize: 13
    }}>
      Loading...
    </div>
  )
}
