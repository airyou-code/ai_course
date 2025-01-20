'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface TestProps {
  content: string;
  options: string[];
  correctAnswer: number;
  feedback?: string;
  onAnswer: (isCorrect: boolean) => void;
}

export function Test({ content, options, correctAnswer, feedback, onAnswer }: TestProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleAnswerSelect = (value: string) => {
    const answerIndex = parseInt(value)
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Exercise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup onValueChange={handleAnswerSelect}>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {showFeedback && (
          <div className={`mt-4 p-4 border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {feedback || (isCorrect ? 'Correct!' : 'Incorrect. Try again.')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

