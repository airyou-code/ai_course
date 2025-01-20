import { ChevronRight } from "lucide-react"

interface ContinueButtonProps {
  onClick: () => void
}

export function ContinueButton({ onClick }: ContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
    >
      Continue <ChevronRight className="ml-2 h-4 w-4" />
    </button>
  )
}

