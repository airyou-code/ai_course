import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface InputDialogProps {
  content: string;
  avatar?: string;
}

export function InputDialog({ content, avatar }: InputDialogProps) {
  return (
    <div className="flex flex-row-reverse gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar || "/placeholder.svg"} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <Card className="max-w-[80%] bg-primary">
        <CardContent className="p-4">
          <p className="whitespace-pre-wrap text-primary-foreground">{content}</p>
        </CardContent>
      </Card>
    </div>
  )
}

