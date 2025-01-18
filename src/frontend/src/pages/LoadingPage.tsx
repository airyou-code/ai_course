import { useSpring, animated } from 'react-spring'

export default function LoadingPage() {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    loop: true,
    config: { duration: 1000 },
  })

  const bounce = useSpring({
    from: { transform: 'translateY(0px)' },
    to: [
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0px)' },
    ],
    loop: true,
    config: { duration: 500 },
  })

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <animated.div style={fadeIn} className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Loading...</h1>
        <animated.div style={bounce} className="w-10 h-10 bg-white rounded-full"></animated.div>
        <p className="text-gray-500 mt-4">Please wait while we prepare everything for you.</p>
      </animated.div>
    </div>
  )
}
