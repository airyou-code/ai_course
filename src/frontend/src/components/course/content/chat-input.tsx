import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSubmit, placeholder = "Send a message" }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('message') as HTMLInputElement
    if (input.value.trim()) {
      onSubmit(input.value)
      input.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        name="message"
        placeholder={placeholder}
        className="pr-10"
      />
      <Button 
        type="submit" 
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}

