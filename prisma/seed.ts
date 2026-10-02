import { PrismaClient, Role, TipeUser, TipeInstitusi } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

async function main() {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  console.log("🌱 Memulai seeding database...");

  // Seed Admin User
  const hashedPassword = await hash("12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sampah.id" },
    update: {},
    create: {
      nama: "Administrator",
      email: "admin@sampah.id",
      password: hashedPassword,
      noHp: "081234567890",
      nik: "3201010101010001",
      role: Role.ADMIN,
      tipe: TipeUser.KANTOR,
    },
  });
  console.log(`✅ Admin dibuat: ${admin.nama} (${admin.email})`);

  // Seed JenisSampah
  const jenisSampahData = [
    "Organik",
    "Anorganik",
    "B3",
    "Kertas",
    "Plastik",
    "Kaca",
    "Logam",
    "Elektronik",
  ];

  for (const namaJenis of jenisSampahData) {
    await prisma.jenisSampah.upsert({
      where: { namaJenis },
      update: {},
      create: { namaJenis },
    });
  }
  console.log(`✅ ${jenisSampahData.length} Jenis Sampah dibuat`);

  // Seed Wilayah
  const wilayahData = ["Jakarta", "Bandung", "Surabaya"];

  const wilayahMap: Record<string, string> = {};
  for (const namaWilayah of wilayahData) {
    const w = await prisma.wilayah.upsert({
      where: { namaWilayah },
      update: {},
      create: { namaWilayah },
    });
    wilayahMap[namaWilayah] = w.id;
  }
  console.log(`✅ ${wilayahData.length} Wilayah dibuat`);

  // Seed Institusi
  const institusiData: {
    nama: string;
    tipe: TipeInstitusi;
    wilayah: string;
  }[] = [
    // === JAKARTA ===
    { nama: "SMAN 1 Jakarta", tipe: TipeInstitusi.SEKOLAH, wilayah: "Jakarta" },
    { nama: "SMAN 6 Jakarta", tipe: TipeInstitusi.SEKOLAH, wilayah: "Jakarta" },
    { nama: "SMKN 1 Jakarta", tipe: TipeInstitusi.SEKOLAH, wilayah: "Jakarta" },
    { nama: "SMKN 26 Jakarta", tipe: TipeInstitusi.SEKOLAH, wilayah: "Jakarta" },
    { nama: "SMPN 1 Jakarta", tipe: TipeInstitusi.SEKOLAH, wilayah: "Jakarta" },
    { nama: "SDN Menteng 01", tipe: TipeInstitusi.SEKOLAH, wilayah: "Jakarta" },
    { nama: "Universitas Indonesia", tipe: TipeInstitusi.SEKOLAH, wilayah: "Jakarta" },
    { nama: "Kantor Walikota Jakarta Pusat", tipe: TipeInstitusi.KANTOR, wilayah: "Jakarta" },
    { nama: "Kantor Gubernur DKI Jakarta", tipe: TipeInstitusi.KANTOR, wilayah: "Jakarta" },
    { nama: "RSUPN Dr. Cipto Mangunkusumo", tipe: TipeInstitusi.FASILITAS_UMUM, wilayah: "Jakarta" },
    { nama: "Puskesmas Gambir", tipe: TipeInstitusi.FASILITAS_UMUM, wilayah: "Jakarta" },
    { nama: "Stasiun Gambir", tipe: TipeInstitusi.FASILITAS_UMUM, wilayah: "Jakarta" },
    { nama: "Perumahan Taman Sari Indah", tipe: TipeInstitusi.PERUMAHAN, wilayah: "Jakarta" },

    // === BANDUNG ===
    { nama: "SMAN 3 Bandung", tipe: TipeInstitusi.SEKOLAH, wilayah: "Bandung" },
    { nama: "SMAN 5 Bandung", tipe: TipeInstitusi.SEKOLAH, wilayah: "Bandung" },
    { nama: "SMKN 1 Bandung", tipe: TipeInstitusi.SEKOLAH, wilayah: "Bandung" },
    { nama: "SMKN 4 Bandung", tipe: TipeInstitusi.SEKOLAH, wilayah: "Bandung" },
    { nama: "Institut Teknologi Bandung", tipe: TipeInstitusi.SEKOLAH, wilayah: "Bandung" },
    { nama: "Universitas Padjadjaran", tipe: TipeInstitusi.SEKOLAH, wilayah: "Bandung" },
    { nama: "Kantor Gubernur Jawa Barat", tipe: TipeInstitusi.KANTOR, wilayah: "Bandung" },
    { nama: "Kantor Walikota Bandung", tipe: TipeInstitusi.KANTOR, wilayah: "Bandung" },
    { nama: "RS Hasan Sadikin", tipe: TipeInstitusi.FASILITAS_UMUM, wilayah: "Bandung" },
    { nama: "Pasar Baru Bandung", tipe: TipeInstitusi.FASILITAS_UMUM, wilayah: "Bandung" },
    { nama: "Perumahan Dago Pakar Raya", tipe: TipeInstitusi.PERUMAHAN, wilayah: "Bandung" },

    // === SURABAYA ===
    { nama: "SMAN 5 Surabaya", tipe: TipeInstitusi.SEKOLAH, wilayah: "Surabaya" },
    { nama: "SMAN 15 Surabaya", tipe: TipeInstitusi.SEKOLAH, wilayah: "Surabaya" },
    { nama: "SMKN 1 Surabaya", tipe: TipeInstitusi.SEKOLAH, wilayah: "Surabaya" },
    { nama: "Institut Teknologi Sepuluh Nopember", tipe: TipeInstitusi.SEKOLAH, wilayah: "Surabaya" },
    { nama: "Universitas Airlangga", tipe: TipeInstitusi.SEKOLAH, wilayah: "Surabaya" },
    { nama: "Kantor Walikota Surabaya", tipe: TipeInstitusi.KANTOR, wilayah: "Surabaya" },
    { nama: "RSUD Dr. Soetomo", tipe: TipeInstitusi.FASILITAS_UMUM, wilayah: "Surabaya" },
    { nama: "Tunjungan Plaza", tipe: TipeInstitusi.FASILITAS_UMUM, wilayah: "Surabaya" },
    { nama: "Perumahan Pakuwon City", tipe: TipeInstitusi.PERUMAHAN, wilayah: "Surabaya" },
  ];

  for (const inst of institusiData) {
    await prisma.institusi.upsert({
      where: { nama: inst.nama },
      update: {},
      create: {
        nama: inst.nama,
        tipe: inst.tipe,
        wilayahId: wilayahMap[inst.wilayah],
      },
    });
  }
  console.log(`✅ ${institusiData.length} Institusi dibuat`);

  console.log("🎉 Seeding selesai!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error saat seeding:", e);
  process.exit(1);
});
