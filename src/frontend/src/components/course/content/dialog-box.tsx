import { User } from "lucide-react"
import DOMPurify from "dompurify"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

interface DialogBoxProps {
  content: string
  error_msg?: string
  avatar?: string
  isInput?: boolean
  is_md?: boolean
  is_error?: boolean
  is_init?: boolean
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
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
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
    <div className={containerClass}>
      {isInput && (
        <div className="w-10 h-10 rounded-full bg-gray-200 bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
          <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
        </div>
      )}
      <div className={messageClass}>
          <div className="prose dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
      </div>
    </div>
  )
}
