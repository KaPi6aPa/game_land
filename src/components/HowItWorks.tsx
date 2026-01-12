import { Card } from "./ui/Card";
import { FileText, Users, Key } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Заявка",
    desc: "Заполни простую форму. Мы узнаем о твоих целях и опыте."
  },
  {
    icon: Users,
    title: "Подбор формата",
    desc: "Мы свяжемся и предложим команду или соло-трек под твой уровень."
  },
  {
    icon: Key,
    title: "Доступ в клуб",
    desc: "Получи инвайт в закрытый Discord, доступ к базе знаний и эвентам."
  }
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Простой путь от соло-игры до системного развития в комьюнити.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Card key={i} className="p-6 relative border-white/5 bg-background/50 hover:border-primary/30">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">
                {i + 1}
              </div>
              <step.icon className="w-10 h-10 text-primary mb-4 opacity-80" />
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}