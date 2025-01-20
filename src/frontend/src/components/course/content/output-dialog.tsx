'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface OutputDialogProps {
  content: string;
  avatar?: string;
}

export function OutputDialog({ content, avatar }: OutputDialogProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + content[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 30) // Adjust typing speed here
      return () => clearTimeout(timer)
    }
  }, [currentIndex, content])

  return (
    <div className="flex gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar || "/placeholder.svg"} />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <Card className="max-w-[80%] bg-muted">
        <CardContent className="p-4">
          <p className="whitespace-pre-wrap">{displayedText}</p>
        </CardContent>
      </Card>
    </div>
  )
}

