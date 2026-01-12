export function RulesBlock() {
  return (
    <section className="py-20 bg-zinc-900/50 border-y border-white/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-12">Кодекс клуба</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-red-500 mx-auto rounded-full"></div>
            <h3 className="text-xl font-semibold">Ноль токсичности</h3>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">
              Мы баним за оскорбления, тильт в войсе и неконструктивную критику. Атмосфера — наш главный продукт.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full"></div>
            <h3 className="text-xl font-semibold">Уважение времени</h3>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">
              Приходим вовремя на праки. Если договорились играть — играем. Никаких ливов посреди катки.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-1 w-12 bg-green-500 mx-auto rounded-full"></div>
            <h3 className="text-xl font-semibold">Рост важнее эго</h3>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">
              Мы здесь, чтобы учиться. Принимаем ошибки, слушаем капитана и работаем над собой.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}