"use client";

import { Button } from "@/app/_components/ui/button";
import UpsertTransactionDialog from "@/app/_components/upsert-transaction-dialog";
import type { Transaction } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

interface EditTransactionButtonProps {
  transaction: Transaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [dialogIsOpen, setIsDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setIsDialogIsOpen(true)}
      >
        <PencilIcon />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setIsDialogIsOpen}
        defaultValues={{
          ...transaction,
          amount: String(transaction.amount),
        }}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
