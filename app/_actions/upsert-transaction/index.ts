"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { upsertTransactionSchema } from "./schema";

interface UpsertTransactionData {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (data: UpsertTransactionData) => {
  upsertTransactionSchema.parse(data);
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  await db.transaction.upsert({
    update: { ...data, userId },
    create: { ...data, userId },
    where: {
      id: data.id ?? "",
    },
  });
  revalidatePath("/transactions");
};
