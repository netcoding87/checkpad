import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
      <h1 className="text-2xl font-bold">
        <Link to="/" className="hover:text-cyan-400 transition-colors">
          Checkpad
        </Link>
      </h1>
    </header>
  )
}
