import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getJenisSampah, getWilayah, getInstitusi } from "@/app/actions";
import { LaporForm } from "./form";

export default async function LaporPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [jenisSampah, wilayah, institusiList] = await Promise.all([
    getJenisSampah(),
    getWilayah(),
    getInstitusi(),
  ]);

  return (
    <LaporForm
      jenisSampah={jenisSampah}
      wilayah={wilayah}
      institusiList={institusiList}
    />
  );
}
