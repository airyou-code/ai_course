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

  return (
    <div className={`flex gap-4 ${isInput ? "flex-row-reverse" : "flex-row"}`}>
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
        {avatar ? (
          <img
            src={avatar || "/placeholder.svg"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-gray-500" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${isInput ? "bg-gray-200" : "bg-gray-100"}`}
      >
        {is_md ? ( 
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(content),
            }}
          ></div>
        )
      }
      </div>
    </div>
  );
}

