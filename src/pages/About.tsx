import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-3xl animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">О клубе</h1>
      <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-lg text-muted-foreground">
        <p>
          CLUB//PLAY — это ответ на хаос в матчмейкинге. Мы создали пространство, где игроки объединяются не только ради побед, но и ради качественного процесса игры.
        </p>
        <p>
          Наша миссия — уничтожить токсичность и дать инструменты для роста тем, кто хочет развиваться, а не просто "катать под пиво" (хотя отдых мы тоже уважаем, но в отдельное время).
        </p>
        <h3 className="text-foreground font-semibold text-xl pt-4">Для кого это?</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Для тех, кто устал от рандомов.</li>
          <li>Для тех, кто хочет играть в команде с голосовой связью.</li>
          <li>Для новичков, ищущих менторов.</li>
        </ul>
        <h3 className="text-foreground font-semibold text-xl pt-4">Как проходит отбор?</h3>
        <p>
          Мы не смотрим на твой K/D. Мы смотрим на адекватность. После заявки мы общаемся лично, чтобы убедиться, что ты разделяешь наши ценности.
        </p>
      </div>
      <div className="mt-12">
        <Link to="/">
          <Button variant="secondary">На главную</Button>
        </Link>
      </div>
    </div>
  );
}