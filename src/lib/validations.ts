import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(5, "Password minimal 5 karakter"),
  noHp: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor HP hanya boleh angka"),
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^[0-9]+$/, "NIK hanya boleh angka"),
  // Zod v4: use `error` not `errorMap`
  tipe: z
    .enum(["RUMAH_TANGGA", "SEKOLAH", "KANTOR", "LAINNYA"] as const)
    .refine((val) => !!val, { message: "Pilih tipe pengguna" }),
});

export const laporanSchema = z.object({
  berat: z.number().positive("Berat harus lebih dari 0"),
  jenisSampahId: z.string().uuid("Pilih jenis sampah"),
  wilayahId: z.string().uuid("Pilih wilayah"),
  institusiId: z.string().uuid().optional(),
  keterangan: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LaporanInput = z.infer<typeof laporanSchema>;
