import { auth } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import { redirect } from "next/navigation";
import { NavBar } from "../_components/navbar";
import { getDashboard } from "../_data/get-dashboard";
import { ExpensesPerCategory } from "./_components/expenses-per-category";
import { LastTransactions } from "./_components/last-transactions";
import { SummaryCards } from "./_components/summary-cards";
import { TimeSelect } from "./_components/time-select";
import { TransactionsPieChart } from "./_components/transactions-pie-chart";

interface HomeProps {
  searchParams: { month: string };
}

export default async function Home({ searchParams: { month } }: HomeProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/signin");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }

  const dashboard = await getDashboard(month);

  return (
    <>
      <NavBar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards {...dashboard} />
            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
}
