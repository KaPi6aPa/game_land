import { Card } from "./ui/Card";

export function SocialProof() {
  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
          <div>
            <div className="text-4xl font-bold text-white mb-1">Еженедельно</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Наборы</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">Гибкие</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Форматы</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1">Строгая</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest">Модерация</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-transparent border-white/10">
            <p className="text-lg text-zinc-300 italic mb-4">"Наконец-то нашел место, где можно играть серьезно, но без нервов. Команда подобралась идеально."</p>
            <div className="text-sm text-muted-foreground">— Участник закрытой группы (CS2)</div>
          </Card>
          <Card className="p-6 bg-transparent border-white/10">
            <p className="text-lg text-zinc-300 italic mb-4">"Система разборов игр помогла мне апнуть рейтинг за месяц, хотя я стоял на месте полгода."</p>
            <div className="text-sm text-muted-foreground">— Участник ментор-программы (Dota 2)</div>
          </Card>
        </div>
      </div>
    </section>
  );
}