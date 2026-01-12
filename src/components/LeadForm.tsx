import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface LeadFormProps {
  onSuccess?: () => void;
  className?: string;
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();

    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed")));
      return;
    }

    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.dataset.turnstile = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile script failed"));
    document.head.appendChild(s);
  });
}

export function LeadForm({ onSuccess, className }: LeadFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [tsToken, setTsToken] = React.useState<string>("");
  const tsHostRef = React.useRef<HTMLDivElement | null>(null);
  const tsWidgetIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function mountTurnstile() {
      if (!TURNSTILE_SITE_KEY) {
        setError("Bot protection misconfigured.");
        return;
      }
      if (!tsHostRef.current) return;

      try {
        await loadTurnstileScript();
        if (cancelled || !window.turnstile) return;

        if (tsWidgetIdRef.current) {
          try {
            window.turnstile.remove(tsWidgetIdRef.current);
          } catch {}
          tsWidgetIdRef.current = null;
        }

        setTsToken("");
        tsWidgetIdRef.current = window.turnstile.render(tsHostRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "auto",
          callback: (token: string) => setTsToken(token),
          "error-callback": () => setError("Bot protection failed."),
          "expired-callback": () => setTsToken(""),
        });
      } catch {
        setError("Bot protection failed to load.");
      }
    }

    mountTurnstile();
    return () => {
      cancelled = true;
      if (tsWidgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(tsWidgetIdRef.current);
        } catch {}
      }
      tsWidgetIdRef.current = null;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Honeypot
    if (data.company) {
      navigate("/thanks");
      return;
    }

    if (!tsToken) {
      setIsLoading(false);
      setError("Подтверди, что ты не бот.");
      return;
    }

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken: tsToken }),
      });

      const raw = await response.text();
      let result: any = null;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!response.ok) {
        throw new Error(result?.error || "Submit failed");
      }

      // success micro-state
      setIsSuccess(true);
      onSuccess?.();

      // small delay for UX, then redirect
      setTimeout(() => {
        navigate("/thanks");
      }, 200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit.");
      setTsToken("");
      if (window.turnstile && tsWidgetIdRef.current) {
        try {
          window.turnstile.reset(tsWidgetIdRef.current);
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <fieldset disabled={isLoading || isSuccess} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Имя</label>
          <Input name="name" placeholder="Как к вам обращаться" required minLength={2} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Контакты</label>
          <Input name="contact" placeholder="Telegram / Discord / Email" required minLength={3} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Цель</label>
          <Select name="reason" required defaultValue="">
            <option value="" disabled>Выберите вариант</option>
            <option value="Доступ в клуб">Доступ в клуб</option>
            <option value="Командный формат">Командный формат</option>
            <option value="Партнёрство">Партнёрство</option>
            <option value="Другое">Другое</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Сообщение (необязательно)</label>
          <Textarea name="message" placeholder="Пару слов о себе или вопросы..." />
        </div>

        {/* Turnstile */}
        <div ref={tsHostRef} className="min-h-[65px] rounded-xl border border-white/10 bg-white/5 p-3" />

        {/* Honeypot */}
        <div className="hidden" aria-hidden>
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 p-2 rounded-md">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full">
          {isSuccess ? (
            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4" /> Готово
            </span>
          ) : isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Отправка…
            </span>
          ) : (
            "Отправить заявку"
          )}
        </Button>
      </fieldset>
    </form>
  );
}
