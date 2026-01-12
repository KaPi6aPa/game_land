import { LeadForm } from "./LeadForm";

export function FinalCTA() {
  return (
    <section id="apply" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 skew-y-3 transform origin-bottom-left pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Готов выйти на <br/>новый уровень?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Заполни заявку сейчас. Это ни к чему не обязывает, но может изменить твой игровой опыт навсегда.
            </p>
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Отвечаем в течение 24 часов
            </div>
          </div>
          
          <div className="bg-card border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-semibold mb-6">Оставить заявку</h3>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}