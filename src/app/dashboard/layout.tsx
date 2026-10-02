import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as { nama?: string; role?: string; tipe?: string };

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[#0b1120]">
        <Sidebar
          userName={user.nama || "Pengguna"}
          userRole={user.role || "USER"}
          userTipe={user.tipe || "RUMAH_TANGGA"}
        />
        <main className="lg:ml-[280px] min-h-screen">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
