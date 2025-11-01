-- Genius Hub Database Setup
-- Single file with all tables and data - NO RLS

-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_batches CASCADE;
DROP TABLE IF EXISTS batches CASCADE;

-- Create batches table
CREATE TABLE batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT,
  telegram_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'foundation', 'jee', 'neet', 'study-materials', 'khazana'
  class_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_batches_category ON batches(category);
CREATE INDEX idx_batches_class_level ON batches(class_level);

-- Create user_batches table for enrollment tracking
CREATE TABLE IF NOT EXISTS user_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, batch_id)
);

-- Create banners table for managing homepage banners
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for user_batches
CREATE INDEX idx_user_batches_user_id ON user_batches(user_id);
CREATE INDEX idx_user_batches_batch_id ON user_batches(batch_id);

-- Insert all batches data

-- Arjuna JEE batches (JEE Class 11)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Arjuna JEE 3.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323888053.jpg', 'https://t.me/+Q9Kq0Z5c8Hc4Zjc1', 'jee', 'Class 11'),
('Arjuna JEE 2.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323930048.jpg', 'https://t.me/+t5Dj5OSxZ19mZDc1', 'jee', 'Class 11'),
('Arjuna JEE 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323974959.jpg', 'https://t.me/+jlD1wibAzak1Zjc1', 'jee', 'Class 11');

-- Arjuna NEET batches (NEET Class 11)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Arjuna NEET 3.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323734478.jpg', 'https://t.me/+b2MoFEpvrO9lOWZl', 'neet', 'Class 11'),
('Arjuna NEET 2.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323792615.jpg', 'https://t.me/+HUrFj50XIlA4NDE1', 'neet', 'Class 11'),
('Arjuna NEET 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323835082.jpg', 'https://t.me/+JTF3mQ9M9QZjNWQ1', 'neet', 'Class 11');

-- Prayas JEE batches (JEE Droppers)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Prayas JEE 3.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301162294.jpg', 'https://t.me/+Q6AdSeYaFM44MjQ1', 'jee', 'Droppers'),
('Prayas JEE 2.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301205419.jpg', 'https://t.me/+IimBlbi_kT1mYmVl', 'jee', 'Droppers'),
('Prayas JEE 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301237729.jpg', 'https://t.me/+loeDgJRqzak4NTc1', 'jee', 'Droppers');

-- Yakeen NEET batches (NEET Droppers)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Yakeen NEET 3.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759299794087.png', 'https://t.me/+uqOzPGarxOs2NWU9', 'neet', 'Droppers'),
('Yakeen NEET 2.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759299892960.jpg', 'https://t.me/+9AlJrb-pdaQyYWE1', 'neet', 'Droppers'),
('Yakeen NEET 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759299957066.jpg', 'https://t.me/+p8by-i7te25lMDY1', 'neet', 'Droppers');

-- Parishram batches (Foundation Class 12)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Parishram GOAT 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323306890.png', 'https://t.me/+zbwIvVvhCU1jNzE1', 'foundation', 'Class 12'),
('Parishram 2.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323419976.jpg', 'https://t.me/+h3m2uAve8e81OTVl', 'foundation', 'Class 12'),
('Parishram 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759323643281.jpg', 'https://t.me/+AV8rcGl8VillYThl', 'foundation', 'Class 12');

-- Uday batches (Foundation Class 11)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Uday Reloaded 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759324021852.png', 'https://t.me/+Y0BVUoSI-OdjODll', 'foundation', 'Class 11');

-- Lakshya JEE batches (JEE Class 12)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Lakshya JEE 3.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301505753.jpg', 'https://t.me/+1zP2gx5071c0ZGFl', 'jee', 'Class 12'),
('Lakshya JEE 2.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301550762.jpg', 'https://t.me/+_ptAcEUiUMEzYTA1', 'jee', 'Class 12'),
('Lakshya JEE 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301588160.jpg', 'https://t.me/+IUyWIW9RPellNDk1', 'jee', 'Class 12');

-- Lakshya NEET batches (NEET Class 12)
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('Lakshya NEET 3.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301390220.png', 'https://t.me/+FYnAWTZzWFpmYzk9', 'neet', 'Class 12'),
('Lakshya NEET 2.0 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301436832.jpg', 'https://t.me/+qmjpHsJpF6wzNTdl', 'neet', 'Class 12'),
('Lakshya NEET 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759301479219.jpg', 'https://t.me/+IUyWIW9RPellNDk1', 'neet', 'Class 12');

-- Additional batches
INSERT INTO batches (title, image_url, telegram_url, category, class_level) VALUES
('NEET Coaching Plus 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759300265713.jpg', 'https://t.me/+HQ2y0sO4rXkwOGY1', 'neet', 'Class 12'),
('JEE Coaching Plus 2026', 'https://kxwuhxbuurfivsvbbzyq.supabase.co/storage/v1/object/public/thumbnails/1759300954860.png', 'https://t.me/+xxZV4DFDlkVjZjM1', 'jee', 'Class 12');

-- Done! All tables created and data inserted.
