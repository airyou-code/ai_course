import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

interface NextLessonButtonProps {
  onClick: () => void;
  url: string;
}

export function NextLessonButton({ onClick, url }: NextLessonButtonProps) {
  return (
    <Button 
      onClick={onClick}
      className="w-full"
      variant="default"
    >
      Next Lesson <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}

