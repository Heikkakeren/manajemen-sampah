"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mascot } from "@/components/mascot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteLaporan, updateStatusLaporan, verifikasiPenarikan } from "@/app/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Scale,
  FileText,
  Layers,
  MapPin,
  Trash2,
  TrendingUp,
  Users,
  Image as ImageIcon,
  Loader2,
  Calendar,
  Search,
  X,
  Building2,
  Wallet,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface PenarikanItem {
  id: string;
  userName: string;
  userEmail: string;
  jumlahPoin: number;
  nominal: number;
  metode: string;
  nomorTujuan: string;
  nomorReferensi: string;
  tanggal: string;
}

interface LaporanItem {
  id: string;
  berat: number;
  tanggalLapor: string;
  userName: string;
  userTipe: string;
  jenisSampah: string;
  wilayah: string;
  institusi: { nama: string; tipe: string } | null;
  keterangan: string | null;
  fotoUrl: string | null;
  status: string;
}

interface ChartDataItem {
  date: string;
  berat: number;
}

interface PieDataItem {
  name: string;
  value: number;
}

interface AdminDashboardProps {
  laporan: LaporanItem[];
  totalWeight: number;
  totalCount: number;
  pieData: PieDataItem[];
  lineData: ChartDataItem[];
  jenisSampahCount: number;
  wilayahCount: number;
  penarikan: PenarikanItem[];
}

const PIE_COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b"];
const TIPE_LABELS: Record<string, string> = {
  "RUMAH TANGGA": "Rumah Tangga",
  SEKOLAH: "Sekolah",
  KANTOR: "Kantor",
  LAINNYA: "Lainnya",
};

