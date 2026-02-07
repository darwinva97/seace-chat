"use client";

import type { Message } from "ai";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { ContractList } from "./contract-list";
import { ContractDetail } from "./contract-detail";
import ReactMarkdown from "react-markdown";

function ToolResult({
  toolName,
  result,
  onViewDetail,
}: {
  toolName: string;
  result: unknown;
  onViewDetail?: (id: number) => void;
}) {
  if (toolName === "searchContracts" && result && typeof result === "object") {
    const data = result as {
      contracts: Array<{
        id: number;
        numero: string;
        tipo: string;
        descripcion: string;
        entidad: string;
        estado: string;
        fechaPublicacion: string;
        inicioCotizacion: string;
        finCotizacion: string;
        puedesCotizar: boolean;
      }>;
      pagination: { page: number; pageSize: number; total: number };
    };
    return (
      <ContractList
        contracts={data.contracts}
        pagination={data.pagination}
        onViewDetail={onViewDetail}
      />
    );
  }

  if (
    toolName === "getContractDetail" &&
    result &&
    typeof result === "object"
  ) {
    return <ContractDetail detail={result as never} />;
  }

  if (
    (toolName === "listDepartments" ||
      toolName === "listContractTypes" ||
      toolName === "listContractStates") &&
    Array.isArray(result)
  ) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {(result as Array<{ id: number; nombre: string }>).map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs"
          >
            {item.nombre}
          </span>
        ))}
      </div>
    );
  }

  return null;
}

export function MessageBubble({
  message,
  onViewDetail,
}: {
  message: Message;
  onViewDetail?: (id: number) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="shrink-0 mt-1">
        <AvatarFallback
          className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}
        >
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={`flex flex-col gap-2 max-w-[85%] ${isUser ? "items-end" : ""}`}
      >
        {message.content && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm ${
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted rounded-tl-sm"
            }`}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-1">{children}</ol>
                ),
                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {message.toolInvocations?.map((invocation) => {
          if (invocation.state === "result") {
            return (
              <div key={invocation.toolCallId} className="w-full">
                <ToolResult
                  toolName={invocation.toolName}
                  result={invocation.result}
                  onViewDetail={onViewDetail}
                />
              </div>
            );
          }
          if (invocation.state === "call") {
            return (
              <div
                key={invocation.toolCallId}
                className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse"
              >
                <div className="size-2 rounded-full bg-primary animate-bounce" />
                Buscando en SEACE...
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
