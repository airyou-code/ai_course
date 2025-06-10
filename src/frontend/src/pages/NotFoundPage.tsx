import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 200,
  })
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <animated.div style={fadeIn} className="text-center">
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl mb-8">{t('notFound.message')}</p>
        <Link 
          to="/" 
          className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          {t('notFound.goHome')}
        </Link>
        <p className="text-gray-500 mt-4">{t('notFound.countryRoads')}</p>
      </animated.div>
    </div>
  )
}
