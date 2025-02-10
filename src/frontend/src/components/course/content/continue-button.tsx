import { Button } from "@/components/ui/button"

interface ContinueButtonProps {
  content?: string;
  onClick: () => void;
}

export function ContinueButton({ content = "Continue", onClick }: ContinueButtonProps) {
  return (
    <Button onClick={onClick} variant="link">{content}</Button>
  );
};
