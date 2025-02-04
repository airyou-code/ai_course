import { ArrowRight } from "lucide-react"
import { Link } from 'react-router-dom'

interface NextLessonButtonProps {
  url: string
}

export function NextLessonButton({ url }: NextLessonButtonProps) {
  return (
    <Link to={url}>
      <button
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
      >
        Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </Link>

  )
}

