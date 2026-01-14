-- 每日投票限制 - 資料庫遷移腳本
-- 執行此腳本以更新資料庫結構

-- 步驟 1: 移除舊的 UNIQUE 約束（每人每影片只能投一次）
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_user_id_video_id_key;

-- 步驟 2: 新增投票日期欄位（台灣時區）
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS vote_date date DEFAULT (CURRENT_DATE AT TIME ZONE 'Asia/Taipei');

-- 步驟 3: 為現有的投票記錄設定日期（設為今天）
UPDATE votes 
SET vote_date = (CURRENT_DATE AT TIME ZONE 'Asia/Taipei')
WHERE vote_date IS NULL;

-- 步驟 4: 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_votes_user_date ON votes(user_id, vote_date);

-- 步驟 5: 驗證變更
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'votes'
ORDER BY ordinal_position;

-- 步驟 6: 查看現有投票記錄
SELECT 
  user_id,
  vote_date,
  COUNT(*) as vote_count
FROM votes
GROUP BY user_id, vote_date
ORDER BY vote_date DESC, vote_count DESC;
