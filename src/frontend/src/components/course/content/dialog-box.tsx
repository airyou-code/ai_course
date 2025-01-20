import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface DialogBoxProps {
  content: string;
  avatar?: string;
  isInput?: boolean;
}

export function DialogBox({ content, avatar, isInput = false }: DialogBoxProps) {
  return (
    <div className={`flex gap-4 ${isInput ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar || "/placeholder.svg"} />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <Card className={`max-w-[80%] ${isInput ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <CardContent className="p-4">
          <p className="whitespace-pre-wrap">{content}</p>
        </CardContent>
      </Card>
    </div>
  )
}

