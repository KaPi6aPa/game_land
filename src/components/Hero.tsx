import { useState } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { LeadForm } from "./LeadForm";
import { ArrowRight, Trophy, Users, Zap } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="bg-radial-highlight absolute inset-0 z-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Набор открыт
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Игровой клуб, <br />
            где ты <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">реально растёшь</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Команды, разборы, скримы и комьюнити для игроков любого тайтла. 
            Без токсичности. С отбором.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => setIsModalOpen(true)} className="gap-2">
              Оставить заявку <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="ghost" onClick={() => scrollToSection('how')}>
              Как это работает
            </Button>
          </div>
          
          <div className="pt-8 flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Быстрый старт</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> 1500+ Мемберов</div>
          </div>
        </div>

        {/* Product Mock UI */}
        <div className="relative hidden lg:block">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-card border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="font-semibold">Weekly Scrims</div>
                  <div className="text-xs text-muted-foreground">Season 4 • Group A</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-400">+240 MMR</div>
                <div className="text-xs text-muted-foreground">Last 7 days</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded bg-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                    0{i}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-white/20 rounded mb-1"></div>
                    <div className="h-1.5 w-16 bg-white/10 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-primary/20 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Присоединиться">
        <LeadForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  );
}