import { useEffect, useState } from 'react'

export default function useDebounce(value: any, delay: number) {
  // Состояние и сеттер для отложенного значения
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}
