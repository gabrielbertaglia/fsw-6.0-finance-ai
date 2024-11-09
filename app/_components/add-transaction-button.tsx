"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import UpsertTransactionDialog from "./upsert-transaction-dialog";

interface AddTransactionButtonProps {
  userCanAddTransaction: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setIsDialogIsOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="rounded-full font-bold"
            onClick={() => setIsDialogIsOpen(true)}
            disabled={!userCanAddTransaction}
          >
            Adicionar transações <ArrowDownUpIcon />
          </Button>
        </TooltipTrigger>
        <UpsertTransactionDialog
          isOpen={dialogIsOpen}
          setIsOpen={setIsDialogIsOpen}
        />
        <TooltipContent>
          {!userCanAddTransaction && (
            <p>
              Você atingiu o limite de transações. Faça o upgrade para o plano
              premium e tenha acesso a todas as funcionalides e transações
              ilimitadas
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default AddTransactionButton;
