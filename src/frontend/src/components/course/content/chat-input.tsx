import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Plus,
  Lightbulb,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

/**
 * Props for ChatInput
 */
interface ChatInputProps {
  onSubmit: (message: string) => void;
  isStreaming?: boolean;
  placeholder?: string;
}

/**
 * ChatInput renders an input area with multiple action buttons and
 * handles dynamic resizing, keyboard shortcuts, and focus management.
 */
export function ChatInput({
  onSubmit,
  isStreaming = false,
}: ChatInputProps) {
  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [activeButton, setActiveButton] = useState<"none" | "add" | "deepSearch" | "think">("none");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const selectionStateRef = useRef<{ start: number | null; end: number | null }>({ start: null, end: null });

  // Сохранение и восстановление курсора
  const saveSelectionState = () => {
    const ta = textareaRef.current;
    if (ta) {
      selectionStateRef.current = { start: ta.selectionStart, end: ta.selectionEnd };
    }
  };

  const restoreSelectionState = () => {
    const ta = textareaRef.current;
    const { start, end } = selectionStateRef.current;
    if (ta && start !== null && end !== null) {
      ta.focus();
      ta.setSelectionRange(start, end);
    } else if (ta) {
      ta.focus();
    }
  };

  const toggleButton = (button: "add" | "deepSearch" | "think") => {
    if (!isStreaming) {
      saveSelectionState();
      setActiveButton(prev => (prev === button ? "none" : button));
      setTimeout(restoreSelectionState, 0);
    }
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (!isStreaming) {
      setMessage(value);
      setHasTyped(value.trim() !== "");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  };

  const submitMessage = () => {
    const text = message.trim();
    if (text && !isStreaming) {
      navigator.vibrate?.(50);
      onSubmit(text);
      setMessage("");
      setHasTyped(false);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      navigator.vibrate?.(50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isStreaming && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
    if (!isStreaming && e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        ref={inputContainerRef}
        className={cn(
          "relative w-full rounded-3xl border border-gray-200 dark:border-gray-700  p-3 cursor-text",
          isStreaming && "opacity-80"
        )}
        onClick={handleContainerClick}
      >
        <div className="pb-9">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? t("chat.waitingForResponse") : t("chat.askAnything")}
            className="min-h-[24px] max-h-[160px] w-full rounded-3xl border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-4 pt-0 pb-0 resize-none overflow-y-auto leading-tight"
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-3xl">
                o4-mini
              </div>
            </div>

            <Button
              type="submit"
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8 border-0 flex-shrink-0 transition-all duration-200",
                hasTyped ? "bg-black scale-110" : "bg-gray-200 dark:bg-gray-800"
              )}
              disabled={!hasTyped || isStreaming}
            >
              <ArrowUp className={cn("h-4 w-4 transition-colors", hasTyped ? "text-white" : "text-gray-500 dark:text-gray-300")} />
              <span className="sr-only">Submit</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
