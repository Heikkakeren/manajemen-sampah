"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { registerSchema, laporanSchema } from "@/lib/validations";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import type { TipeUser } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export type ActionResult = {
  success: boolean;
  message: string;
};

export async function registerUser(formData: FormData): Promise<ActionResult> {
  try {
    const rawData = {
      nama: formData.get("nama") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      noHp: formData.get("noHp") as string,
      nik: formData.get("nik") as string,
      tipe: formData.get("tipe") as string,
    };

    const validated = registerSchema.parse(rawData);
    const hashedPassword = await hash(validated.password, 12);

    await prisma.user.create({
      data: {
        nama: validated.nama,
        email: validated.email,
        password: hashedPassword,
        noHp: validated.noHp,
        nik: validated.nik,
        tipe: validated.tipe as TipeUser,
      },
    });

    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      const target = (error as any).meta?.target as string[] | undefined;
      if (target?.includes("email")) return { success: false, message: "Email sudah terdaftar" };
      if (target?.includes("noHp")) return { success: false, message: "Nomor HP sudah terdaftar" };
      if (target?.includes("nik")) return { success: false, message: "NIK sudah terdaftar" };
      return { success: false, message: "Data sudah terdaftar" };
    }
    return { success: false, message: "Terjadi kesalahan saat registrasi" };
  }
}

