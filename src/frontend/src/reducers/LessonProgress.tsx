import React, { createContext, useState, useContext } from "react"

interface LessonProgressContextValue {
  progress: number
  setProgress: (progress: number) => void
}

export const LessonProgressContext = createContext<LessonProgressContextValue | null>(null)

export const LessonProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<number>(0)
  return (
    <LessonProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </LessonProgressContext.Provider>
  )
}

export const useLessonProgress = () => {
  const context = useContext(LessonProgressContext)
  if (!context) {
    throw new Error("useLessonProgress must be used within a LessonProgressProvider")
  }
  return context
}