type TimeFilter = "week" | "month" | "all";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function AdminDashboardClient({
  laporan,
  totalWeight,
  totalCount,
  pieData,
  lineData,
  jenisSampahCount,
  wilayahCount,
  penarikan,
}: AdminDashboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const router = useRouter();

  // Filter data by time and search query
  const filteredData = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    if (timeFilter === "week") {
      startDate = new Date(now);
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFilter === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(0);
    }

    const q = searchQuery.trim().toLowerCase();

    const filteredLaporan = laporan.filter((l) => {
      const matchTime = new Date(l.tanggalLapor) >= startDate;
      if (!matchTime) return false;
      if (!q) return true;
      return (
        l.userName.toLowerCase().includes(q) ||
        l.jenisSampah.toLowerCase().includes(q) ||
        l.wilayah.toLowerCase().includes(q) ||
        (l.institusi && l.institusi.nama.toLowerCase().includes(q)) ||
        (l.keterangan && l.keterangan.toLowerCase().includes(q)) ||
        l.userTipe.toLowerCase().includes(q)
      );
    });

    const filteredLine = lineData.filter(
      (l) => new Date(l.date) >= startDate
    );

    const filteredWeight = filteredLaporan.reduce(
      (sum, l) => sum + l.berat,
      0
    );

    return {
      laporan: filteredLaporan,
      lineData: filteredLine,
      totalWeight: timeFilter === "all" && !q ? totalWeight : filteredWeight,
      totalCount: timeFilter === "all" && !q ? totalCount : filteredLaporan.length,
    };
  }, [timeFilter, searchQuery, laporan, lineData, totalWeight, totalCount]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const result = await deleteLaporan(id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Gagal menghapus laporan");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingStatusId(id);
    try {
      const result = await updateStatusLaporan(id, newStatus as any);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Gagal mengubah status laporan");
    } finally {
      setUpdatingStatusId(null);
    }
  }

  const filterLabels: Record<TimeFilter, string> = {
    week: "Per Minggu",
    month: "Per Bulan",
    all: "Keseluruhan",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-4">
            <span>Dashboard <span className="gradient-text">Admin</span></span>
            <div className="w-16 h-16 hidden sm:block -mb-2">
              <Mascot className="w-full h-full drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer" />
            </div>
          </h1>
          <p className="text-slate-400 mt-1">Pantau seluruh data laporan dan metrik sistem</p>
        </div>

        {/* Time Filters */}
        <div className="flex gap-2 sm:pb-2">
          {(["week", "month", "all"] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className={timeFilter === filter ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25" : ""}
            >
              {filterLabels[filter]}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="pulse-glow border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Berat</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {filteredData.totalWeight.toFixed(1)} kg
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-emerald-400" />
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
                  <p className="text-sm text-slate-400">Total Laporan</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">
                    {filteredData.totalCount}
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
                  <p className="text-sm text-slate-400">Jenis Sampah</p>
                  <p className="text-2xl font-bold text-violet-400 mt-1">
                    {jenisSampahCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-violet-400" />
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
                  <p className="text-sm text-slate-400">Wilayah Aktif</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {wilayahCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Tren Berat Sampah
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredData.lineData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  Belum ada data untuk periode ini
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData.lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value: string) =>
                        new Date(value).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })
                      }
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#f1f5f9",
                      }}
                      labelFormatter={(label) =>
                        new Date(String(label)).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      }
                      formatter={(value) => [
                        `${Number(value).toFixed(1)} kg`,
                        "Berat",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="berat"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 4 }}
                      activeDot={{ r: 6, fill: "#34d399" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Berdasarkan Tipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  Belum ada data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        color: "#f1f5f9",
                      }}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)} kg`,
                        TIPE_LABELS[String(name)] || String(name),
                      ]}
                    />
                    <Legend
                      formatter={(value) =>
                        TIPE_LABELS[value] || value
                      }
                      wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-emerald-400" />
                Semua Laporan ({filteredData.laporan.length})
              </CardTitle>
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pelapor, wilayah, jenis..."
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
            {filteredData.laporan.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>
                  {searchQuery
                    ? `Tidak ada hasil untuk "${searchQuery}"`
                    : "Belum ada laporan untuk periode ini"}
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
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Pelapor
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Tipe
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Jenis
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Wilayah / Detail Lokasi
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Berat
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Foto
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {filteredData.laporan.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-slate-300" suppressHydrationWarning>
                          {new Date(item.tanggalLapor).toLocaleDateString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-white font-medium">
                          {item.userName}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {item.userTipe.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                        <td className="py-3 px-4 text-sm text-right font-mono text-white">
                          {item.berat.toFixed(1)} kg
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            value={item.status}
                            disabled={updatingStatusId === item.id}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className={`text-xs font-medium rounded-lg px-2 py-1 border transition-colors outline-none cursor-pointer ${
                              item.status === "MENUNGGU" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" :
                              item.status === "DIPROSES" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20" :
                              "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            <option value="MENUNGGU" className="bg-slate-800 text-amber-400">Menunggu</option>
                            <option value="DIPROSES" className="bg-slate-800 text-cyan-400">Diproses</option>
                            <option value="SELESAI" className="bg-slate-800 text-emerald-400">Selesai</option>
                          </select>
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
                        <td className="py-3 px-4 text-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="text-xs h-8"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-3 h-3" /> Hapus
                              </>
                            )}
                          </Button>
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

      {/* Penarikan Menunggu Verifikasi */}
      {penarikan.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-amber-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                Penarikan Menunggu Verifikasi ({penarikan.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {penarikan.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-amber-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{p.userName}</p>
                        <p className="text-xs text-slate-400">{p.metode} → {p.nomorTujuan}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{p.nomorReferensi}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-2">
                        <p className="text-sm font-bold text-white">Rp {p.nominal.toLocaleString("id-ID")}</p>
                        <p className="text-xs text-slate-400">{p.jumlahPoin} poin</p>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        disabled={verifyingId === p.id}
                        onClick={async () => {
                          setVerifyingId(p.id);
                          const res = await verifikasiPenarikan(p.id, true);
                          if (res.success) {
                            toast.success(res.message);
                            router.refresh();
                          } else {
                            toast.error(res.message);
                          }
                          setVerifyingId(null);
                        }}
                        className="gap-1"
                      >
                        {verifyingId === p.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={verifyingId === p.id}
                        onClick={async () => {
                          setVerifyingId(p.id);
                          const res = await verifikasiPenarikan(p.id, false);
                          if (res.success) {
                            toast.success(res.message);
                            router.refresh();
                          } else {
                            toast.error(res.message);
                          }
                          setVerifyingId(null);
                        }}
                        className="gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
