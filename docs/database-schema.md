# 数据库表结构

## 表 1：profiles

用户资料表，与 Supabase Auth 的 auth.users 一对一关联。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | uuid | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | 用户 ID |
| nickname | text | NOT NULL | 自定义昵称 |
| gender | text | NOT NULL, CHECK (gender IN ('male', 'female')) | 性别 |
| color | text | NOT NULL, DEFAULT '#FFE4E1' | 日记代表色 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 创建时间 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新时间 |

### RLS 策略

```sql
-- 用户可以读取自己的 profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 用户可以创建自己的 profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 用户可以更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## 表 2：diaries

日记表，每篇日记关联一个用户。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PRIMARY KEY, GENERATED ALWAYS AS IDENTITY | 日记 ID |
| user_id | uuid | NOT NULL, REFERENCES profiles(id) ON DELETE CASCADE | 作者 ID |
| content | text | NOT NULL | 日记内容 |
| diary_date | date | NOT NULL, DEFAULT CURRENT_DATE | 日记所属日期 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 创建时间 |

### RLS 策略

```sql
-- 所有人可以读取日记（情侣互相可见）
CREATE POLICY "Couple can read all diaries"
  ON diaries FOR SELECT
  USING (true);

-- 用户只能创建自己的日记
CREATE POLICY "Users can insert own diary"
  ON diaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的日记
CREATE POLICY "Users can delete own diary"
  ON diaries FOR DELETE
  USING (auth.uid() = user_id);
```

## 索引

```sql
CREATE INDEX idx_diaries_diary_date ON diaries(diary_date DESC);
CREATE INDEX idx_diaries_user_id ON diaries(user_id);
```
