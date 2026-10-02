import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def add_bullet_item(doc, bold_text, normal_text):
    p = doc.add_paragraph(style='List Bullet')
    run = p.add_run(bold_text)
    run.bold = True
    p.add_run(f": {normal_text}")

def create_detailed_manual():
    doc = Document()
    
    # Custom Styles
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(11)

    # --- COVER PAGE ---
    doc.add_heading('USER MANUAL LENGKAP\nWEB PENGELOLAAN BANK SAMPAH DIGITAL\n(ECOTRACK)', 0).alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph('\nDisusun untuk melengkapi dokumentasi project aplikasi manajemen sampah dan transaksi e-wallet terintegrasi.\n', style='Normal').alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run('Nama Anda / Kelompok')
    run.font.size = Pt(14)
    run.font.bold = True
    
    doc.add_page_break()

    # --- BAB 1: PENDAHULUAN ---
    doc.add_heading('BAB I: PENDAHULUAN', level=1)
    
    doc.add_heading('1.1 Latar Belakang Masalah', level=2)
    doc.add_paragraph(
        "Pengelolaan sampah masih menjadi salah satu tantangan lingkungan terbesar di masyarakat. "
        "Banyak bank sampah konvensional yang beroperasi secara manual menggunakan buku catatan fisik. "
        "Hal ini sering menimbulkan masalah seperti: hilangnya data setoran, kurangnya transparansi saldo bagi nasabah, "
        "serta rendahnya motivasi warga karena tidak adanya insentif yang bisa dicairkan secara instan dan modern. "
        "Oleh karena itu, diperlukan sebuah platform digital yang dapat mencatat transaksi secara real-time dan terjamin akurasinya."
    )

    doc.add_heading('1.2 Tujuan Pembuatan Aplikasi', level=2)
    doc.add_paragraph(
        "Aplikasi EcoTrack dibangun dengan tujuan utama untuk:"
    )
    add_bullet_item(doc, "Mendigitalisasi Bank Sampah", "Mengubah pencatatan manual menjadi database PostgreSQL yang aman dan terpusat.")
    add_bullet_item(doc, "Meningkatkan Transparansi", "Warga dapat melihat langsung konversi sampah (Kg) menjadi Poin secara real-time di dasbor mereka.")
    add_bullet_item(doc, "Memberikan Reward Finansial Modern", "Mengintegrasikan sistem penarikan poin menjadi saldo E-Wallet (GoPay, DANA, OVO, ShopeePay) agar warga lebih termotivasi memilah sampah.")
    
    doc.add_heading('1.3 Alur Kerja Website (System Workflow)', level=2)
    doc.add_paragraph("Website ini beroperasi dengan alur transaksi dua arah antara Warga (User) dan Petugas (Admin):")
    add_bullet_item(doc, "Tahap 1 (Penyetoran)", "Warga login, mengisi form berat sampah, dan wajib mengunggah foto bukti sampah fisik.")
    add_bullet_item(doc, "Tahap 2 (Verifikasi Laporan)", "Admin menerima notifikasi, mengecek kesesuaian foto dengan berat yang dilaporkan. Jika sesuai, admin mengubah status menjadi 'Selesai'.")
    add_bullet_item(doc, "Tahap 3 (Auto-Reward)", "Begitu status 'Selesai', sistem secara otomatis (melalui trigger transaksi backend) menambahkan Poin ke akun warga (1 Kg = 10 Poin).")
    add_bullet_item(doc, "Tahap 4 (Request Penarikan)", "Warga menukarkan poin di halaman e-Wallet dengan memasukkan nomor HP (misal akun DANA). Poin warga akan dikurangi dan status penarikan menjadi 'Pending'.")
    add_bullet_item(doc, "Tahap 5 (Verifikasi Keuangan)", "Admin melihat request penarikan. Admin melakukan transfer uang riil ke nomor DANA warga. Setelah sukses, admin mengklik 'Setujui' di aplikasi dan sistem menerbitkan Nomor Referensi unik (ECO-XXX). Jika nomor rekening salah, admin mengklik 'Tolak', dan saldo poin akan otomatis dikembalikan (Refund) ke akun warga.")

    doc.add_page_break()

    # --- BAB 2: DESAIN & KEBUTUHAN ---
    doc.add_heading('BAB II: DESAIN & KEBUTUHAN SISTEM', level=1)
    
    doc.add_heading('2.1 Filosofi Warna', level=2)
    colors = [
        ("Emerald Green (#10B981)", "Melambangkan alam, kelestarian lingkungan, dan regenerasi kehidupan. Warna hijau zamrud ini merepresentasikan visi utama bank sampah untuk mewujudkan bumi yang bersih. Secara psikologis memberikan kesan kesegaran dan harapan."),
        ("Slate Dark (#0F172A)", "Melambangkan ketegasan, profesionalisme, dan kestabilan sistem. Pemilihan warna abu-abu gelap kebiruan memberikan kenyamanan visual saat membaca data transaksi, sekaligus mencerminkan keandalan sistem."),
        ("Frost White (#F8FAFC)", "Melambangkan kebersihan dan transparansi tata kelola. Menghadirkan ruang antarmuka yang bersih (clean space) agar pengguna dapat fokus pada navigasi utama tanpa distraksi."),
        ("Amber Gold (#F59E0B)", "Melambangkan nilai ekonomi dan penghargaan. Warna hangat ini digunakan pada ikon poin untuk memotivasi warga bahwa sampah mereka memiliki nilai tukar rupiah yang nyata."),
        ("Rose Red (#F43F5E)", "Warna merah tegas yang digunakan pada notifikasi error (salah password) dan aksi penolakan (Reject) dari admin. Memberikan sinyal visual instan agar pengguna berhati-hati.")
    ]
    for color, desc in colors:
        p = doc.add_paragraph()
        run = p.add_run(f"• {color}")
        run.bold = True
        p.add_run(f": {desc}")

    doc.add_heading('2.2 Kebutuhan Sumber Daya', level=2)
    table = doc.add_table(rows=1, cols=2)
    table.style = 'Table Grid'
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = 'Komponen'
    hdr_cells[1].text = 'Spesifikasi Minimum'
    
    specs = [
        ('Sistem Operasi', 'Windows 10/11, macOS, Linux, atau Android/iOS'),
        ('Web Browser', 'Google Chrome, Microsoft Edge, Safari, atau Mozilla Firefox'),
        ('Koneksi Internet', 'Jaringan Wi-Fi / Data Seluler (Stabil untuk upload foto sampah)'),
        ('Basis Data (Database)', 'PostgreSQL (Cloud Hosted via Neon.tech)'),
        ('Framework', 'Next.js 16 (React) dengan Prisma ORM')
    ]
    for comp, spec in specs:
        row_cells = table.add_row().cells
        row_cells[0].text = comp
        row_cells[1].text = spec

    doc.add_page_break()

    # --- BAB 3: MEMULAI APLIKASI ---
    doc.add_heading('BAB III: PANDUAN PENGGUNAAN (USER PANEL)', level=1)
    
    doc.add_heading('3.1 Halaman Login & Autentikasi', level=2)
    if os.path.exists('audit_desktop_login.png'):
        doc.add_picture('audit_desktop_login.png', width=Inches(6.0))
    
    doc.add_paragraph("Detail Komponen Halaman Login:")
    add_bullet_item(doc, "Input Email", "Kolom untuk memasukkan alamat email yang terdaftar. Sistem akan memvalidasi format email.")
    add_bullet_item(doc, "Input Password", "Kolom kata sandi yang disamarkan (masked).")
    add_bullet_item(doc, "Tombol Masuk", "Akan memicu fungsi validasi backend. Jika salah, muncul peringatan merah 'Invalid credentials'. Jika benar, sistem membaca 'Role' di database dan menentukan apakah user diarahkan ke dashboard Warga atau Admin.")

    doc.add_heading('3.2 Halaman Pendaftaran (Register)', level=2)
    if os.path.exists('audit_desktop_register.png'):
        doc.add_picture('audit_desktop_register.png', width=Inches(6.0))
    doc.add_paragraph("Detail Komponen Halaman Register:")
    add_bullet_item(doc, "Nama Lengkap", "Digunakan sebagai identitas resmi nasabah di sertifikat atau invoice.")
    add_bullet_item(doc, "Keamanan Hash", "Password yang diketik di sini tidak disimpan dalam bentuk teks biasa, melainkan dienkripsi (Hash SHA-256) oleh sistem Bcrypt sebelum masuk ke database demi keamanan standar industri.")

    doc.add_page_break()

    doc.add_heading('3.3 Dashboard Warga & Transaksi', level=2)
    if os.path.exists('audit_desktop_user_dashboard_clean.png'):
        doc.add_picture('audit_desktop_user_dashboard_clean.png', width=Inches(6.0))
    doc.add_paragraph("Detail Komponen Dashboard:")
    add_bullet_item(doc, "Kartu Saldo Poin", "Menampilkan saldo aktif secara real-time. Saldo ini adalah hasil kalkulasi masuk dan keluarnya poin dari database (Mirip sistem Double-Entry Ledger perbankan).")
    add_bullet_item(doc, "Widget Riwayat Terkini", "Menampilkan 5 aktivitas terakhir warga (laporan yang sedang diproses atau uang yang berhasil ditarik).")
    add_bullet_item(doc, "Tombol Cepat", "Terdapat shortcut langsung menuju E-Wallet atau Lapor Sampah.")

    doc.add_heading('3.4 Formulir Lapor Sampah (Upload)', level=2)
    if os.path.exists('audit_desktop_form_lapor.png'):
        doc.add_picture('audit_desktop_form_lapor.png', width=Inches(6.0))
    doc.add_paragraph("Prosedur Pelaporan:")
    add_bullet_item(doc, "Input Jenis & Berat", "Pengguna harus teliti memasukkan estimasi berat. Angka ini nantinya akan dikalikan 10 Poin oleh sistem (Contoh: 5 Kg = 50 Poin).")
    add_bullet_item(doc, "Unggah Foto Fisik", "Wajib melampirkan foto timbangan atau fisik sampah sebagai bukti validitas bagi admin.")
    
    doc.add_heading('3.5 Sistem E-Wallet & Penarikan', level=2)
    if os.path.exists('audit_desktop_ewallet.png'):
        doc.add_picture('audit_desktop_ewallet.png', width=Inches(6.0))
    doc.add_paragraph("Fitur ini adalah inti motivasi finansial warga. Cara kerjanya:")
    add_bullet_item(doc, "Pilih Metode Pembayaran", "Dropdown modern menyediakan opsi DANA, OVO, GoPay, dan ShopeePay.")
    add_bullet_item(doc, "Kalkulator Rupiah Otomatis", "Saat pengguna mengetik jumlah poin (misal: 100), sistem langsung menampilkan konversinya di layar (Estimasi: Rp 10.000). Hal ini memberikan transparansi penuh.")
    add_bullet_item(doc, "Proteksi Saldo Minus", "Sistem memblokir pengajuan jika jumlah poin yang ditarik melebihi sisa saldo.")

    doc.add_page_break()

    # --- BAB 4: ADMIN PANEL ---
    doc.add_heading('BAB IV: PANDUAN MANAJEMEN (ADMIN PANEL)', level=1)
    
    doc.add_heading('4.1 Dashboard Analitik Admin', level=2)
    if os.path.exists('audit_desktop_admin_top.png'):
        doc.add_picture('audit_desktop_admin_top.png', width=Inches(6.0))
    doc.add_paragraph("Tujuan utama Dashboard Admin adalah memantau kesehatan operasional bank sampah:")
    add_bullet_item(doc, "Filter Waktu", "Admin dapat memfilter data laporan berdasarkan Hari Ini, 7 Hari Terakhir, atau Semua Waktu untuk kebutuhan laporan rekapitulasi.")
    add_bullet_item(doc, "Tabel Manajemen Laporan", "Admin melihat antrean panjang laporan dari seluruh warga. Di sini terdapat tombol Aksi krusial.")
    
    doc.add_heading('4.2 Fungsi Transaksional: Verifikasi Sampah', level=2)
    doc.add_paragraph(
        "Fungsi tombol Update Status pada laporan sampah sangat vital. Ketika admin mengklik tombol centang hijau "
        "untuk mengubah status dari 'DIPROSES' menjadi 'SELESAI', sistem menjalankan Prisma $transaction di latar belakang yang melakukan dua hal sekaligus secara aman:\n"
        "1. Mengunci laporan agar tidak bisa diubah lagi.\n"
        "2. Menghasilkan 'Transaksi Masuk' dan menambah saldo poin warga secara presisi."
    )

    doc.add_heading('4.3 Manajemen Pencairan Dana (Verifikasi E-Wallet)', level=2)
    if os.path.exists('audit_desktop_admin_bottom.png'):
        doc.add_picture('audit_desktop_admin_bottom.png', width=Inches(6.0))
    doc.add_paragraph(
        "Admin bertanggung jawab atas arus kas (cash flow) pencairan poin warga ke uang riil. Fitur ini dirancang "
        "dengan keamanan tingkat tinggi untuk mencegah kebocoran poin:"
    )
    add_bullet_item(doc, "Aksi 'Setujui' (Approve)", "Jika admin telah mentransfer uang ke DANA warga, admin menekan tombol ini. Sistem akan menerbitkan Receipt/Bukti Transfer digital di akun warga dengan Nomor Referensi (Contoh: ECO-170942-A83). Status berubah menjadi 'BERHASIL'.")
    add_bullet_item(doc, "Aksi 'Tolak' (Reject/Refund)", "Jika nomor HP warga fiktif atau tidak terdaftar di GoPay/DANA, admin menekan 'Tolak'. Alih-alih menghapus data, sistem melakukan aksi Refund otomatis: status berubah menjadi 'GAGAL' dan poin yang sempat ditahan akan dikembalikan utuh ke saldo warga agar tidak ada yang merasa dirugikan.")
    add_bullet_item(doc, "History Mutasi", "Setiap penarikan tercatat permanen di sistem mutasi poin dan tidak bisa dihapus, menjamin auditability (dapat diaudit) oleh pihak ketiga.")

    doc.save('User_Manual_EcoTrack_Lengkap.docx')
    print("User_Manual_EcoTrack_Lengkap.docx successfully generated.")

if __name__ == '__main__':
    create_detailed_manual()
