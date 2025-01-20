import { ArrowRight } from "lucide-react"

interface NextLessonButtonProps {
  onClick: () => void
  url: string
}

export function NextLessonButton({ onClick, url }: NextLessonButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center"
    >
      Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
    </button>
  )
}

