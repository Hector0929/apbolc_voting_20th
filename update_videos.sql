-- 更新影片清單 SQL 腳本
-- 執行此腳本以更新 Supabase 中的影片資料

-- 1. 清空現有投票記錄（可選，如果要保留舊投票則跳過此步驟）
-- DELETE FROM votes;

-- 2. 刪除舊影片
DELETE FROM videos;

-- 3. 插入新影片
INSERT INTO videos (id, title, youtube_id) VALUES
  (1, '20週年紀念影片 1', '9_qNJyZR3sI'),
  (2, '20週年紀念影片 2', 'g7sZsHg05kw'),
  (3, '20週年紀念影片 3', 'C6rLXGCrejg'),
  (4, '20週年紀念影片 4', 'Qc7sxKQgfLo');

-- 4. 驗證資料
SELECT * FROM videos ORDER BY id;
