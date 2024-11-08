import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavBar } from "./_components/navbar";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/signin");
  }
  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center">
        {/* <UserButton showName /> */}
      </div>
    </>
  );
}
