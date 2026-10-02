import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserDashboardClient } from "./client";

export default async function UserDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const now = new Date();

  // Start of current week (Monday)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Stats
  const [weeklyStats, monthlyStats, laporanList, poinReward, transaksiList] = await Promise.all([
    prisma.laporanSampah.aggregate({
      where: {
        userId,
        tanggalLapor: { gte: startOfWeek },
      },
      _sum: { berat: true },
      _count: true,
    }),
    prisma.laporanSampah.aggregate({
      where: {
        userId,
        tanggalLapor: { gte: startOfMonth },
      },
      _sum: { berat: true },
      _count: true,
    }),
    prisma.laporanSampah.findMany({
      where: { userId },
      include: {
        jenisSampah: true,
        wilayah: true,
        fotoSampah: true,
        institusi: { select: { nama: true, tipe: true } },
      },
      orderBy: { tanggalLapor: "desc" },
      take: 50,
    }),
    prisma.poinReward.findUnique({ where: { userId } }),
    prisma.transaksi.findMany({
      where: { userId },
      orderBy: { tanggal: "desc" },
      take: 20,
    })
  ]);

  const data = {
    weeklyWeight: weeklyStats._sum.berat || 0,
    weeklyCount: weeklyStats._count,
    monthlyWeight: monthlyStats._sum.berat || 0,
    monthlyCount: monthlyStats._count,
    poin: poinReward?.jumlah || 0,
    transaksi: transaksiList.map((t) => ({
      id: t.id,
      jenis: t.jenis,
      jumlah: t.jumlah,
      keterangan: t.keterangan,
      tanggal: t.tanggal.toISOString(),
    })),
    laporan: laporanList.map((l) => ({
      id: l.id,
      berat: l.berat,
      tanggalLapor: l.tanggalLapor.toISOString(),
      jenisSampah: l.jenisSampah.namaJenis,
      wilayah: l.wilayah.namaWilayah,
      institusi: l.institusi ? { nama: l.institusi.nama, tipe: l.institusi.tipe } : null,
      keterangan: l.keterangan || null,
      fotoUrl: l.fotoSampah?.imageUrl || null,
      status: l.status,
    })),
  };

  return <UserDashboardClient data={data} userName={(session.user as { nama?: string }).nama || "Pengguna"} />;
}
