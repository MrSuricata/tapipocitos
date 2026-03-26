-- =====================================================
-- TAPIPOCITOS - Setup de base de datos Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- =====================================================

-- Tabla de productos (piezas únicas a medida)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  material TEXT NOT NULL DEFAULT '',
  color TEXT DEFAULT '',
  dimensions TEXT DEFAULT '',
  price TEXT DEFAULT 'Consultar',
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT NOT NULL DEFAULT 'Sofás',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de trabajos/proyectos realizados
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Sofás',
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  materials TEXT[] DEFAULT ARRAY[]::TEXT[],
  client TEXT DEFAULT '',
  completed_date TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de testimonios
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  date TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Lectura pública (cualquiera puede ver los datos)
CREATE POLICY "Lectura publica productos" ON products FOR SELECT USING (true);
CREATE POLICY "Lectura publica proyectos" ON projects FOR SELECT USING (true);
CREATE POLICY "Lectura publica testimonios" ON testimonials FOR SELECT USING (true);

-- Escritura solo con service_role key (desde el servidor)
CREATE POLICY "Admin escribe productos" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin actualiza productos" ON products FOR UPDATE USING (true);
CREATE POLICY "Admin elimina productos" ON products FOR DELETE USING (true);

CREATE POLICY "Admin escribe proyectos" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin actualiza proyectos" ON projects FOR UPDATE USING (true);
CREATE POLICY "Admin elimina proyectos" ON projects FOR DELETE USING (true);

CREATE POLICY "Admin escribe testimonios" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin actualiza testimonios" ON testimonials FOR UPDATE USING (true);
CREATE POLICY "Admin elimina testimonios" ON testimonials FOR DELETE USING (true);

-- =====================================================
-- Storage bucket para imágenes
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('tapipocitos-images', 'tapipocitos-images', true)
ON CONFLICT (id) DO NOTHING;

-- Cualquiera puede ver las imágenes
CREATE POLICY "Imagenes publicas" ON storage.objects FOR SELECT USING (bucket_id = 'tapipocitos-images');

-- Subir/eliminar solo con auth (service_role desde API)
CREATE POLICY "Admin sube imagenes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tapipocitos-images');
CREATE POLICY "Admin elimina imagenes" ON storage.objects FOR DELETE USING (bucket_id = 'tapipocitos-images');

-- =====================================================
-- Datos demo iniciales
-- =====================================================

INSERT INTO products (name, description, material, color, dimensions, price, images, category) VALUES
  ('Sofá Montevideo 3 cuerpos', 'Sofá de 3 cuerpos con estructura de pino reforzado, espuma de alta densidad y tapizado en tela chenille.', 'Chenille importado', 'Marrón claro', '220 x 90 x 85 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-esquinero-gris-taller.jpg'], 'Sofás'),
  ('Sillón individual Carrasco', 'Sillón individual con respaldo alto y apoyabrazos curvos. Espuma soft de 30kg y tapizado en pana premium.', 'Pana premium', 'Verde oscuro', '85 x 80 x 100 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-dos-cuerpos-verde-base-madera.jpg'], 'Sillones'),
  ('Silla comedor Clásica', 'Silla de comedor con asiento y respaldo tapizado en cuero sintético. Estructura de madera maciza.', 'Cuero sintético', 'Marrón oscuro', '45 x 50 x 92 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-clasico-beige-brazos-curvos.jpg'], 'Sillas'),
  ('Sofá esquinero Pocitos', 'Sofá esquinero modular de 5 módulos independientes con fundas removibles y lavables.', 'Tela antimanchas', 'Beige', '320 x 210 x 78 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-esquinero-beige-ottoman-hogar.jpg'], 'Sofás'),
  ('Banqueta alta Nórdica', 'Banqueta alta para barra o isla de cocina. Asiento tapizado giratorio con base de acero cromado.', 'Microfibra', 'Gris', '42 x 42 x 75 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-esquinero-aqua-taller.jpg'], 'Banquetas'),
  ('Mesa ratona tapizada', 'Mesa ratona con tapa tapizada en cuero ecológico y base de madera paraíso.', 'Cuero ecológico', 'Marrón tabaco', '100 x 60 x 42 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-gris-con-ottoman-exterior.jpg'], 'Mesas'),
  ('Sillón Bergère Francés', 'Sillón bergère de estilo clásico francés con capitoné en respaldo y brazos.', 'Terciopelo italiano', 'Borravino', '78 x 82 x 105 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-beige-vivo-contrastante-naranja.jpg'], 'Sillones'),
  ('Silla escritorio tapizada', 'Silla de escritorio con asiento y respaldo tapizado en tela mesh transpirable.', 'Tela mesh premium', 'Gris oscuro', '60 x 60 x 95 cm', 'Consultar', ARRAY['/fotos/sofas/sofa-esquinero-gris-compacto.jpg'], 'Sillas');

