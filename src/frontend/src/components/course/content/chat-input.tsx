import React, { useRef, useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({
  onSubmit,
  placeholder = "Send a message",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage("");
      if (textareaRef.current) {
        // Сбрасываем высоту при очистке
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setMessage(value);

    // Автоматическая подстройка высоты
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // При Enter (без Shift) отправляем форму
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // чтобы не добавлялся перенос
      // "Ручной" вызов handleSubmit
      if (message.trim()) {
        onSubmit(message.trim());
        setMessage("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="
            w-full px-4 py-2 pr-10 
            border border-gray-300 dark:border-gray-600
            rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            resize-none overflow-hidden
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
          "
          style={{ minHeight: "2.5rem" }}
        />
        <button
          type="submit"
          className="
            absolute right-2 top-1/2 transform -translate-y-1/2 
            p-1 rounded-full 
            bg-blue-500 dark:bg-blue-600 
            text-white
            hover:bg-blue-600 dark:hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          "
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
