# Supabase 数据库初始化 SQL

在 Supabase 控制台 SQL Editor 中执行以下 SQL：

```sql
-- 1. 创建 profiles 表（用户资料）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  color TEXT NOT NULL DEFAULT '#FFE4E1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 创建 diaries 表（日记）
CREATE TABLE diaries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  diary_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 索引
CREATE INDEX idx_diaries_diary_date ON diaries(diary_date DESC);
CREATE INDEX idx_diaries_user_id ON diaries(user_id);

-- 4. RLS 策略：profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. RLS 策略：diaries
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple can read all diaries"
  ON diaries FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own diary"
  ON diaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own diary"
  ON diaries FOR DELETE
  USING (auth.uid() = user_id);

-- 6. 触发器：新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nickname, gender, color)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', '未命名'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'female'),
    CASE
      WHEN NEW.raw_user_meta_data->>'gender' = 'male' THEN '#D6EAF8'
      ELSE '#FFE4E1'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```
