import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CourseInfoProps {
  title?: string
  currentPrice?: number
  originalPrice?: number
}

export default function CourseInfo({ 
  title = "Framer Course", 
  currentPrice = 299.00, 
  originalPrice = 499.00 
}: CourseInfoProps) {
  return (
    <div className="bg-purple-900 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-white rounded-full"></div>
        <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
      </div>
      <div className="text-sm text-purple-300 mb-2">ONLINE COURSE</div>
      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      <div className="flex items-baseline space-x-2 mb-6">
        <span className="text-3xl text-white font-bold">${currentPrice.toFixed(2)}</span>
        <span className="text-xl text-white line-through">${originalPrice.toFixed(2)}</span>
      </div>
      <button className="w-full bg-white text-black font-bold py-3 rounded-lg mb-3">
        Purchase Course
      </button>
      <Link to="/all-lessons" className="block w-full">
        <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg mb-4">
          Launch Portal
        </button>
      </Link>
      <div className="flex items-center text-purple-300">
        <Shield className="w-5 h-5 mr-2" />
        <span>Money-Back Guarantee</span>
      </div>
    </div>
  )
}

