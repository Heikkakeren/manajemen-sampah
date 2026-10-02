from PIL import Image
import os

def crop_image(input_path, output_path, box):
    if os.path.exists(input_path):
        try:
            im = Image.open(input_path)
            cr = im.crop(box)
            cr.save(output_path)
            print(f"Success cropping {output_path}")
        except Exception as e:
            print(f"Error cropping {input_path}: {e}")
    else:
        print(f"File {input_path} not found.")

# Format box: (left, upper, right, lower) - Resolusi asal 1280x900
crops = [
    ('audit_desktop_login.png', 'crop_login.png', (420, 150, 860, 650)),
    ('audit_desktop_register.png', 'crop_register.png', (420, 100, 860, 800)),
    ('audit_desktop_user_dashboard_clean.png', 'crop_saldo.png', (230, 80, 1050, 250)),
    ('audit_desktop_user_dashboard_clean.png', 'crop_riwayat_warga.png', (230, 270, 1050, 600)),
    ('audit_desktop_form_lapor.png', 'crop_form_lapor.png', (300, 120, 980, 820)),
    ('audit_desktop_ewallet.png', 'crop_ewallet_kalkulator.png', (230, 80, 1050, 350)),
    ('audit_desktop_ewallet.png', 'crop_ewallet_riwayat.png', (230, 370, 1050, 700)),
    ('audit_desktop_admin_top.png', 'crop_admin_dashboard.png', (230, 80, 1050, 350)),
    ('audit_desktop_admin_top.png', 'crop_admin_table.png', (230, 380, 1050, 800)),
    ('audit_desktop_admin_bottom.png', 'crop_admin_verifikasi.png', (230, 200, 1050, 750))
]

for img_in, img_out, box in crops:
    crop_image(img_in, img_out, box)
