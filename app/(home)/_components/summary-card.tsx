import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { canUserAddTransaction } from "@/app/_data/can-user-add-transaction";
import type { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  colored?: boolean;
}
export const SummaryCard = async ({
  icon,
  title,
  amount,
  size = "small",
  colored,
}: SummaryCardProps) => {
  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <Card className={`${colored ? "bg-white bg-opacity-5" : ""}`}>
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        {icon}
        <p
          className={
            size === "small"
              ? "m-0 text-muted-foreground"
              : "text-white opacity-70"
          }
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <p
          className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        )}
      </CardContent>
    </Card>
  );
};
