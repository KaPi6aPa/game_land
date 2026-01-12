import { Card } from "./ui/Card";
import { Users2, Target, Sword, BookOpen, TrendingUp, ShieldCheck } from "lucide-react";

const features = [
  { title: "Командная игра", desc: "Находим мейтов, с которыми комфортно и продуктивно.", icon: Users2 },
  { title: "Разборы и фидбек", desc: "Анализ ошибок от опытных игроков, а не хейт в чате.", icon: Target },
  { title: "Регулярные активности", desc: "Скримы, турниры и внутренние лиги каждую неделю.", icon: Sword },
  { title: "База знаний", desc: "Гайды, страты и настройки, проверенные временем.", icon: BookOpen },
  { title: "Прогресс и цели", desc: "Помогаем ставить цели и отслеживать рост скилла.", icon: TrendingUp },
  { title: "Здоровая среда", desc: "Жесткая модерация токсичности. Только конструктив.", icon: ShieldCheck },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Больше, чем просто Discord</h2>
          <p className="text-muted-foreground text-lg">Экосистема для твоего развития.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <Card key={i} className="p-6 bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all group">
              <feat.icon className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
              <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}