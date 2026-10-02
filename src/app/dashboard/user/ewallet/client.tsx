"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Wallet,
  ArrowLeftRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Coins,
  Smartphone,
  Receipt,
  Send,
} from "lucide-react";

interface EWalletData {
  poin: number;
  transaksi: {
    id: string;
    jenis: string;
    jumlah: number;
    keterangan: string;
    tanggal: string;
  }[];
  penarikan: {
    id: string;
    jumlahPoin: number;
    nominal: number;
    metode: string;
    nomorTujuan: string;
    status: string;
    nomorReferensi: string;
    tanggal: string;
    tanggalVerif: string | null;
  }[];
}

const METODE_LIST = [
  { id: "GOPAY", label: "GoPay", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/30", icon: "💳" },
  { id: "DANA", label: "DANA", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", icon: "💙" },
  { id: "OVO", label: "OVO", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30", icon: "💜" },
  { id: "SHOPEEPAY", label: "ShopeePay", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", icon: "🧡" },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: "Menunggu Verifikasi", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: <Clock className="w-3.5 h-3.5" /> },
  BERHASIL: { label: "Berhasil", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  GAGAL: { label: "Ditolak", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function EWalletClient({ data, userName }: { data: EWalletData; userName: string }) {
  const [selectedMetode, setSelectedMetode] = useState<string | null>(null);
  const [nomorTujuan, setNomorTujuan] = useState("");
  const [jumlahPoin, setJumlahPoin] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [successData, setSuccessData] = useState<{ penarikanId: string; metode: string; nominal: number; nomor: string; referensi?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"tarik" | "riwayat" | "mutasi">("tarik");

  const estimasiRupiah = jumlahPoin * 100;

  const handleSubmit = async () => {
    if (!selectedMetode) return;
    if (!nomorTujuan || nomorTujuan.length < 10) {
      setNotification({ message: "Masukkan nomor e-Wallet yang valid (min 10 digit)", type: "error" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (jumlahPoin < 100) {
      setNotification({ message: "Minimum penarikan 100 poin", type: "error" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (jumlahPoin > data.poin) {
      setNotification({ message: `Poin tidak cukup! Saldo Anda: ${data.poin} poin`, type: "error" });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const { tarikSaldo } = await import("@/app/actions");
      const res = await tarikSaldo(selectedMetode as any, nomorTujuan, jumlahPoin);
      if (res.success) {
        setSuccessData({
          penarikanId: res.penarikanId || "",
          metode: selectedMetode,
          nominal: estimasiRupiah,
          nomor: nomorTujuan,
        });
        setNotification({ message: "✅ Penarikan berhasil diajukan!", type: "success" });
      } else {
        setNotification({ message: res.message, type: "error" });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification({ message: "Terjadi kesalahan", type: "error" });
      setTimeout(() => setNotification(null), 3000);
    }
    setIsLoading(false);
  };

  const metodeInfo = METODE_LIST.find(m => m.id === selectedMetode);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 relative">
      {/* Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
            notification.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-100"
              : "bg-rose-950/80 border-rose-500/50 text-rose-100"
          }`}
        >
          <span className="font-medium">{notification.message}</span>
        </motion.div>
      )}

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/user" className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-7 h-7 text-emerald-400" />
              Dompet e-Wallet
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Kelola poin dan tarik saldo ke e-Wallet Anda</p>
          </div>
        </div>
      </motion.div>

      {/* Saldo Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Saldo Poin Tersedia</p>
                <p className="text-4xl font-bold gradient-text mt-1">{data.poin.toLocaleString("id-ID")}</p>
                <p className="text-xs text-slate-500 mt-2">Setara Rp {(data.poin * 100).toLocaleString("id-ID")}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Coins className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs">1 Poin = Rp 100</span>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs">Min. Tarik 100 Poin</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 border-b border-slate-700/50 pb-0">
        {[
          { key: "tarik", label: "Tarik Saldo", icon: <Send className="w-4 h-4" /> },
          { key: "riwayat", label: "Riwayat Penarikan", icon: <Receipt className="w-4 h-4" /> },
          { key: "mutasi", label: "Mutasi Poin", icon: <ArrowLeftRight className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as any); setSuccessData(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-[1px] ${
              activeTab === tab.key
                ? "text-emerald-400 border-emerald-400 bg-emerald-500/5"
                : "text-slate-400 border-transparent hover:text-white hover:bg-slate-800/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={itemVariants}>
        {/* ======== TAB: TARIK SALDO ======== */}
        {activeTab === "tarik" && !successData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  Pilih Metode Penarikan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Metode Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {METODE_LIST.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMetode(m.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedMetode === m.id
                          ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                          : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <p className={`text-sm font-bold mt-2 ${m.color}`}>{m.label}</p>
                    </button>
                  ))}
                </div>

                {/* Nomor e-Wallet */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Nomor e-Wallet Tujuan</label>
                  <input
                    type="tel"
                    value={nomorTujuan}
                    onChange={(e) => setNomorTujuan(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="08xxxxxxxxxx"
                    className="w-full h-11 px-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    maxLength={15}
                  />
                </div>

                {/* Jumlah Poin */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Jumlah Poin</label>
                  <input
                    type="number"
                    value={jumlahPoin}
                    onChange={(e) => setJumlahPoin(Math.max(0, parseInt(e.target.value) || 0))}
                    min={100}
                    step={50}
                    className="w-full h-11 px-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {/* Quick buttons */}
                  <div className="flex gap-2 mt-2">
                    {[100, 250, 500, 1000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setJumlahPoin(v)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                          jumlahPoin === v
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                        }`}
                      >
                        {v} pts
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedMetode}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memproses..." : "Ajukan Penarikan"}
                </button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-cyan-400" />
                  Ringkasan Penarikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Metode</span>
                    <span className={`text-sm font-bold ${metodeInfo?.color || "text-slate-500"}`}>
                      {metodeInfo ? `${metodeInfo.icon} ${metodeInfo.label}` : "Belum dipilih"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Nomor Tujuan</span>
                    <span className="text-sm font-medium text-white">{nomorTujuan || "-"}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Jumlah Poin</span>
                    <span className="text-sm font-medium text-white">{jumlahPoin.toLocaleString("id-ID")} Poin</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700/50">
                    <span className="text-sm text-slate-400">Estimasi Diterima</span>
                    <span className="text-lg font-bold text-emerald-400">Rp {estimasiRupiah.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-sm text-slate-400">Sisa Saldo</span>
                    <span className={`text-sm font-medium ${data.poin >= jumlahPoin ? "text-white" : "text-rose-400"}`}>
                      {Math.max(0, data.poin - jumlahPoin).toLocaleString("id-ID")} Poin
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ======== SUCCESS / BUKTI TRANSFER ======== */}
        {activeTab === "tarik" && successData && (
          <Card className="border-emerald-500/30 max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-1">Penarikan Berhasil Diajukan!</h2>
              <p className="text-sm text-slate-400 mb-6">Menunggu verifikasi dari Admin</p>

              <div className="bg-slate-800/50 rounded-xl p-5 text-left space-y-3 border border-slate-700/50">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Metode</span>
                  <span className="text-sm font-bold text-white">{METODE_LIST.find(m => m.id === successData.metode)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Nomor Tujuan</span>
                  <span className="text-sm font-medium text-white">{successData.nomor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Nominal</span>
                  <span className="text-sm font-bold text-emerald-400">Rp {successData.nominal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-3 h-3" /> Menunggu Verifikasi
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => { setSuccessData(null); setSelectedMetode(null); setNomorTujuan(""); setJumlahPoin(100); }}
                  className="flex-1 py-2.5 bg-slate-800 text-white font-medium rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  Buat Lagi
                </button>
                <button
                  onClick={() => setActiveTab("riwayat")}
                  className="flex-1 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Lihat Riwayat
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ======== TAB: RIWAYAT PENARIKAN ======== */}
        {activeTab === "riwayat" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-cyan-400" />
                Riwayat Penarikan ({data.penarikan.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.penarikan.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Wallet className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Belum ada penarikan. Ajukan penarikan pertama Anda!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.penarikan.map((p) => {
                    const status = STATUS_MAP[p.status] || STATUS_MAP.PENDING;
                    const metode = METODE_LIST.find(m => m.id === p.metode);
                    return (
                      <div key={p.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{metode?.icon || "💰"}</span>
                            <div>
                              <p className={`text-sm font-bold ${metode?.color || "text-white"}`}>{metode?.label || p.metode}</p>
                              <p className="text-xs text-slate-400">{p.nomorTujuan}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold text-white">Rp {p.nominal.toLocaleString("id-ID")}</p>
                            <p className="text-xs text-slate-500">{p.jumlahPoin} poin</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/30">
                          <span className="text-xs text-slate-500">
                            {new Date(p.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">{p.nomorReferensi}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border ${status.color}`}>
                              {status.icon} {status.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ======== TAB: MUTASI POIN ======== */}
        {activeTab === "mutasi" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
                Mutasi Poin ({data.transaksi.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.transaksi.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Coins className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Belum ada mutasi poin.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.transaksi.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.jenis === "DAPAT_POIN" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          <ArrowLeftRight className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{t.keterangan}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(t.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold whitespace-nowrap ${t.jenis === "DAPAT_POIN" ? "text-emerald-400" : "text-rose-400"}`}>
                        {t.jenis === "DAPAT_POIN" ? "+" : "-"}{t.jumlah} Poin
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
