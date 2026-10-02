"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createLaporan } from "@/app/actions";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  Trash2,
  MapPin,
  Scale,
  Upload,
  X,
  Image as ImageIcon,
  GraduationCap,
  Briefcase,
  Building,
  Home,
  Search,
  CheckCircle2,
  StickyNote,
} from "lucide-react";

interface JenisSampah {
  id: string;
  namaJenis: string;
}

interface Wilayah {
  id: string;
  namaWilayah: string;
}

interface Institusi {
  id: string;
  nama: string;
  tipe: "SEKOLAH" | "KANTOR" | "FASILITAS_UMUM" | "PERUMAHAN";
  wilayahId: string | null;
  wilayah: { id: string; namaWilayah: string } | null;
}

const TIPE_CONFIG = {
  SEKOLAH: {
    icon: GraduationCap,
    label: "Sekolah / Kampus",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  KANTOR: {
    icon: Briefcase,
    label: "Kantor / Instansi",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
  },
  FASILITAS_UMUM: {
    icon: Building,
    label: "Fasilitas Umum",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
  PERUMAHAN: {
    icon: Home,
    label: "Perumahan",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
};

export function LaporForm({
  jenisSampah,
  wilayah,
  institusiList,
}: {
  jenisSampah: JenisSampah[];
  wilayah: Wilayah[];
  institusiList: Institusi[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedWilayahId, setSelectedWilayahId] = useState<string>("");
  const [selectedInstitusi, setSelectedInstitusi] = useState<Institusi | null>(null);
  const [searchInstitusi, setSearchInstitusi] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter institusi berdasarkan wilayah yang dipilih + search
  const filteredInstitusi = useMemo(() => {
    let list = institusiList;
    if (selectedWilayahId) {
      list = list.filter((i) => i.wilayahId === selectedWilayahId);
    }
    if (searchInstitusi.trim()) {
      const q = searchInstitusi.toLowerCase();
      list = list.filter((i) => i.nama.toLowerCase().includes(q));
    }
    return list;
  }, [institusiList, selectedWilayahId, searchInstitusi]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  function clearFile() {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleWilayahChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedWilayahId(e.target.value);
    setSelectedInstitusi(null);
    setSearchInstitusi("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // Override institusiId from state (hidden input already in form)
    if (selectedInstitusi) {
      formData.set("institusiId", selectedInstitusi.id);
    }

    try {
      const result = await createLaporan(formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/user");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengirim laporan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-white">
          Buat <span className="gradient-text">Laporan Baru</span>
        </h1>
        <p className="text-slate-400 mt-1">Laporkan sampah yang Anda temukan</p>
      </div>

      <Card className="glow-emerald">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-emerald-400" />
            Form Pelaporan Sampah
          </CardTitle>
          <CardDescription>
            Isi semua field di bawah untuk membuat laporan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden field for institusiId */}
            <input type="hidden" name="institusiId" value={selectedInstitusi?.id ?? ""} />

            {/* Jenis Sampah */}
            <div className="space-y-2">
              <Label htmlFor="jenisSampahId" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-emerald-400" />
                Jenis Sampah
              </Label>
              <Select id="jenisSampahId" name="jenisSampahId" required>
                <option value="" disabled>Pilih jenis sampah</option>
                {jenisSampah.map((js) => (
                  <option key={js.id} value={js.id} className="bg-slate-800">
                    {js.namaJenis}
                  </option>
                ))}
              </Select>
            </div>

            {/* Wilayah */}
            <div className="space-y-2">
              <Label htmlFor="wilayahId" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Wilayah
              </Label>
              <Select
                id="wilayahId"
                name="wilayahId"
                required
                onChange={handleWilayahChange}
                value={selectedWilayahId}
              >
                <option value="" disabled>Pilih wilayah</option>
                {wilayah.map((w) => (
                  <option key={w.id} value={w.id} className="bg-slate-800">
                    {w.namaWilayah}
                  </option>
                ))}
              </Select>
            </div>

            {/* Institusi Selector */}
            <AnimatePresence>
              {selectedWilayahId && (
                <motion.div
                  key="institusi-selector"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-violet-400" />
                    Pilih Institusi / Lokasi{" "}
                    <span className="text-slate-500 text-xs font-normal">(opsional)</span>
                  </Label>

                  {/* Search box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={searchInstitusi}
                      onChange={(e) => setSearchInstitusi(e.target.value)}
                      placeholder="Ketik nama institusi untuk filter..."
                      className="w-full h-10 pl-9 pr-9 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                    />
                    {searchInstitusi && (
                      <button
                        type="button"
                        onClick={() => setSearchInstitusi("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Institusi Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scroll">
                    {filteredInstitusi.length === 0 ? (
                      <div className="col-span-2 text-center py-6 text-slate-500 text-sm">
                        Tidak ada institusi ditemukan
                      </div>
                    ) : (
                      filteredInstitusi.map((inst) => {
                        const cfg = TIPE_CONFIG[inst.tipe];
                        const Icon = cfg.icon;
                        const isSelected = selectedInstitusi?.id === inst.id;

                        return (
                          <motion.button
                            key={inst.id}
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() =>
                              setSelectedInstitusi(isSelected ? null : inst)
                            }
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/10"
                                : `${cfg.border} ${cfg.bg} hover:border-opacity-60`
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}
                            >
                              <Icon className={`w-4 h-4 ${cfg.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {inst.nama}
                              </p>
                              <p className={`text-xs ${cfg.color}`}>{cfg.label}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            )}
                          </motion.button>
                        );
                      })
                    )}
                  </div>

                  {/* Selected badge */}
                  {selectedInstitusi && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-300 font-medium truncate">
                        {selectedInstitusi.nama}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedInstitusi(null)}
                        className="ml-auto text-slate-500 hover:text-white transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keterangan */}
            <div className="space-y-2">
              <Label htmlFor="keterangan" className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-400" />
                Catatan Tambahan{" "}
                <span className="text-slate-500 text-xs font-normal">(opsional)</span>
              </Label>
              <Input
                id="keterangan"
                name="keterangan"
                type="text"
                placeholder="Contoh: di depan gerbang, dekat kantin lantai 2..."
              />
            </div>

            {/* Berat */}
            <div className="space-y-2">
              <Label htmlFor="berat" className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-violet-400" />
                Berat (kg)
              </Label>
              <Input
                id="berat"
                name="berat"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Contoh: 2.5"
                required
              />
            </div>

            {/* Foto Upload */}
            <div className="space-y-2">
              <Label htmlFor="foto" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Foto Sampah{" "}
                <span className="text-slate-500 text-xs font-normal">(opsional, maks. 5MB)</span>
              </Label>

              {preview ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/40 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview foto"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={clearFile}
                      className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white bg-black/60 rounded-lg px-2 py-1 truncate">
                      {fileName}
                    </p>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="foto"
                  className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-slate-600 hover:border-emerald-500/60 bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group"
                >
                  <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition-colors mb-2" />
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    Klik untuk memilih foto
                  </p>
                  <p className="text-xs text-slate-600 mt-1">JPG, PNG, WebP, GIF (maks. 5MB)</p>
                </label>
              )}

              <input
                ref={fileInputRef}
                id="foto"
                name="foto"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
              ) : (
                <><Send className="w-4 h-4" /> Kirim Laporan</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
