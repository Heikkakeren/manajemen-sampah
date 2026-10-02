import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def set_cell_margins(cell, top=0, bottom=0, start=0, end=0):
    pass # Helper placeholder if needed

def add_image_text_row(table, img_path, text_content):
    row = table.add_row()
    cell_img = row.cells[0]
    cell_text = row.cells[1]
    
    if os.path.exists(img_path):
        p = cell_img.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run().add_picture(img_path, width=Inches(3.0))
    else:
        cell_img.text = f"[Gambar {img_path} tidak ditemukan]"
        
    cell_text.text = text_content
    # Sesuaikan style teks di dalam tabel
    for paragraph in cell_text.paragraphs:
        paragraph.style.font.name = 'Arial'
        paragraph.style.font.size = Pt(10)

def create_final_manual():
    doc = Document()
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(11)

    # --- COVER PAGE ---
    doc.add_heading('USER MANUAL\nWEB PENGELOLAAN BANK SAMPAH DIGITAL\n(ECOTRACK)', 0).alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph('\nDisusun untuk melengkapi dokumentasi project aplikasi manajemen sampah dan transaksi e-wallet.\n', style='Normal').alignment = WD_ALIGN_PARAGRAPH.CENTER
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run('Muhammad Fathurrahman Wahid (19)')
    run.font.size = Pt(14)
    run.font.bold = True
    
    doc.add_page_break()

    # --- KEBUTUHAN SUMBER DAYA ---
    doc.add_heading('Kebutuhan Sumber Daya', level=1)
    table = doc.add_table(rows=1, cols=2)
    table.style = 'Table Grid'
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = 'Komponen'
    hdr_cells[1].text = 'Spesifikasi Minimum'
    specs = [
        ('Sistem Operasi', 'Windows 10/11, macOS, Linux, atau Android/iOS'),
        ('Web Browser', 'Google Chrome, Microsoft Edge, Safari, atau Mozilla Firefox'),
        ('Koneksi Internet', 'Jaringan Wi-Fi / Data Seluler (Minimal 512 Kbps)'),
        ('Hak Akses User', 'Akun Warga (Nasabah) atau Akun Petugas (Admin)')
    ]
    for comp, spec in specs:
        row_cells = table.add_row().cells
        row_cells[0].text = comp
        row_cells[1].text = spec

    doc.add_page_break()

    # --- 1. MEMULAI APLIKASI ---
    doc.add_heading('1. Memulai Aplikasi', level=1)
    doc.add_paragraph("Ketika pengguna pertama kali mengakses aplikasi, sistem akan menampilkan halaman Login. Terdapat navigasi untuk berpindah ke halaman Register bagi warga baru.")
    
    doc.add_heading('1.1 Halaman Login', level=2)
    if os.path.exists('audit_desktop_login.png'):
        doc.add_picture('audit_desktop_login.png', width=Inches(6.0))
    doc.add_paragraph("\nKomponen / Elemen pada Halaman:")
    
    table_login = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_login, 'crop_login.png', 
        "Formulir Login Utama:\n\n"
        "1. Input Email: Pengguna memasukkan email yang terdaftar.\n"
        "2. Input Password: Kata sandi akan disamarkan.\n"
        "3. Tombol Masuk: Sistem akan memvalidasi ke database. Jika salah, muncul notifikasi error merah. Jika berhasil, sistem otomatis membaca role pengguna (Admin/Warga) dan mengarahkan ke dashboard yang tepat."
    )

    doc.add_heading('1.2 Halaman Register', level=2)
    if os.path.exists('audit_desktop_register.png'):
        doc.add_picture('audit_desktop_register.png', width=Inches(6.0))
    doc.add_paragraph("\nKomponen / Elemen pada Halaman:")
    
    table_register = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_register, 'crop_register.png', 
        "Formulir Pendaftaran Warga Baru:\n\n"
        "1. Nama Lengkap: Digunakan sebagai identitas resmi di sistem.\n"
        "2. Keamanan Tingkat Tinggi: Password dienkripsi menggunakan metode Hash SHA-256 (Bcrypt) sebelum disimpan ke dalam database PostgreSQL, sehingga data terjamin aman.\n"
        "3. Tombol Daftar: Jika berhasil, pengguna langsung diarahkan ke Dashboard Warga."
    )

    doc.add_page_break()

    # --- 2. WARGA PANEL ---
    doc.add_heading('2. Warga Panel', level=1)
    
    doc.add_heading('2.1 Dashboard Warga', level=2)
    if os.path.exists('audit_desktop_user_dashboard_clean.png'):
        doc.add_picture('audit_desktop_user_dashboard_clean.png', width=Inches(6.0))
    doc.add_paragraph("\nKomponen / Elemen pada Halaman:")
    
    table_dash = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_dash, 'crop_saldo.png', 
        "Kartu Indikator Utama:\n\n"
        "1. Saldo Poin: Diambil secara dinamis dari database hasil setoran sampah warga. \n"
        "2. Total Sampah (Kg) & Poin Masuk: Riwayat kalkulasi akumulatif.\n"
        "3. Tombol 'Buka E-Wallet': Jalan pintas menuju halaman penarikan dana tunai."
    )
    add_image_text_row(table_dash, 'crop_riwayat_warga.png', 
        "Tabel Histori Transaksi Terakhir:\n\n"
        "Menampilkan rincian transaksi penukaran atau setoran warga secara transparan, lengkap dengan status terkini."
    )

    doc.add_heading('2.2 Tutorial & Edukasi Interaktif (Promo Pop-up)', level=2)
    doc.add_paragraph("Saat warga pertama kali masuk ke Dashboard, sistem akan menampilkan jendela Pop-up interaktif. Fitur ini berfungsi sebagai on-boarding untuk mengedukasi warga tentang cara kerja bank sampah digital.")
    
    table_popup = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_popup, 'crop_popup_1.png', 
        "Langkah 1: Kumpulkan Poin\n\n"
        "Menjelaskan rasio nilai tukar dasar bahwa setiap menyetorkan 1 Kg sampah, warga akan otomatis mendapatkan 10 Poin. Dilengkapi animasi maskot bumi yang interaktif."
    )
    add_image_text_row(table_popup, 'crop_popup_2.png', 
        "Langkah 2: Penarikan ke E-Wallet\n\n"
        "Mengedukasi warga bahwa poin yang terkumpul tidak hanya menjadi angka mati, melainkan bisa dicairkan langsung ke saldo GoPay, DANA, OVO, atau ShopeePay."
    )
    add_image_text_row(table_popup, 'crop_popup_3.png', 
        "Langkah 3: Call to Action\n\n"
        "Halaman penutup dari tutorial yang berisi ajakan (Call to Action) 'Lapor Sekarang!' yang jika diklik akan langsung mengarahkan warga ke formulir pelaporan sampah."
    )

    doc.add_heading('2.3 Formulir Lapor Sampah', level=2)
    if os.path.exists('audit_desktop_form_lapor.png'):
        doc.add_picture('audit_desktop_form_lapor.png', width=Inches(6.0))
    doc.add_paragraph("\nKomponen / Elemen pada Halaman:")
    
    table_lapor = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_lapor, 'crop_form_lapor.png', 
        "Formulir Setoran Digital:\n\n"
        "1. Input Berat (Kg): Ketelitian input berat sangat krusial karena akan dikalikan oleh sistem menjadi poin (1 Kg = 10 Poin).\n"
        "2. Bukti Foto Fisik: Warga wajib memotret/mengunggah foto tumpukan sampah atau hasil timbangan fisik untuk divalidasi admin.\n"
        "3. Tombol Kirim: Mengunci laporan dan mengirimkannya ke antrean dasbor admin."
    )

    doc.add_heading('2.3 Penukaran E-Wallet', level=2)
    if os.path.exists('audit_desktop_ewallet.png'):
        doc.add_picture('audit_desktop_ewallet.png', width=Inches(6.0))
    doc.add_paragraph("\nKomponen / Elemen pada Halaman:")
    
    table_ewallet = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_ewallet, 'crop_ewallet_kalkulator.png', 
        "Kalkulator Konversi Real-time:\n\n"
        "1. Pilihan Metode: Warga bisa memilih e-Wallet (DANA, GoPay, dll).\n"
        "2. Input Nomor HP & Jumlah Poin: Sistem secara pintar langsung mengonversi Poin menjadi Rupiah (Misal 100 Poin = Rp 10.000).\n"
        "3. Validasi Saldo: Sistem menolak jika poin yang ditarik melebihi saldo."
    )
    add_image_text_row(table_ewallet, 'crop_ewallet_riwayat.png', 
        "Riwayat Penarikan (Withdrawal):\n\n"
        "Daftar permohonan penarikan uang yang diajukan beserta status persetujuan dari pihak Bank Sampah (Pending, Berhasil, atau Gagal)."
    )

    doc.add_page_break()

    # --- 3. ADMIN PANEL ---
    doc.add_heading('3. Admin Panel', level=1)
    
    doc.add_heading('3.1 Dashboard & Verifikasi Laporan Sampah', level=2)
    if os.path.exists('audit_desktop_admin_top.png'):
        doc.add_picture('audit_desktop_admin_top.png', width=Inches(6.0))
    doc.add_paragraph("\nKomponen / Elemen pada Halaman:")
    
    table_admin_top = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_admin_top, 'crop_admin_dashboard.png', 
        "Kartu Analitik Bank Sampah:\n\n"
        "Menampilkan ringkasan total seluruh sampah (Kg) yang terkumpul dari seluruh warga, serta jumlah nasabah aktif dan Poin yang beredar."
    )
    add_image_text_row(table_admin_top, 'crop_admin_table.png', 
        "Tabel Verifikasi & Update Status Laporan:\n\n"
        "Admin melihat foto dan berat laporan warga. Ketika tombol status diubah menjadi 'Selesai', sistem backend akan menjalankan transaksi aman (Prisma $transaction) yang otomatis menambahkan saldo Poin warga tanpa perlu input manual."
    )

    doc.add_heading('3.2 Verifikasi Pencairan Dana', level=2)
    if os.path.exists('audit_desktop_admin_bottom.png'):
        doc.add_picture('audit_desktop_admin_bottom.png', width=Inches(6.0))
    doc.add_paragraph("\nKomponen / Elemen pada Halaman:")
    
    table_admin_bot = doc.add_table(rows=0, cols=2)
    add_image_text_row(table_admin_bot, 'crop_admin_verifikasi.png', 
        "Manajemen Kas & Refund Poin Otomatis:\n\n"
        "1. Tombol Setujui: Jika transfer uang ke DANA/GoPay sukses, admin klik Setujui. Sistem membuat nomor referensi bukti (contoh ECO-992).\n"
        "2. Tombol Tolak: Jika nomor HP warga salah, admin menolak laporan. Canggihnya, sistem akan otomatis melakukan REFUND (mengembalikan poin yang terpotong ke saldo warga) agar warga tidak dirugikan."
    )

    doc.save('User_Manual_EcoTrack_Visual_Final.docx')
    print("User_Manual_EcoTrack_Visual_Final.docx successfully generated.")

if __name__ == '__main__':
    create_final_manual()
