import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { exhibits } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ExhibitFallbackPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const exhibit = exhibits.find((e) => e.slug === resolvedParams.slug);

  if (!exhibit) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-neutral-900 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <Clock className="w-8 h-8 text-neutral-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white">{exhibit.title}</h1>
        <div className="space-y-2">
          <p className="text-neutral-400">
            The <span className="text-white font-mono">{exhibit.algorithm}</span> exhibit is currently under construction.
          </p>
          <p className="text-neutral-500 text-sm">
            Our curators are working hard to bring this experience to you soon.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Museum Lobby
          </Link>
        </div>
      </div>
    </main>
  );
}
