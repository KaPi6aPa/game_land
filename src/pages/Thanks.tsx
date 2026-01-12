import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function Thanks() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Заявка отправлена</h1>
        <p className="text-muted-foreground mb-8">
          Спасибо за интерес к клубу. Мы рассмотрим твою анкету и свяжемся по указанным контактам в течение 24 часов.
        </p>
        <Link to="/">
          <Button size="lg" className="w-full sm:w-auto">
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
}