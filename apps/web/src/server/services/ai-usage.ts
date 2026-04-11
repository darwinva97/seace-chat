import crypto from "crypto";
import { db, eq } from "@repo/db";
import { aiUsageEvent, aiUsageQuota } from "@repo/db/schema";

function getDefaultMonthlyCredits() {
  const configured = Number(process.env.AI_MONTHLY_CREDIT_LIMIT);
  if (Number.isFinite(configured) && configured > 0) {
    return configured;
  }

  return 100;
}

function getNextResetDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
}

export async function consumeAiCredit(params: {
  userId: string;
  endpoint: string;
  model?: string;
  metadata?: Record<string, unknown>;
  credits?: number;
}) {
  const credits = params.credits ?? 1;

  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(aiUsageQuota)
      .where(eq(aiUsageQuota.userId, params.userId))
      .limit(1);

    let quota = existing;
    const defaultLimit = getDefaultMonthlyCredits();
    const now = new Date();

    if (!quota) {
      const [created] = await tx
        .insert(aiUsageQuota)
        .values({
          userId: params.userId,
          monthlyCreditLimit: defaultLimit,
          creditsUsed: 0,
          resetAt: getNextResetDate(),
        })
        .returning();
      quota = created;
    } else if (quota.resetAt.getTime() <= now.getTime()) {
      const [resetQuota] = await tx
        .update(aiUsageQuota)
        .set({
          creditsUsed: 0,
          resetAt: getNextResetDate(),
          updatedAt: now,
        })
        .where(eq(aiUsageQuota.userId, params.userId))
        .returning();
      quota = resetQuota;
    }

    const nextUsed = quota.creditsUsed + credits;
    if (nextUsed > quota.monthlyCreditLimit) {
      return {
        allowed: false,
        remaining: Math.max(0, quota.monthlyCreditLimit - quota.creditsUsed),
        used: quota.creditsUsed,
        limit: quota.monthlyCreditLimit,
        resetAt: quota.resetAt,
      };
    }

    const [updated] = await tx
      .update(aiUsageQuota)
      .set({
        creditsUsed: nextUsed,
        updatedAt: now,
      })
      .where(eq(aiUsageQuota.userId, params.userId))
      .returning();

    await tx.insert(aiUsageEvent).values({
      id: crypto.randomUUID(),
      userId: params.userId,
      endpoint: params.endpoint,
      model: params.model || null,
      creditsConsumed: credits,
      metadata: params.metadata || {},
    });

    return {
      allowed: true,
      remaining: Math.max(0, updated.monthlyCreditLimit - updated.creditsUsed),
      used: updated.creditsUsed,
      limit: updated.monthlyCreditLimit,
      resetAt: updated.resetAt,
    };
  });
}
