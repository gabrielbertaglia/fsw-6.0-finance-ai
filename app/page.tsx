import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/signin");
  }
  return (
    <div className="flex items-center justify-center">
      <UserButton showName />
    </div>
  );
}
