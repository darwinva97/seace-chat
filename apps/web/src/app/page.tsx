import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">SEACE Chat</h1>
        <p className="text-muted-foreground text-lg">
          Busca contrataciones públicas del estado peruano con IA
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Iniciar Chat
        </Link>
      </div>
    </div>
  );
}
