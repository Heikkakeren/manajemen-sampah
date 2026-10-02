"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
import { registerUser } from "@/app/actions";
import Link from "next/link";
import { Mascot } from "@/components/mascot";

const TIPE_OPTIONS = [
  { value: "RUMAH_TANGGA", label: "Rumah Tangga" },
  { value: "SEKOLAH", label: "Sekolah" },
  { value: "KANTOR", label: "Kantor" },
  { value: "LAINNYA", label: "Lainnya" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await registerUser(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/login");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-4"
          >
            <Mascot className="w-32 h-32 drop-shadow-2xl" />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text">EcoTrack</h1>
          <p className="text-slate-400 mt-2">Buat akun baru</p>
        </div>

        <Card className="glow-emerald">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Daftar</CardTitle>
            <CardDescription>Isi data diri Anda untuk membuat akun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contoh@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimal 5 karakter"
                  required
                  minLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noHp">Nomor HP</Label>
                <Input
                  id="noHp"
                  name="noHp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 digit)</Label>
                <Input
                  id="nik"
                  name="nik"
                  type="text"
                  placeholder="Masukkan 16 digit NIK"
                  maxLength={16}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipe">Tipe Pengguna</Label>
                <Select id="tipe" name="tipe" required>
                  <option value="" disabled>
                    Pilih tipe pengguna
                  </option>
                  {TIPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-800">
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Daftar</>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-slate-400">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
