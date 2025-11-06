-- Create blog_posts table with all required columns
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_title TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  read_time INTEGER, -- in minutes
  tags TEXT[], -- array of tags
  featured_post BOOLEAN DEFAULT false,
  media_upload TEXT[], -- array of media URLs
  author_info JSONB, -- JSON object for author details
  author_bio TEXT,
  article TEXT NOT NULL, -- main content
  language TEXT DEFAULT 'en', -- 'en' or 'fr'
  slug TEXT UNIQUE NOT NULL, -- URL-friendly version of title
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on language for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);

-- Create index on featured_post for homepage queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured_post);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on blog_posts" ON blog_posts
  FOR ALL USING (true);
</sql>
