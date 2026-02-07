import { ChatContainer } from "@/components/chat/chat-container";
import { UserButton } from "@/components/auth/user-button";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between border-b px-4 h-16 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">SEACE Chat</h1>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Contrataciones Públicas
          </span>
        </div>
        <UserButton />
      </header>
      <ChatContainer />
    </div>
  );
}
