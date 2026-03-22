"""
Photo classifier and optimizer for TAPIPOCITOS website.
Reads raw photos, resizes to max 1200px wide, saves as optimized JPEG,
and creates a catalog.json mapping each photo to its category.
"""

import os
import json
import shutil
from PIL import Image

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "fotos-raw")
OUTPUT_DIR = os.path.join(BASE_DIR, "fotos")

# Output subdirectories
CATEGORIES = {
    "sofas": "sofas",
    "sillas": "sillas",
    "sillones": "sillones",
    "restauraciones": "restauraciones",
    "taller": "taller",
    "familia": "familia",
}

# ============================================================
# CLASSIFICATION MAP
# Each entry: (source_filename, category, descriptive_output_name, source_subdir)
#   source_subdir: None = fotos-raw root, "familia" or "familia2" = subdirs
# ============================================================

CLASSIFICATIONS = [
    # ── SOFAS ──────────────────────────────────────────────────
    # Gray L-shaped sofa in workshop
    ("03570ead-f623-4ba0-8c78-d8c85ca72e52.jpg", "sofas", "sofa-esquinero-gris-taller", None),
    # Gray corner sofa with wood base, delivered in home
    ("05a0a3fb-06f7-42c3-a4ab-14f8aa344336.jpg", "sofas", "sofa-esquinero-gris-base-madera", None),
    # Gray L-shaped sofa with pillows, delivered
    ("06ee2b6b-0ff0-467f-969b-cbe9d18945c0.jpg", "sofas", "sofa-esquinero-gris-almohadones", None),
    # Yellow/mustard 2-seat sofa in workshop
    ("115c4780-4c69-4381-84be-4bf9d27d69ce.jpg", "sofas", "sofa-dos-cuerpos-mostaza", None),
    # Blue sofa with wood base, in home
    ("13345cb0-d767-4e77-afc0-df35070abf92.jpg", "sofas", "sofa-azul-base-madera-hogar", None),
    # Gray sofa with ottoman, wood base
    ("13a3292c-a3a9-4da4-9085-c1f2476b8e3e.jpg", "sofas", "sofa-gris-con-ottoman-exterior", None),
    # Dark gray L-shaped sofa with decorative pillows, workshop
    ("20160624_171314_HDR.jpg", "sofas", "sofa-esquinero-oscuro-almohadones-etnicos", None),
    # Beige sofa with orange pillows, contrast piping, workshop
    ("20160818_100026.jpg", "sofas", "sofa-beige-vivo-contrastante-naranja", None),
    # Beige classic sofa with rolled arms, workshop
    ("20160819_131443.jpg", "sofas", "sofa-clasico-beige-brazos-curvos", None),
    # Teal/turquoise L-shaped sofa, delivered in home
    ("20160915_141711.jpg", "sofas", "sofa-esquinero-turquesa-hogar", None),
    # White/cream L-shaped sofa in workshop
    ("25192e0c-1416-4ce6-ab35-c0cfd5ec59db.jpg", "sofas", "sofa-esquinero-blanco-taller", None),
    # Large gray L-shaped sofa with wood base, workshop
    ("44e86e50-1d9d-4a6e-8015-3cd71388cfac.jpg", "sofas", "sofa-esquinero-gris-grande-base-madera", None),
    # White L-shaped sofa with gray/beige pillows, workshop
    ("4ba97386-6329-43e8-8cf2-cfe64dba517d.jpg", "sofas", "sofa-esquinero-blanco-almohadones-grises", None),
    # Large beige L-shaped sofa with ottoman, upscale home
    ("4c40435b-337b-41fa-b2eb-a2ac0e4bbbaa.jpg", "sofas", "sofa-esquinero-beige-ottoman-hogar", None),
    # Gray L-shaped sofa with wood base, delivered in home
    ("5c2c2972-0d0f-455b-9371-364d56c9b2f0.jpg", "sofas", "sofa-esquinero-gris-hogar-living", None),
    # White/cream L-shaped sofa with ottoman, workshop
    ("89dfe547-cb74-4617-95e7-387a4e735503.jpg", "sofas", "sofa-esquinero-crema-ottoman-taller", None),
    # Turquoise/aqua L-shaped sofa, workshop
    ("970496a5-122e-447e-8ea6-5c2d132f1217.jpg", "sofas", "sofa-esquinero-aqua-taller", None),
    # White sofa on sawhorses, outdoor
    ("IMG_20211117_124742.jpg", "sofas", "sofa-blanco-exterior", None),
    # Dark gray sofa with pillows, delivered in home with dog
    ("IMG_2721.jpg", "sofas", "sofa-gris-oscuro-hogar", None),
    # Beige/tan L-shaped sofa with nailhead trim, workshop
    ("PHOTO-2022-11-18-09-24-25.jpg", "sofas", "sofa-esquinero-beige-tachas", None),
    # Green 2-seat sofa with wood base, workshop
    ("PHOTO-2022-11-18-09-19-20.jpg", "sofas", "sofa-dos-cuerpos-verde-base-madera", None),
    # White/cream sofa with ottoman, workshop (different angle)
    ("a75bc8c6-c3a7-4566-ac2c-6d140a6c4486.jpg", "sofas", "sofa-crema-ottoman-vista-lateral", None),
    # Gray L-shaped sofa delivered, close-up angle
    ("aca7fa23-72d2-42d2-8c4f-60132ca842d3.jpg", "sofas", "sofa-esquinero-gris-hogar-detalle", None),
    # White slipcovered L-shaped sofa with gray pillows, workshop
    ("ad33f07a-c9af-418a-a627-38a8fba5f14e.jpg", "sofas", "sofa-esquinero-funda-blanca", None),
    # Gray sofa with ottoman outdoors (different angle)
    ("bddebc99-c230-4dcd-8083-d1b3c9253732.jpg", "sofas", "sofa-gris-ottoman-vista-frontal", None),
    # Beige/tan L-shaped sofa with chaise, workshop
    ("be386bb6-065c-4b13-a56e-fe83f1555569.jpg", "sofas", "sofa-esquinero-beige-chaise", None),
    # Gray L-shaped small sofa, workshop
    ("c4839014-3f8f-4147-a70a-f6de3fb4748d.jpg", "sofas", "sofa-esquinero-gris-compacto", None),
    # Dark gray sofa with blue pillows and ottoman, wood base, workshop
    ("d434a1c1-cce8-4b27-972e-335e003d080d.jpg", "sofas", "sofa-gris-oscuro-almohadones-azules", None),
    # Large beige U-shaped sofa, delivered in home
    ("d4ad3b33-0be1-47c7-b067-2746802061c2.jpg", "sofas", "sofa-u-beige-hogar-moderno", None),
    # Gray L-shaped sofa with wood base, delivered
    ("d501a3bc-db95-44e0-960e-86c44d4ab706.jpg", "sofas", "sofa-esquinero-gris-mesas-redondas", None),
    # Gray L-shaped sofa with chaise, workshop
    ("d8e361fa-907c-4461-8040-227351d41a21.jpg", "sofas", "sofa-esquinero-gris-chaise-taller", None),
    # Green 2-seat sofa with wood base, workshop (best angle)
    ("df32909d-4119-4d82-bcee-415f176c9f4c.jpg", "sofas", "sofa-dos-cuerpos-verde-frontal", None),
    # Gray L-shaped sofa, workshop
    ("e4aa4397-2f11-4ebd-abcc-d5fc78ef8ae7.jpg", "sofas", "sofa-esquinero-gris-taller-2", None),
    # Dark blue/navy L-shaped sofa with wood base, workshop
    ("ebb35db9-cd54-4380-be22-3e46b3148421.jpg", "sofas", "sofa-esquinero-azul-marino-base-madera", None),

    # ── RESTAURACION ──────────────────────────────────────────
    # Chesterfield leather sofa being restored, tufting strings visible
    ("20160912_132705.jpg", "restauraciones", "restauracion-chesterfield-cuero-1", None),
    # Same Chesterfield restoration, different angle
    ("20160912_132707.jpg", "restauraciones", "restauracion-chesterfield-cuero-2", None),

    # ── FAMILIA ───────────────────────────────────────────────
    # Four men posing outdoors at Parador
    ("20241006_143117.jpg", "familia", "familia-grupo-hombres-parador", "familia"),
    # Pablo Calistro seated with daughters Rosana and Mariela
    ("IMG_4142.jpg", "familia", "pablo-calistro-con-hijas", "familia"),
    # Pablo Calistro and esposa retrato
    ("IMG_5181.jpg", "familia", "pablo-y-esposa-retrato", "familia"),
    # Leonardo Marinolli birthday party, hands forward
    ("IMG_6826.jpg", "familia", "leonardo-marinolli-cumpleanos", "familia"),
    # Pablo y esposa en restaurante
    ("IMG_7272.jpg", "familia", "pablo-y-esposa-restaurante", "familia"),
    # Grupo familiar nocturno
    ("IMG_7314.jpg", "familia", "familia-grupo-noche", "familia"),
    # Pareja en fiesta, celebracion
    ("IMG_8483.jpg", "familia", "familia-celebracion-fiesta", "familia"),

    # Familia2 - Leonardo y familia
    # Tres hombres en Parador Fito
    ("20241006_143051.jpg", "familia", "leonardo-grupo-parador-fito", "familia2"),
    # Leonardo y pareja selfie playa 1
    ("6333924d-df72-4d1a-a263-db8c1c2f121a.jpg", "familia", "leonardo-pareja-playa-1", "familia2"),
    # Leonardo y pareja selfie playa 2
    ("e9f6d171-680e-4985-b70b-3a6021fd73bc.jpg", "familia", "leonardo-pareja-playa-2", "familia2"),
    # Familia grupo en jardin
    ("ef551bb4-c4d9-42c0-955b-4cd67071c723.jpg", "familia", "familia-grupo-jardin", "familia2"),
]

