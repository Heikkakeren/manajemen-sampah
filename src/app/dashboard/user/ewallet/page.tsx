import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EWalletClient } from "./client";

export default async function EWalletPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [poinReward, transaksiList, penarikanList] = await Promise.all([
    prisma.poinReward.findUnique({ where: { userId } }),
    prisma.transaksi.findMany({
      where: { userId },
      orderBy: { tanggal: "desc" },
      take: 50,
    }),
    prisma.penarikan.findMany({
      where: { userId },
      orderBy: { tanggal: "desc" },
      take: 20,
    }),
  ]);

  const data = {
    poin: poinReward?.jumlah || 0,
    transaksi: transaksiList.map((t) => ({
      id: t.id,
      jenis: t.jenis,
      jumlah: t.jumlah,
      keterangan: t.keterangan,
      tanggal: t.tanggal.toISOString(),
    })),
    penarikan: penarikanList.map((p) => ({
      id: p.id,
      jumlahPoin: p.jumlahPoin,
      nominal: p.nominal,
      metode: p.metode,
      nomorTujuan: p.nomorTujuan,
      status: p.status,
      nomorReferensi: p.nomorReferensi,
      tanggal: p.tanggal.toISOString(),
      tanggalVerif: p.tanggalVerif?.toISOString() || null,
    })),
  };

  return <EWalletClient data={data} userName={(session.user as { nama?: string }).nama || "Pengguna"} />;
}
