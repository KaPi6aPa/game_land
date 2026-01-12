import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const faqs = [
  { q: "Нужно ли быть про-игроком?", a: "Нет. Мы принимаем игроков любого уровня, главное — желание расти и адекватность. Мы подберем пати под твой ранг." },
  { q: "Подходит ли под мою игру?", a: "Сейчас мы фокусируемся на популярных соревновательных дисциплинах (CS2, Dota 2, Valorant), но комьюнити открыто для всех." },
  { q: "Сколько времени нужно?", a: "Зависит от формата. В Core составе — 2-3 прака в неделю. В Starter — играешь когда удобно." },
  { q: "Как устроена модерация?", a: "Жестко. Система репортов и активные админы. Токсичность пресекается мгновенно." },
  { q: "Это платно?", a: "Базовый доступ бесплатен. Продвинутые форматы (тренеры, закрытые лиги) могут требовать подписки для поддержки серверов." },
  { q: "Как проходит отбор?", a: "Ты оставляешь заявку, мы проводим короткое интервью в Discord, чтобы убедиться, что мы подходим друг другу по вайбу." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-12 text-center">Частые вопросы</h2>
      <div className="space-y-4">
        {faqs.map((item, i) => (
          <div key={i} className="border border-white/5 rounded-lg overflow-hidden bg-white/[0.02]">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex items-center justify-between w-full p-4 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-medium pr-8">{item.q}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", openIndex === i ? "rotate-180" : "")} />
            </button>
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="p-4 pt-0 text-muted-foreground text-sm leading-relaxed">
                {item.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}