# Files to skip (duplicates, MP4 videos, not useful)
SKIP_FILES = [
    # MP4 videos
    "IMG_2721.MP4",
    "IMG_2732.MP4",
    # Duplicates
    "20160915_141729.jpg",          # duplicate of teal sofa 20160915_141711
    "IMG_2732.jpg",                 # duplicate of dark gray sofa IMG_2721
    "PHOTO-2022-11-18-09-18-58.jpg",  # duplicate of gray L sofa 5c2c2972
    "PHOTO-2022-11-18-09-19-09.jpg",  # duplicate of gray L sofa 03570ead
    "PHOTO-2022-11-18-09-19-19.jpg",  # duplicate of gray L sofa 44e86e50
    "PHOTO-2022-11-18-09-19-27(1).jpg",  # duplicate of mustard sofa 115c4780
    "PHOTO-2022-11-18-09-19-27.jpg",  # duplicate of turquoise sofa 970496a5
    "cbbc58d2-eced-47bc-8823-d13021592824.jpg",  # duplicate of green sofa df32909d
]


def process_image(src_path, dst_path, max_width=1200, quality=80):
    """Open image, resize to max_width maintaining aspect ratio, save optimized JPEG."""
    try:
        img = Image.open(src_path)

        # Handle EXIF rotation
        try:
            from PIL import ImageOps
            img = ImageOps.exif_transpose(img)
        except Exception:
            pass

        # Convert to RGB if necessary (for PNG with alpha, etc.)
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")

        # Resize if wider than max_width
        w, h = img.size
        if w > max_width:
            ratio = max_width / w
            new_h = int(h * ratio)
            img = img.resize((max_width, new_h), Image.LANCZOS)

        # Save optimized
        img.save(dst_path, "JPEG", quality=quality, optimize=True)
        final_size = img.size
        file_size_kb = os.path.getsize(dst_path) / 1024
        print(f"  -> {os.path.basename(dst_path)} ({final_size[0]}x{final_size[1]}, {file_size_kb:.0f}KB)")
        return final_size
    except Exception as e:
        print(f"  ERROR processing {src_path}: {e}")
        return None


