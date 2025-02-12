"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import DOMPurify from "dompurify";

interface DialogBoxProps {
  content: string
  avatar?: string
  isInput?: boolean
}

export function DialogBox({ content, avatar, isInput = false }: DialogBoxProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isInput && currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + content[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 3) // Adjust typing speed here
      return () => clearTimeout(timer)
    } else if (isInput) {
      setDisplayedText(content)
    }
  }, [currentIndex, content, isInput])

  return (
    <div className={`flex gap-4 ${isInput ? "flex-row-reverse" : "flex-row"}`}>
      {/* <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        {avatar ? (
          <img
            src={avatar || "/placeholder.svg"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-500" />
        )}
      </div> */}
      <div
        className={`max-w-[80%] rounded-lg p-4 ${isInput ? "bg-gray-200" : "bg-gray-100"}`}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(displayedText),
          }}
        ></div>
        {!isInput && currentIndex < content.length && (
          <span className="inline-block w-1 h-4 bg-gray-500 ml-1 animate-blink"></span>
        )}
      </div>
    </div>
  );
}

