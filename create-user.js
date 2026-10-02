require("dotenv").config();
const { hash } = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

async function main() {
  const connStr = process.env.DATABASE_URL;
  console.log("Connecting to:", connStr ? "DB found" : "DB NOT FOUND");
  
  const adapter = new PrismaPg({ connectionString: connStr });
  const prisma = new PrismaClient({ adapter });

  const pw = await hash("12345", 12);

  const user = await prisma.user.upsert({
    where: { email: "user@sampah.id" },
    update: {},
    create: {
      nama: "Pengguna Biasa",
      email: "user@sampah.id",
      password: pw,
      noHp: "081299998888",
      nik: "3201020304050006",
      role: "USER",
      tipe: "RUMAH_TANGGA",
    },
  });

  console.log("User dibuat:", user.nama, user.email);
  await prisma.$disconnect();
}

main().catch(console.error);
