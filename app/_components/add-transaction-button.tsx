"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import UpsertTransactionDialog from "./upsert-transaction-dialog";

const AddTransactionButton = () => {
  const [dialogIsOpen, setIsDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        className="rounded-full font-bold"
        onClick={() => setIsDialogIsOpen(true)}
      >
        Adicionar transações <ArrowDownUpIcon />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setIsDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;
