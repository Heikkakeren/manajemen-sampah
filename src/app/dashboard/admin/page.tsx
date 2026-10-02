import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "./client";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") redirect("/dashboard/user");

  // Fetch all data
  const [allLaporan, totalWeight, jenisSampahList, wilayahList, pendingPenarikan] =
    await Promise.all([
      prisma.laporanSampah.findMany({
        include: {
          user: { select: { nama: true, tipe: true } },
          jenisSampah: true,
          wilayah: true,
          fotoSampah: true,
          institusi: { select: { nama: true, tipe: true } },
        },
        orderBy: { tanggalLapor: "desc" },
      }),
      prisma.laporanSampah.aggregate({
        _sum: { berat: true },
        _count: true,
      }),
      prisma.jenisSampah.findMany(),
      prisma.wilayah.findMany(),
      prisma.penarikan.findMany({
        where: { status: "PENDING" },
        include: { user: { select: { nama: true, email: true } } },
        orderBy: { tanggal: "desc" },
      }),
    ]);

  // Prepare serialized data
  const laporanData = allLaporan.map((l) => ({
    id: l.id,
    berat: l.berat,
    tanggalLapor: l.tanggalLapor.toISOString(),
    userName: l.user.nama,
    userTipe: l.user.tipe,
    jenisSampah: l.jenisSampah.namaJenis,
    wilayah: l.wilayah.namaWilayah,
    institusi: l.institusi ? { nama: l.institusi.nama, tipe: l.institusi.tipe } : null,
    keterangan: l.keterangan || null,
    fotoUrl: l.fotoSampah?.imageUrl || null,
    status: l.status,
  }));

  // Aggregate by TipeUser for pie chart
  const tipeAggregation: Record<string, number> = {};
  for (const l of allLaporan) {
    const tipe = l.user.tipe;
    tipeAggregation[tipe] = (tipeAggregation[tipe] || 0) + l.berat;
  }
  const pieData = Object.entries(tipeAggregation).map(([name, value]) => ({
    name: name.replace("_", " "),
    value: parseFloat(value.toFixed(2)),
  }));

  // Aggregate by date for line chart
  const dateAggregation: Record<string, number> = {};
  for (const l of allLaporan) {
    const dateKey = l.tanggalLapor.toISOString().split("T")[0];
    dateAggregation[dateKey] = (dateAggregation[dateKey] || 0) + l.berat;
  }
  const lineData = Object.entries(dateAggregation)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, weight]) => ({
      date,
      berat: parseFloat(weight.toFixed(2)),
    }));

  const penarikanData = pendingPenarikan.map((p) => ({
    id: p.id,
    userName: p.user.nama,
    userEmail: p.user.email,
    jumlahPoin: p.jumlahPoin,
    nominal: p.nominal,
    metode: p.metode,
    nomorTujuan: p.nomorTujuan,
    nomorReferensi: p.nomorReferensi,
    tanggal: p.tanggal.toISOString(),
  }));

  return (
    <AdminDashboardClient
      laporan={laporanData}
      totalWeight={totalWeight._sum.berat || 0}
      totalCount={totalWeight._count}
      pieData={pieData}
      lineData={lineData}
      jenisSampahCount={jenisSampahList.length}
      wilayahCount={wilayahList.length}
      penarikan={penarikanData}
    />
  );
}
