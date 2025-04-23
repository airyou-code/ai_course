"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import DOMPurify from "dompurify";
import ReactMarkdown from 'react-markdown';

interface DialogBoxProps {
  content: string
  error_msg?: string
  avatar?: string
  isInput?: boolean
  is_md?: boolean
  is_error?: boolean
  is_init?: boolean
}

export function DialogBox({ content, error_msg = "", avatar, isInput = false, is_md = false, is_error = false, is_init = false }: DialogBoxProps) {

  // Базовые классы
  const containerClass = isInput
    ? "flex gap-4 flex-row-reverse"
    : "flex gap-4 flex-row"

  // Базовые классы для блока сообщения
  // Добавляем dark: классы для тёмной темы
  const messageClass = isInput
    ? "max-w-[80%] rounded-lg p-4 bg-muted/50"
    : "max-w-[100%] rounded-lg p-4 bg-muted/50"

  // Если инициализация: показываем индикатор загрузки
  if (is_init) {
    return (
      <div className={containerClass}>
        <div className={messageClass + " italic text-gray-500 dark:text-gray-400"}>
          Processing...
        </div>
      </div>
    )
  }

  // Если ошибка
  if (is_error) {
    return (
      <div className={containerClass}>
        <div className={messageClass + " text-red-600 dark:text-red-400"}>
          {/* Два кейса: если есть контент, отображаем его с сообщением об ошибке; если нет — только ошибку */}
          {content ? (
            <>
              {is_md ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <div
                  id="dangerouslySetInnerHTML"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                ></div>
              )}
              <div className="mt-2 font-semibold">
                {error_msg}
              </div>
            </>
          ) : (
            <div>
              {error_msg}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Обычный режим отображения
  return (
    <div className={containerClass}>
      {isInput && (
        <div className="w-10 h-10 rounded-full bg-gray-200 bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
          <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
        </div>
      )}

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
