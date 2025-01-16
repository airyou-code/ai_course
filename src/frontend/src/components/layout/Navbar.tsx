import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

interface NavbarProps {
  onSignIn?: () => void
  onPurchase?: () => void
}

export default function Navbar({ onSignIn, onPurchase }: NavbarProps) {
  return (
    <nav className="bg-black border-b border-slate-600 px-4 py-3 flex items-center justify-between">
      {/* Logo and Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
        <span className="text-white text-lg font-medium">Course Hub</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-white hover:text-purple-400 transition-colors">
          Home
        </Link>
        <Link to="/alllessons" className="text-white hover:text-purple-400 transition-colors">
          Portal
        </Link>
        <Link to="/activate" className="text-white hover:text-purple-400 transition-colors">
          Activate License
        </Link>
        <Link to="/remix" className="text-white hover:text-purple-400 transition-colors">
          Free Remix
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/auth"
          className="px-4 py-2 text-white bg-transparent hover:bg-gray-800 rounded-lg transition-colors"
        >
          Sign In
        </Link>
        <button className="flex items-center gap-2 px-4 py-2 text-white bg-transparent hover:bg-gray-800 rounded-lg transition-colors">
          <Heart className="w-5 h-5" />
          Favorites
        </button>
        <button
          onClick={onPurchase}
          className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Purchase Course
        </button>
      </div>
    </nav>
  )
}

