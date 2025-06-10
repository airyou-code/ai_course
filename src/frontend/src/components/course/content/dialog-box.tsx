import { User, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast"; // Если у вас есть такой хук

interface DialogBoxProps {
  content: string;
  error_msg?: string;
  avatar?: string;
  isInput?: boolean;
  is_md?: boolean;
  is_error?: boolean;
  is_init?: boolean;
}

export function DialogBox({
  content,
  error_msg = "",
  avatar,
  isInput = false,
  is_md = false,
  is_error = false,
  is_init = false,
}: DialogBoxProps) {
  // Используем toast для уведомлений (если доступно)
  const { toast } = useToast?.() || { toast: undefined };

  // Функция для копирования Markdown контента
  const handleCopy = useCallback(() => {
    // Копируем оригинальный md-текст, а не отрендеренный HTML
    navigator.clipboard.writeText(content)
      .then(() => {
        // Показываем уведомление об успешном копировании
        if (toast) {
          toast({
            title: "Скопировано!",
            description: "Markdown-контент успешно скопирован в буфер обмена",
          });
        } else {
          // Если toast недоступен, используем обычное уведомление
          alert("Скопировано!");
        }
      })
      .catch((error) => {
        console.error("Ошибка при копировании:", error);
        if (toast) {
          toast({
            variant: "destructive",
            title: "Ошибка копирования",
            description: "Не удалось скопировать содержимое",
          });
        } else {
          alert("Не удалось скопировать содержимое");
        }
      });
  }, [content, toast]);

  // Определяем класс контейнера (лево/право)
  const containerClass = isInput
    ? "flex gap-4 flex-row-reverse"
    : "flex gap-4 flex-row"

  // Добавим общий padding и фон для блока сообщения
  const messageClass = isInput
    ? "max-w-[80%] rounded-lg bg-muted/50 p-6"
    : "max-w-[100%] rounded-lg bg-muted/50 p-6"

  if (is_init) {
    return (
      <div className={containerClass}>
        <div className={messageClass + " italic text-gray-500 dark:text-gray-400"}>
          Processing...
        </div>
      </div>
    )
  }

  if (is_error) {
    return (
      <div className={containerClass}>
        <div className={messageClass + " text-red-600 dark:text-red-400"}>
          {content ? (
            <>
              {is_md ? (
                // Оборачиваем Markdown в контейнер с увеличенными отступами
                <div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight, rehypeKatex]}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(content),
                  }}
                ></div>
              )}
              <div className="mt-4 font-semibold">{error_msg}</div>
            </>
          ) : (
            <div>{error_msg}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={containerClass}>
        {isInput && (
          <div className="w-10 h-10 rounded-full bg-gray-200 bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
            <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          </div>
        )}
        <div className={messageClass}>
          <div className="prose dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight, rehypeKatex]}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      {!isInput && (
        <div className="flex items-center gap-2 px-1 mt-3">
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleCopy}
            title="Копировать Markdown"
          >
            <Copy className="h-4 w-4" />
          </button>
          {/* <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsDown className="h-4 w-4" />
          </button> */}
        </div>
      )}
    </div>
  );
}
