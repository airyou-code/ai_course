"use client"

import { useState } from "react"

interface TestProps {
  content: string
  options: string[]
  correctAnswer: number
  feedback?: string
  onAnswer: (isCorrect: boolean) => void
}

export function Test({ content, options, correctAnswer, feedback, onAnswer }: TestProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const correct = answerIndex === correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold">Exercise</h3>
      </div>
      <div className="p-4 space-y-4">
        <p>{content}</p>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={() => handleAnswerSelect(index)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <label htmlFor={`option-${index}`} className="text-sm">
                {option}
              </label>
            </div>
          ))}
        </div>
        {showFeedback && (
          <div
            className={`mt-4 p-4 border-l-4 ${isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
          >
            {feedback || (isCorrect ? "Correct!" : "Incorrect. Try again.")}
          </div>
        )}
      </div>
    </div>
  )
}

