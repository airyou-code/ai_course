import { useState, useEffect } from "react"
import { DialogBox } from "./content/dialog-box"
import { ChatInput } from "./content/chat-input"
import { Test } from "./content/test"
import { ContinueButton } from "./content/continue-button"
import { NextLessonButton } from "./content/next-lesson-button"
import DOMPurify from 'dompurify';


type ContentBlockType = 
  | 'output-dialog'
  | 'input-dialog'
  | 'text'
  | 'input-field'
  | 'test'
  | 'continue-button'
  | 'next-lesson-button';

interface ContentBlock {
  type: ContentBlockType;
  content: string;
  avatar?: string;
  options?: string[];
  correctAnswer?: number;
  feedback?: string;
  nextLessonUrl?: string;
}

interface CourseData {
  blocks: ContentBlock[];
}

interface CoursePageProps {
  data: CourseData
}

export default function CoursePage({ data }: CoursePageProps) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [visibleBlocks, setVisibleBlocks] = useState<ContentBlock[]>([])
  const [userInput, setUserInput] = useState("")

  useEffect(() => {
    if (data.blocks.length > 0 && currentBlockIndex === 0) {
      const firstBlock = data.blocks[0]
      if (firstBlock.type === "output-dialog" || firstBlock.type === "input-dialog" || firstBlock.type === "text") {
        showNextBlock()
      }
    }
  }, []) // Only run once on mount

  const showNextBlock = () => {
    if (currentBlockIndex < data.blocks.length) {
      setVisibleBlocks((prev) => [...prev, data.blocks[currentBlockIndex]])
      setCurrentBlockIndex((prev) => prev + 1)
    }
  }

  const handleUserInput = (message: string) => {
    setUserInput(message)
    showNextBlock()
  }

  const handleTestAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      showNextBlock()
    }
  }

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "output-dialog":
      case "input-dialog":
        return (
          <DialogBox
            key={index}
            content={block.content}
            avatar={block.avatar}
            isInput={block.type === "input-dialog"}
          />
        )
      case "text":
        return (
          <div key={index} className="py-4 px-2">
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content) }}
            ></p>
          </div>
        )
      case "input-field":
        return (
          <div key={index} className="py-4">
            <ChatInput onSubmit={handleUserInput} placeholder={block.content} />
          </div>
        )
      case "test":
        return (
          <Test
            key={index}
            content={block.content}
            options={block.options || []}
            correctAnswer={block.correctAnswer || 0}
            feedback={block.feedback}
            onAnswer={handleTestAnswer}
          />
        )
      case "continue-button":
        return <ContinueButton key={index} onClick={showNextBlock} />
      case "next-lesson-button":
        return block.nextLessonUrl ? (
          <NextLessonButton
            key={index}
            onClick={() => (window.location.href = block.nextLessonUrl!)}
            url={block.nextLessonUrl}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="space-y-6">{visibleBlocks.map((block, index) => renderBlock(block, index))}</div>
      {currentBlockIndex < data.blocks.length && <ContinueButton onClick={showNextBlock} />}
    </div>
  )
}