export async function createLaporan(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Anda harus login terlebih dahulu" };
    }

    // Parse and clean form values
    const beratRaw = formData.get("berat");
    const jenisSampahId = (formData.get("jenisSampahId") as string)?.trim() || "";
    const wilayahId = (formData.get("wilayahId") as string)?.trim() || "";
    const institusiIdRaw = (formData.get("institusiId") as string)?.trim();
    const keterangan = (formData.get("keterangan") as string)?.trim() || undefined;

    // Basic checks before Zod validation
    if (!beratRaw || !jenisSampahId || !wilayahId) {
      return { success: false, message: "Mohon lengkapi data: jenis sampah, wilayah, dan berat." };
    }

    const berat = parseFloat(beratRaw as string);
    if (isNaN(berat) || berat <= 0) {
      return { success: false, message: "Berat harus berupa angka lebih dari 0." };
    }

    // Only pass institusiId if it looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const institusiId = institusiIdRaw && uuidRegex.test(institusiIdRaw)
      ? institusiIdRaw
      : undefined;

    const rawData = { berat, jenisSampahId, wilayahId, institusiId, keterangan };
    const validated = laporanSchema.parse(rawData);

    // Handle file upload
    let imageUrl: string | null = null;
    const fotoFile = formData.get("foto") as File | null;

    if (!fotoFile || fotoFile.size === 0) {
      return { success: false, message: "Foto sampah wajib diunggah." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    if (!allowedTypes.includes(fotoFile.type)) {
      return { success: false, message: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF." };
    }
    if (fotoFile.size > 5 * 1024 * 1024) {
      return { success: false, message: "Ukuran file maksimal 5MB" };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = fotoFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `sampah_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    const buffer = Buffer.from(await fotoFile.arrayBuffer());
    await writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;

    await prisma.$transaction(async (tx) => {
      const laporan = await tx.laporanSampah.create({
        data: {
          berat: validated.berat,
          userId: session.user!.id!,
          jenisSampahId: validated.jenisSampahId,
          wilayahId: validated.wilayahId,
          institusiId: validated.institusiId ?? null,
          keterangan: validated.keterangan ?? null,
        },
      });

      if (imageUrl) {
        await tx.fotoSampah.create({
          data: { imageUrl, laporanId: laporan.id },
        });
      }
    });

    return { success: true, message: "Laporan berhasil dikirim!" };
  } catch (error) {
    console.error("[createLaporan] Error:", error);

    // Safe check for Prisma errors without using instanceof which can fail in Turbopack
    const isPrismaError = typeof error === "object" && error !== null;
    
    if (isPrismaError && "code" in error && typeof error.code === "string") {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Anda sudah melaporkan jenis sampah ini di wilayah dan tanggal yang sama",
        };
      }
      return { success: false, message: `Database error: ${error.code}` };
    }

    if (isPrismaError && "message" in error && typeof error.message === "string" && error.message.includes("Validasi")) {
      return { success: false, message: "Data tidak valid untuk database. Cek kembali isian form." };
    }

    // Zod error — check by constructor name (works for Zod v3 & v4)
    if (error !== null && typeof error === "object" && "issues" in error) {
      return { success: false, message: "Data tidak valid. Periksa kembali form Anda." };
    }

    if (error instanceof Error) {
      return { success: false, message: `Terjadi kesalahan: ${error.message}` };
    }

    return { success: false, message: "Terjadi kesalahan saat mengirim laporan" };
  }
}

export async function deleteLaporan(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Anda harus login terlebih dahulu" };
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return { success: false, message: "Anda tidak memiliki akses" };
    }

    await prisma.laporanSampah.delete({ where: { id } });
    return { success: true, message: "Laporan berhasil dihapus" };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return { success: false, message: "Laporan tidak ditemukan" };
    }
    return { success: false, message: "Terjadi kesalahan saat menghapus laporan" };
  }
}

export async function getJenisSampah() {
  try {
    return await prisma.jenisSampah.findMany({ orderBy: { namaJenis: "asc" } });
  } catch {
    return [];
  }
}

export async function getWilayah() {
  try {
    return await prisma.wilayah.findMany({ orderBy: { namaWilayah: "asc" } });
  } catch {
    return [];
  }
}

export async function getInstitusi() {
  try {
    return await prisma.institusi.findMany({
      orderBy: { nama: "asc" },
      include: {
        wilayah: { select: { id: true, namaWilayah: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function updateStatusLaporan(id: string, newStatus: "MENUNGGU" | "DIPROSES" | "SELESAI"): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "Anda harus login terlebih dahulu" };
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      return { success: false, message: "Anda tidak memiliki akses" };
    }

    const laporan = await prisma.laporanSampah.findUnique({ where: { id } });
    if (!laporan) {
      return { success: false, message: "Laporan tidak ditemukan" };
    }

    if (newStatus === "SELESAI" && laporan.status !== "SELESAI") {
      // 1 kg = 10 poin
      const poinDiperoleh = Math.max(1, Math.round(laporan.berat * 10));
      
      await prisma.$transaction([
        prisma.laporanSampah.update({ where: { id }, data: { status: newStatus as any } }),
        prisma.transaksi.create({
          data: {
            userId: laporan.userId,
            jenis: "DAPAT_POIN",
            jumlah: poinDiperoleh,
            keterangan: `Laporan sampah (${laporan.berat} kg) disetujui`
          }
        }),
        prisma.poinReward.upsert({
          where: { userId: laporan.userId },
          update: { jumlah: { increment: poinDiperoleh } },
          create: { userId: laporan.userId, jumlah: poinDiperoleh }
        })
      ]);
    } else {
      await prisma.laporanSampah.update({
        where: { id },
        data: { status: newStatus as any },
      });
    }

    return { success: true, message: `Status laporan diperbarui menjadi ${newStatus}` };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return { success: false, message: "Laporan tidak ditemukan" };
    }
    return { success: false, message: "Terjadi kesalahan saat memperbarui status" };
  }
}
export async function tukarPoin(jumlah: number, keterangan: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };
    const userId = session.user.id as string;

    if (jumlah <= 0) return { success: false, message: "Jumlah poin tidak valid" };

    return await prisma.$transaction(async (tx) => {
      const poin = await tx.poinReward.findUnique({ where: { userId } });
      if (!poin || poin.jumlah < jumlah) {
        throw new Error("Poin tidak mencukupi");
      }

      await tx.poinReward.update({
        where: { userId },
        data: { jumlah: { decrement: jumlah } }
      });

      await tx.transaksi.create({
        data: { userId, jenis: "TUKAR_POIN", jumlah, keterangan }
      });

      return { success: true, message: "Berhasil menukarkan poin!" };
    });
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan saat menukar poin" };
  }
}

// Generate unique reference number for withdrawal receipt
function generateReferensi(): string {
  const prefix = "ECO";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function tarikSaldo(
  metode: "GOPAY" | "DANA" | "OVO" | "SHOPEEPAY",
  nomorTujuan: string,
  jumlahPoin: number
): Promise<ActionResult & { penarikanId?: string }> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Anda harus login terlebih dahulu" };
    const userId = session.user.id as string;

    if (jumlahPoin < 100) return { success: false, message: "Minimum penarikan adalah 100 poin" };
    if (!nomorTujuan || nomorTujuan.length < 10) return { success: false, message: "Nomor e-Wallet tidak valid" };

    const nominal = jumlahPoin * 100; // 1 poin = Rp 100

    return await prisma.$transaction(async (tx) => {
      const poin = await tx.poinReward.findUnique({ where: { userId } });
      if (!poin || poin.jumlah < jumlahPoin) {
        throw new Error("Poin tidak mencukupi");
      }

      // Potong poin
      await tx.poinReward.update({
        where: { userId },
        data: { jumlah: { decrement: jumlahPoin } }
      });

      // Catat transaksi keluar
      await tx.transaksi.create({
        data: {
          userId,
          jenis: "TUKAR_POIN",
          jumlah: jumlahPoin,
          keterangan: `Penarikan ke ${metode} (${nomorTujuan}) - Rp ${nominal.toLocaleString("id-ID")}`
        }
      });

      // Buat record penarikan
      const penarikan = await tx.penarikan.create({
        data: {
          userId,
          jumlahPoin,
          nominal,
          metode: metode as any,
          nomorTujuan,
          nomorReferensi: generateReferensi(),
        }
      });

      return { success: true, message: "Penarikan berhasil diajukan! Menunggu verifikasi Admin.", penarikanId: penarikan.id };
    });
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan saat penarikan" };
  }
}

export async function verifikasiPenarikan(
  penarikanId: string,
  approve: boolean
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, message: "Unauthorized" };
    
    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") return { success: false, message: "Anda tidak memiliki akses" };

    const penarikan = await prisma.penarikan.findUnique({ where: { id: penarikanId } });
    if (!penarikan) return { success: false, message: "Penarikan tidak ditemukan" };
    if (penarikan.status !== "PENDING") return { success: false, message: "Penarikan sudah diproses" };

    if (approve) {
      await prisma.penarikan.update({
        where: { id: penarikanId },
        data: {
          status: "BERHASIL",
          tanggalVerif: new Date(),
          adminId: session.user.id,
        }
      });
      return { success: true, message: `Penarikan ${penarikan.nomorReferensi} berhasil diverifikasi` };
    } else {
      // Tolak — kembalikan poin ke user
      await prisma.$transaction([
        prisma.penarikan.update({
          where: { id: penarikanId },
          data: { status: "GAGAL", tanggalVerif: new Date(), adminId: session.user.id }
        }),
        prisma.poinReward.update({
          where: { userId: penarikan.userId },
          data: { jumlah: { increment: penarikan.jumlahPoin } }
        }),
        prisma.transaksi.create({
          data: {
            userId: penarikan.userId,
            jenis: "DAPAT_POIN",
            jumlah: penarikan.jumlahPoin,
            keterangan: `Refund penarikan ${penarikan.nomorReferensi} (ditolak)`
          }
        })
      ]);
      return { success: true, message: `Penarikan ${penarikan.nomorReferensi} ditolak, poin dikembalikan` };
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Terjadi kesalahan" };
  }
}