def main():
    # Create output directories
    for cat_dir in CATEGORIES.values():
        dir_path = os.path.join(OUTPUT_DIR, cat_dir)
        os.makedirs(dir_path, exist_ok=True)
        print(f"Created directory: {dir_path}")

    catalog = []
    counters = {cat: 0 for cat in CATEGORIES}

    print(f"\nProcessing {len(CLASSIFICATIONS)} photos...\n")

    for src_file, category, desc_name, subdir in CLASSIFICATIONS:
        # Build source path
        if subdir:
            src_path = os.path.join(RAW_DIR, subdir, src_file)
        else:
            src_path = os.path.join(RAW_DIR, src_file)

        if not os.path.exists(src_path):
            print(f"  WARNING: Source file not found: {src_path}")
            continue

        # Build destination path
        dst_filename = f"{desc_name}.jpg"
        dst_path = os.path.join(OUTPUT_DIR, category, dst_filename)

        print(f"[{category}] {src_file}")
        dimensions = process_image(src_path, dst_path)

        if dimensions:
            counters[category] = counters.get(category, 0) + 1
            catalog.append({
                "filename": dst_filename,
                "category": category,
                "descriptive_name": desc_name,
                "path": f"fotos/{category}/{dst_filename}",
                "original_file": src_file,
                "width": dimensions[0],
                "height": dimensions[1],
            })

    # Write catalog.json
    catalog_path = os.path.join(OUTPUT_DIR, "catalog.json")
    with open(catalog_path, "w", encoding="utf-8") as f:
        json.dump({
            "total": len(catalog),
            "categories": {cat: counters[cat] for cat in CATEGORIES},
            "photos": catalog,
        }, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}")
    print(f"DONE! Processed {len(catalog)} photos.")
    print(f"Catalog written to: {catalog_path}")
    print(f"\nBreakdown by category:")
    for cat, count in counters.items():
        print(f"  {cat}: {count}")
    print(f"\nSkipped {len(SKIP_FILES)} files (duplicates/videos)")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
