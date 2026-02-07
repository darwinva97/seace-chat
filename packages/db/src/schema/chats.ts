import { pgTable, text, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { user } from "./users";

export const chat = pgTable("chat", {
  id: text("id").primaryKey(),
  title: text("title"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const message = pgTable("message", {
  id: serial("id").primaryKey(),
  chatId: text("chat_id").notNull().references(() => chat.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "system", "tool"] }).notNull(),
  content: text("content").notNull(),
  toolInvocations: jsonb("tool_invocations"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
