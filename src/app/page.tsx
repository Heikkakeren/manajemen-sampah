import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role;
  if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/user");
  }
}
