"use server";

import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import type {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { addTransactionSchema } from "./schema";

interface AddTransactionData {
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const addTransaction = async (data: AddTransactionData) => {
  addTransactionSchema.parse(data);
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  await db.transaction.create({
    data: { ...data, userId },
  });
};
