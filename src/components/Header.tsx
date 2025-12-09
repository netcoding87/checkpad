import { Link } from '@tanstack/react-router'
import { Moon, Plane, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <header className="p-4 flex items-center justify-between bg-gray-800 dark:bg-gray-900 text-white shadow-lg">
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <Plane className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold">checkPAD</h1>
      </Link>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-slate-700" />
        )}
      </button>
    </header>
  )
}
