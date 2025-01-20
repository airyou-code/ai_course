import { Send } from "lucide-react"

interface ChatInputProps {
  onSubmit: (message: string) => void
  placeholder?: string
}

export function ChatInput({ onSubmit, placeholder = "Send a message" }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem("message") as HTMLInputElement
    if (input.value.trim()) {
      onSubmit(input.value)
      input.value = ""
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        name="message"
        placeholder={placeholder}
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  )
}

