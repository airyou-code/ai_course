import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserState } from '../../hooks/user';
import { User } from 'lucide-react';
import ROUTES from '../../config/routes';

interface NavbarProps {
  onSignIn?: () => void
  onPurchase?: () => void
}

export default function Navbar({ onSignIn, onPurchase }: NavbarProps) {
  
  const { hasFetched, loggedIn } = useUserState();

  return (
    <nav className="bg-zinc-800 border-b border-slate-400 px-4 py-3 flex items-center justify-between">
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
        {loggedIn ? (
            <Link
            to={{ pathname: ROUTES.PROFILE }}
              className="px-4 py-2 text-white bg-transparent hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                <User size={25} />
              </div>
            </Link>
          ) : (
            <Link
              to={{ pathname: ROUTES.LOGIN }}
              className="px-4 py-2 text-white bg-transparent hover:bg-gray-800 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )
        }
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

