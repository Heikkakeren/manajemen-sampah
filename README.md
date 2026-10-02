<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/recycle.svg" width="100" alt="EcoTrack Logo">
  
  # EcoTrack - Sistem Pengelolaan Sampah & e-Wallet
  
  **Sebuah platform inovatif untuk melacak, mengelola, dan mengonversi sampah menjadi saldo e-Wallet.**
</div>

<br/>

## 🌐 Live Preview Web

> **🔗 Link Website:** [https://manajemen-sampah-ecotrack.vercel.app](https://manajemen-sampah.vercel.app/) *(Klik untuk membuka)*

### 🔐 Akun Demo (Untuk Testing Dosen/Penilai)
Silakan gunakan email dan password di bawah ini untuk mencoba aplikasi secara langsung:

**Akses Admin Panel:**
- **Email:** `admin@sampah.id`
- **Password:** `12345`

**Akses Warga (User):**
- **Email:** `user@sampah.id`
- **Password:** `12345`

*(Atau Anda bisa membuat akun warga baru melalui menu **Register**).*

---

## 🚀 Fitur Utama
- **Pelaporan Sampah:** User dapat melapor sampah harian dan mengunggah foto.
- **Konversi Poin Otomatis:** Sistem otomatis menambah poin saat admin memverifikasi tumpukan sampah (1 Kg = 10 Poin).
- **Sistem e-Wallet:** User dapat mencairkan poin ke rekening GoPay, DANA, OVO, atau ShopeePay (Real-time Calculator).
- **Admin Dashboard:** Pantau analitik sampah, proses laporan, dan setujui penarikan uang.
- **Auto-Refund:** Jika penarikan e-wallet ditolak admin (nomor salah), saldo poin akan otomatis dikembalikan ke user.

## 💾 File Database
Basis data PostgreSQL lengkap beserta tabel dan transaksi (trigger/relasi) tersedia di file:
📁 [`basisdata_manajemen_sampah.sql`](basisdata_manajemen_sampah.sql)
