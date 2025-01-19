import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'

export default function Hero() {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 100,
  })

  return (
    <div className="relative dark:bg-zinc-800 text-white py-24">
      {/* Background with subtle curved lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg 
          className="absolute w-full h-full" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#333" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#333" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#gradient)"
          />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <animated.div style={fadeIn} className="text-center">
          <div className="mb-4">
            <span className="inline-block bg-gray-800 text-gray-300 rounded-full px-4 py-1 text-sm mb-4">
              MEMBERSHIP TEMPLATE
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Meet the new home<br />for your online course
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Sell exclusive access to your digital online course and host it with the Framer CMS
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/purchase"
              className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
            >
              Purchase Course
            </Link>
            <Link
              to="/alllessons"
              className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Launch Portal
            </Link>
          </div>
        </animated.div>
      </div>
    </div>
  )
}

