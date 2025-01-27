import { useState, useEffect, useRef } from "react"
import { DialogBox } from "./content/dialog-box"
import { ChatInput } from "./content/chat-input"
import { Test } from "./content/test"
import { ContinueButton } from "./content/continue-button"
import { NextLessonButton } from "./content/next-lesson-button"
import { useFetchLessonData } from "../../hooks/courses"
import DOMPurify from 'dompurify';

type ContentBlockType = 
  | 'output_dialog'
  | 'input_dialog'
  | 'text'
  | 'input_field'
  | 'test'
  | 'button_continue'
  | 'button_next';

interface TestContent {
  question: string;
  options: string[];
  correctAnswer: number;
  right_feedback: string;
  wrong_feedback: string;
}

interface ContentBlock {
  type: ContentBlockType;
  content: string | TestContent;
  avatar?: string;
  nextLessonUrl?: string;
}

interface CourseData {
  blocks: ContentBlock[];
}

export default function CoursePage() {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [visibleBlocks, setVisibleBlocks] = useState<ContentBlock[]>([])
  const [userInput, setUserInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: fetchedData, isLoading, isError } = useFetchLessonData();

  useEffect(() => {
    if (fetchedData && fetchedData.blocks && fetchedData.blocks.length > 0 && currentBlockIndex === 0) {
      showNextBlocks(fetchedData.blocks)
    }
  }, [fetchedData]) // Run when fetchedData changes

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleBlocks])

  const showNextBlocks = (blocks: ContentBlock[]) => {
    let index = currentBlockIndex
    while (index < blocks.length) {
      const block = blocks[index]
      setVisibleBlocks((prev) => [...prev, block])
      index++
      if (block.type === 'button_continue') {
        break
      }
    }
    setCurrentBlockIndex(index)
  }

  const handleUserInput = (message: string) => {
    setUserInput(message)
    if (fetchedData && fetchedData.blocks) {
      showNextBlocks(fetchedData.blocks)
    }
  }

  const handleTestAnswer = (isCorrect: boolean) => {
    if (isCorrect && fetchedData && fetchedData.blocks) {
      showNextBlocks(fetchedData.blocks)
    }
  }

  const renderBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "output_dialog":
      case "input_dialog":
        return (
          <DialogBox
            key={index}
            content={block.content as string}
            avatar={block.avatar}
            isInput={block.type === "input_dialog"}
          />
        )
      case "text":
        return (
          <div key={index} className="py-4 px-2">
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content as string) }}
            ></p>
          </div>
        )
      case "input_field":
        return (
          <div key={index} className="py-4">
            <ChatInput onSubmit={handleUserInput} placeholder={block.content as string} />
          </div>
        )
      case "test":
        const testContent = block.content as TestContent;
        return (
          <Test
            key={index}
            content={testContent.question}
            options={testContent.options}
            correctAnswer={testContent.correctAnswer}
            rightFeedback={testContent.right_feedback}
            wrongFeedback={testContent.wrong_feedback}
            onAnswer={handleTestAnswer}
          />
        )
      case "button_continue":
        return <ContinueButton key={index} onClick={() => {
          setVisibleBlocks((prev) => prev.filter((_, i) => i !== index))
          if (fetchedData && fetchedData.blocks) {
            showNextBlocks(fetchedData.blocks)
          }
        }} />
      case "button_next":
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading data</div>
  }

  return (
    <main className="flex-1 ml-64 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-10">
        <div ref={containerRef} className="max-w-3xl mx-auto p-4 space-y-6" style={{ maxHeight: '80vh' }}>
          <div className="space-y-6 pb-10">{visibleBlocks.map((block, index) => renderBlock(block, index))}</div>
        </div>
      </div>
    </main>
  )
}

