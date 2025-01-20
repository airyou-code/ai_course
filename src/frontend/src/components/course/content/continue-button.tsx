import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'

interface ContinueButtonProps {
  onClick: () => void;
}

export function ContinueButton({ onClick }: ContinueButtonProps) {
  return (
    <Button 
      onClick={onClick}
      className="w-full"
    >
      Continue <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  )
}

