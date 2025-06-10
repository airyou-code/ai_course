import React, { createContext, useState, useContext } from "react"

interface StreamStatusContextValue {
  isStreaming: boolean
  setIsStreaming: (isStreaming: boolean) => void
}

export const StreamStatusContext = createContext<StreamStatusContextValue | null>(null)

export const StreamStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  return (
    <StreamStatusContext.Provider value={{ isStreaming, setIsStreaming }}>
      {children}
    </StreamStatusContext.Provider>
  )
}

export const useStreamStatus = () => {
  const context = useContext(StreamStatusContext)
  if (!context) {
    throw new Error("useStreamStatus must be used within a StreamStatusProvider")
  }
  return context
}