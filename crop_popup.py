from PIL import Image
import os

def crop_popup(input_path, output_path):
    if os.path.exists(input_path):
        try:
            im = Image.open(input_path)
            # Asumsi layar 1280x900, popup di tengah. Kita ambil kotak tengahnya.
            box = (350, 150, 930, 700) 
            cr = im.crop(box)
            cr.save(output_path)
            print(f"Success cropping {output_path}")
        except Exception as e:
            print(f"Error: {e}")

crop_popup('ss_popup_step1.png', 'crop_popup_1.png')
crop_popup('ss_popup_step2.png', 'crop_popup_2.png')
crop_popup('ss_popup_step3.png', 'crop_popup_3.png')
