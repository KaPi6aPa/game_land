import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
  const [error, setError] = React.useState<string | null>(null);

  const [tsToken, setTsToken] = React.useState<string>("");
  const tsHostRef = React.useRef<HTMLDivElement | null>(null);
  const tsWidgetIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function mountTurnstile() {
      if (!TURNSTILE_SITE_KEY) {
        setError("Turnstile site key is missing (VITE_TURNSTILE_SITE_KEY).");
        return;
      }
      if (!tsHostRef.current) return;

      try {
        await loadTurnstileScript();
        if (cancelled) return;
        if (!window.turnstile) throw new Error("Turnstile not available");

        // If widget already exists, remove it
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
          "error-callback": () => setError("Bot protection failed. Try again."),
          "expired-callback": () => setTsToken(""),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Turnstile failed to load");
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
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Honeypot
    if (data.company) {
      navigate("/thanks");
      return;
    }

    // Turnstile required
    if (!tsToken) {
      setIsLoading(false);
      setError("Подтверди, что ты не бот (Turnstile).");
      return;
    }

    const payload = {
      ...data,
      turnstileToken: tsToken,
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let result: any = null;
      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        // server returned non-JSON
      }

      if (!response.ok) {
        throw new Error(result?.error || raw || "Something went wrong");
      }

      if (onSuccess) onSuccess();
      navigate("/thanks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Try again.");
      // Reset turnstile token after failure
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
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Имя
          </label>
          <Input id="name" name="name" placeholder="Как к вам обращаться" required minLength={2} />
        </div>

        <div className="space-y-2">
          <label htmlFor="contact" className="text-sm font-medium leading-none">
            Контакты
          </label>
          <Input id="contact" name="contact" placeholder="Telegram / Discord / Email" required minLength={3} />
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="text-sm font-medium leading-none">
            Цель
          </label>
          <Select id="reason" name="reason" required defaultValue="">
            <option value="" disabled>
              Выберите вариант
            </option>
            <option value="Доступ в клуб">Доступ в клуб</option>
            <option value="Командный формат">Командный формат</option>
            <option value="Партнёрство">Партнёрство</option>
            <option value="Другое">Другое</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium leading-none">
            Сообщение (необязательно)
          </label>
          <Textarea id="message" name="message" placeholder="Пару слов о себе или вопросы..." />
        </div>

        {/* Turnstile */}
        <div className="space-y-2">
          <div
            ref={tsHostRef}
            className="min-h-[65px] rounded-xl border border-white/10 bg-white/5 p-3"
          />
          <p className="text-xs text-white/60">
            Защита от спама (Turnstile).
          </p>
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
