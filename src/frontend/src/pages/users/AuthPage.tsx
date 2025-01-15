import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg">
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-center ${
                isSignIn ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'
              }`}
              onClick={() => setIsSignIn(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 text-center ${
                !isSignIn ? 'text-white border-b-2 border-purple-600' : 'text-gray-400'
              }`}
              onClick={() => setIsSignIn(false)}
            >
              Sign Up
            </button>
          </div>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                {isSignIn && (
                  <a href="#" className="text-sm text-purple-400 hover:underline">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          {isSignIn && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">License not activated yet?</p>
              <a href="#" className="text-sm text-purple-400 hover:underline">
                Activate
              </a>
            </div>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Powered by FramerAuth</p>
          </div>
        </div>
      </div>
    </div>
  )
}

