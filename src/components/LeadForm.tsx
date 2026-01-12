import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface LeadFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function LeadForm({ onSuccess, className }: LeadFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Honeypot check
    if (data.company) {
      navigate("/thanks");
      return;
    }

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      if (onSuccess) onSuccess();
      navigate("/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Имя</label>
          <Input id="name" name="name" placeholder="Как к вам обращаться" required minLength={2} />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="contact" className="text-sm font-medium leading-none">Контакты</label>
          <Input id="contact" name="contact" placeholder="Telegram / Discord / Email" required minLength={3} />
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="text-sm font-medium leading-none">Цель</label>
          <Select id="reason" name="reason" required>
            <option value="" disabled selected>Выберите вариант</option>
            <option value="Доступ в клуб">Доступ в клуб</option>
            <option value="Командный формат">Командный формат</option>
            <option value="Партнёрство">Партнёрство</option>
            <option value="Другое">Другое</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium leading-none">Сообщение (необязательно)</label>
          <Textarea id="message" name="message" placeholder="Пару слов о себе или вопросы..." />
        </div>

        {/* Honeypot field - hidden */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-2 rounded-md">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Отправка..." : "Отправить заявку"}
        </Button>
      </div>
    </form>
  );
}