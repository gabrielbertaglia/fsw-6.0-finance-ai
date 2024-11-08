import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavBar } from "../_components/navbar";

const SubscriptionPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/signin");
  }
  return <NavBar />;
};

export default SubscriptionPage;
