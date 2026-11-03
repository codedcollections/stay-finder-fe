import Link from "next/link";
import {
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";


export default function NotFound() {
  return (
    <main className="mx-auto">
        <div>
    
            <WrenchScrewdriverIcon className="h-30 w-30" />
        </div>
        
      <h1>404 – Boendet kunde inte hittas</h1>

      <p>
        Vi kunde tyvärr inte hitta boendet du letar efter.
        Det kan ha tagits bort eller så är länken felaktig.
      </p>

      <Link href="/" className="text-blue-600 hover:text-purple-600 transition-colors duration-200 underline">
        Tillbaka till startsidan
      </Link>
    </main>
  );
}