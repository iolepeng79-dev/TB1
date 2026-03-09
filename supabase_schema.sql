-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('tourist', 'business', 'admin')) DEFAULT 'tourist',
  request_tier TEXT CHECK (request_tier IN ('standard', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Businesses Table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  contacts JSONB NOT NULL, -- { office_email, phone, whatsapp, website }
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  price_range_BWP TEXT,
  tier TEXT CHECK (tier IN ('standard', 'premium')) DEFAULT 'standard',
  attachments JSONB DEFAULT '{"images": [], "videos": []}'::jsonb,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Business Tier Requests
CREATE TABLE business_tier_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  requested_tier TEXT CHECK (requested_tier IN ('standard', 'premium')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Reviews
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Favorites
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(business_id, user_id)
);

-- 6. Website Reviews
CREATE TABLE website_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Analytics Events
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'click_call', 'click_whatsapp', 'click_email', 'view_media', 'view_profile'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_tier_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Businesses: Everyone can read approved businesses, owners can read/update their own, admins can do all
CREATE POLICY "Anyone can read approved businesses" ON businesses FOR SELECT USING (status = 'approved');
CREATE POLICY "Owners can read own business" ON businesses FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners can update own business" ON businesses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can insert business" ON businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins can manage all businesses" ON businesses ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Reviews: Tourists can insert, everyone can read, owners can delete their own
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Tourists can insert reviews" ON reviews FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'tourist'));
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Favorites: Tourists can manage their own
CREATE POLICY "Users can read own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Tourists can manage favorites" ON favorites ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'tourist') AND auth.uid() = user_id);

-- Website Reviews: Anyone can insert, admins can read
CREATE POLICY "Anyone can insert website reviews" ON website_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read website reviews" ON website_reviews FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Analytics: Owners can read for their business, admins can read all, everyone can insert
CREATE POLICY "Anyone can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can read own analytics" ON analytics_events FOR SELECT USING (EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid()));
CREATE POLICY "Admins can read all analytics" ON analytics_events FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
