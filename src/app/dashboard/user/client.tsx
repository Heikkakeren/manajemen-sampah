"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mascot } from "@/components/mascot";
import { PromoPopup } from "@/components/promo-popup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Scale,
  CalendarDays,
  CalendarRange,
  FileText,
  Trash2,
  MapPin,
  Image as ImageIcon,
  Search,
  X,
  Building2,
  Coins,
  ArrowLeftRight,
} from "lucide-react";

interface LaporanItem {
  id: string;
  berat: number;
  tanggalLapor: string;
  jenisSampah: string;
  wilayah: string;
  institusi: { nama: string; tipe: string } | null;
  keterangan: string | null;
  fotoUrl: string | null;
  status: string;
}

interface UserDashboardData {
  weeklyWeight: number;
  weeklyCount: number;
  monthlyWeight: number;
  monthlyCount: number;
  poin: number;
  transaksi: any[];
  laporan: LaporanItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function UserDashboardClient({
  data,
  userName,
}: {
  data: UserDashboardData;
  userName: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const handleTukarPoin = async (jumlah: number, keterangan: string) => {
    if (data.poin < jumlah) {
      setNotification({ message: `Poin tidak cukup! Anda butuh ${jumlah} poin.`, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    // Simulate loading state if desired, but we'll just await
    const { tukarPoin } = await import('@/app/actions');
    const res = await tukarPoin(jumlah, keterangan);
    
    if (res.success) {
      setNotification({ message: `✅ Berhasil! ${keterangan}. Poin Anda telah dipotong.`, type: 'success' });
      // Reload after 2 seconds to show the message
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setNotification({ message: `❌ Gagal: ${res.message}`, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const filteredLaporan = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.laporan;
    return data.laporan.filter(
      (item) =>
        item.jenisSampah.toLowerCase().includes(q) ||
        item.wilayah.toLowerCase().includes(q) ||
        (item.institusi && item.institusi.nama.toLowerCase().includes(q)) ||
        (item.keterangan && item.keterangan.toLowerCase().includes(q))
    );
  }, [searchQuery, data.laporan]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 relative"
    >
      {/* Toast Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-100'
          }`}
        >
          <span className="font-medium">{notification.message}</span>
        </motion.div>
      )}

      {/* Promo Popup */}
      <PromoPopup />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Selamat Datang, <span className="gradient-text">{userName}</span>
          </h1>
          <p className="text-slate-400 mt-1">Pantau laporan sampah Anda secara detail</p>
        </div>
        <div className="w-28 h-28 hidden sm:block -mb-4">
          <Mascot className="w-full h-full drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer" />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="pulse-glow border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Berat Minggu Ini</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {data.weeklyWeight.toFixed(1)} kg
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Laporan Minggu Ini</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">
                    {data.weeklyCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-violet-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Berat Bulan Ini</p>
                  <p className="text-2xl font-bold text-violet-400 mt-1">
                    {data.monthlyWeight.toFixed(1)} kg
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <CalendarRange className="w-6 h-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Laporan Bulan Ini</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {data.monthlyCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Poin & Transaksi */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Saldo Ringkas */}
        <Card className="lg:col-span-1 border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              Dompet Poin
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center pb-4">
            <p className="text-sm text-slate-400 mb-2">Saldo Poin Anda</p>
            <p className="text-5xl font-bold gradient-text">{data.poin.toLocaleString("id-ID")}</p>
            <p className="text-xs text-slate-500 mt-2">Setara Rp {(data.poin * 100).toLocaleString("id-ID")}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs">
              1 Kg Sampah = 10 Poin = Rp 1.000
            </span>
            <a
              href="/dashboard/user/ewallet"
              className="mt-5 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" />
              Buka e-Wallet & Tarik Saldo
            </a>
          </CardContent>
        </Card>

        {/* Card Riwayat Transaksi Terakhir */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
                Transaksi Terakhir
              </CardTitle>
              <a href="/dashboard/user/ewallet" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                Lihat Semua →
              </a>
            </div>
          </CardHeader>
          <CardContent>
            {data.transaksi && data.transaksi.length > 0 ? (
              <div className="space-y-3">
                {data.transaksi.slice(0, 5).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.jenis === 'DAPAT_POIN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        <ArrowLeftRight className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{t.keterangan}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(t.tanggal).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold whitespace-nowrap ${t.jenis === 'DAPAT_POIN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.jenis === 'DAPAT_POIN' ? '+' : '-'}{t.jumlah} Poin
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 flex flex-col items-center">
                <Coins className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Belum ada transaksi poin.</p>
                <p className="text-xs mt-1">Lapor sampah dan kumpulkan poin pertama Anda!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Laporan Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-emerald-400" />
                Riwayat Laporan Anda ({filteredLaporan.length})
              </CardTitle>
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari jenis, wilayah, lokasi..."
                  className="w-full h-10 pl-9 pr-9 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLaporan.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>
                  {searchQuery
                    ? `Tidak ada hasil untuk "${searchQuery}"`
                    : "Belum ada laporan. Mulai laporkan sampah Anda!"}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Hapus pencarian
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tanggal</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Jenis</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Wilayah / Detail Lokasi</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Berat</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Foto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {filteredLaporan.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-slate-300" suppressHydrationWarning>
                          {new Date(item.tanggalLapor).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.jenisSampah}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          <div className="flex flex-col gap-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                              {item.wilayah}
                            </span>
                            {item.institusi && (
                              <span className="flex items-center gap-1 text-xs text-violet-400/80">
                                <Building2 className="w-3 h-3 shrink-0" />
                                {item.institusi.nama}
                              </span>
                            )}
                            {item.keterangan && (
                              <span className="text-xs text-slate-500 italic pl-1">
                                &quot;{item.keterangan}&quot;
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-white text-sm">
                          {item.berat.toFixed(1)} kg
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                            item.status === "MENUNGGU" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            item.status === "DIPROSES" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {item.status === "MENUNGGU" ? "Menunggu" : item.status === "DIPROSES" ? "Diproses" : "Selesai"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.fotoUrl ? (
                            <a
                              href={item.fotoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <ImageIcon className="w-3 h-3" /> Lihat
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">-</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