INSERT INTO projects (title, description, category, images, materials, client, completed_date) VALUES
  ('Sofá Chesterfield 3 cuerpos', 'Retapizado completo de sofá Chesterfield clásico en cuero vacuno marrón oscuro. Se restauró la estructura, se reemplazaron los resortes y se trabajó el capitoné original a mano.', 'Sofás', ARRAY['/fotos/restauraciones/restauracion-chesterfield-cuero-1.jpg'], ARRAY['Cuero vacuno', 'Espuma alta densidad', 'Resortes zig-zag'], 'Familia Pereira', 'Enero 2024'),
  ('Sillas de comedor estilo nórdico', 'Set de 6 sillas de comedor retapizadas en tela lino gris claro con patas de madera natural.', 'Sillas', ARRAY['/fotos/sofas/sofa-dos-cuerpos-mostaza.jpg'], ARRAY['Tela lino', 'Espuma densidad 28', 'Clavos tapiceros'], 'Restaurant La Pasiva', 'Marzo 2024'),
  ('Restauración sillón bergère antiguo', 'Restauración integral de sillón bergère de 1940. Se reconstruyó la estructura y se tapizó en terciopelo verde esmeralda.', 'Restauraciones', ARRAY['/fotos/sofas/sofa-clasico-beige-brazos-curvos.jpg'], ARRAY['Terciopelo italiano', 'Crin natural', 'Muelles bicónicos'], 'Sr. Martínez', 'Noviembre 2023'),
  ('Tapizado hotel boutique Carrasco', 'Proyecto completo: 12 cabeceras de cama, 24 sillas de comedor, 6 sillones de recepción.', 'Proyectos Especiales', ARRAY['/fotos/sofas/sofa-esquinero-oscuro-almohadones-etnicos.jpg'], ARRAY['Tela antimanchas', 'Cuero sintético premium', 'Espuma ignífuga'], 'Hotel Boutique Carrasco', 'Septiembre 2023'),
  ('Sofá esquinero a medida', 'Sofá esquinero de 3.20m x 2.10m fabricado a medida en tela chenille beige. Módulos independientes.', 'Sofás', ARRAY['/fotos/sofas/sofa-esquinero-gris-grande-base-madera.jpg'], ARRAY['Chenille importado', 'Espuma soft', 'Estructura pino reforzado'], 'Familia González', 'Febrero 2024'),
  ('Butaca antigua: antes y después', 'Transformación completa de butaca victoriana. De un estado deplorable a una pieza restaurada.', 'Antes y Después', ARRAY['/fotos/restauraciones/restauracion-chesterfield-cuero-2.jpg'], ARRAY['Pana importada', 'Tachas doradas', 'Yute'], 'Sra. Bentancor', 'Diciembre 2023'),
  ('Banquetas bar retapizadas', 'Set de 8 banquetas altas retapizadas en cuero sintético negro con costura decorativa.', 'Sillas', ARRAY['/fotos/sofas/sofa-esquinero-azul-marino-base-madera.jpg'], ARRAY['Cuero sintético', 'Hilo encerado dorado'], 'Bar El Barzón', 'Abril 2024'),
  ('Sillón reclinable: antes y después', 'Sillón reclinable con mecanismo dañado y tapizado gastado. Se reparó todo.', 'Antes y Después', ARRAY['/fotos/sofas/sofa-gris-oscuro-almohadones-azules.jpg'], ARRAY['Microfibra premium', 'Espuma HR', 'Mecanismo nuevo'], 'Dr. Silveira', 'Mayo 2024'),
  ('Restauración juego de living completo', 'Restauración de juego de living años 60: sofá de 3 cuerpos y 2 sillones individuales.', 'Restauraciones', ARRAY['/fotos/sofas/sofa-u-beige-hogar-moderno.jpg'], ARRAY['Tela tapicera mostaza', 'Espuma blanda', 'Cinchas elásticas'], 'Arq. López', 'Julio 2023');

INSERT INTO testimonials (name, text, date, rating) VALUES
  ('María Rodríguez', 'Llevamos el sofá de mi abuela que tenía más de 40 años. Lo devolvieron como nuevo, respetando el diseño original pero con telas modernas. Un trabajo impecable.', 'Enero 2024', 5),
  ('Carlos Méndez', 'Nos hicieron todo el tapizado del restaurante. 20 sillas y 8 banquetas en tiempo récord y con una calidad espectacular. Muy profesionales.', 'Marzo 2024', 5),
  ('Laura Fernández', 'Pedí un sillón a medida para mi living y quedó exactamente como lo imaginaba. La atención personalizada de Leonardo hace toda la diferencia.', 'Noviembre 2023', 5);
