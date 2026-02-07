"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";

const SUGGESTIONS = [
  "Busca contrataciones de servicios vigentes en Lima",
  "Muestra las últimas contrataciones de bienes en Cusco",
  "Busca contratos de consultoría de obra este año",
  "¿Qué departamentos están disponibles para filtrar?",
];

export function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } =
    useChat({
      api: "/api/chat",
      maxSteps: 5,
    });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleViewDetail(id: number) {
    append({
      role: "user",
      content: `Dame el detalle completo de la contratación con ID ${id}`,
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4 pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">SEACE Chat</h2>
                <p className="text-muted-foreground">
                  Pregunta sobre contrataciones públicas del estado peruano
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() =>
                      append({ role: "user", content: suggestion })
                    }
                    className="rounded-xl border px-4 py-3 text-left text-sm hover:bg-accent transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onViewDetail={handleViewDetail}
            />
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Pensando...
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-center gap-2"
        >
          {messages.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMessages([])}
              title="Limpiar chat"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
          <div className="relative flex-1">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Busca contrataciones, por ejemplo: 'servicios en Lima'..."
              className="w-full rounded-xl border bg-background px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 rounded-lg"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
