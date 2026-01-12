import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Check, Loader2 } from "lucide-react";
import { Modal } from "./ui/Modal";
import { LeadForm } from "./LeadForm";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    features: ["Доступ к LFG каналам", "Базовые гайды", "Участие в паблик-эвентах"],
    cta: "Попробовать"
  },
  {
    name: "Core",
    price: "Community",
    features: ["Закрытые скримы", "Разборы реплеев (раз в месяц)", "Приоритетный слот в пати"],
    cta: "Подать заявку",
    highlight: true
  },
  {
    name: "Pro",
    price: "Team",
    features: ["Личный ментор", "Командный менеджмент", "Аналитика прогресса"],
    cta: "Узнать условия"
  }
];

export function PricingTeaser() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Выбери свой путь</h2>
          <p className="text-muted-foreground">Доступные форматы участия в клубе.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <Card key={i} className={`p-8 flex flex-col ${tier.highlight ? 'border-primary/50 bg-primary/5' : 'border-white/10'}`}>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold">{tier.price}</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant={tier.highlight ? "primary" : "secondary"} 
                className="w-full"
                onClick={() => setIsModalOpen(true)}
              >
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Оставить заявку">
        <LeadForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
}