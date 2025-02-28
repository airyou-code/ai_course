"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import DOMPurify from "dompurify";
import ReactMarkdown from 'react-markdown';

interface DialogBoxProps {
  content: string
  avatar?: string
  isInput?: boolean
  is_md?: boolean
}

export function DialogBox({ content, avatar, isInput = false, is_md = false }: DialogBoxProps) {

  // Базовые классы
  const containerClass = isInput
    ? "flex gap-4 flex-row-reverse"
    : "flex gap-4 flex-row"

  // Базовые классы для блока сообщения
  // Добавляем dark: классы для тёмной темы
  const messageClass = isInput
    ? "max-w-[80%] rounded-lg p-4 bg-muted/50"
    : "max-w-[100%] rounded-lg p-4 bg-muted/50"

  return (
    <div className={containerClass}>
      {isInput ? (
        <div className="w-10 h-10 rounded-full bg-gray-200 bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
          <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
        </div>
      ) : null}

      <div className={messageClass}>
        {is_md ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div
            id="dangerouslySetInnerHTML"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content),
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

