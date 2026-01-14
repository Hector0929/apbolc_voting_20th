-- 更新影片清單 SQL 腳本
-- 執行此腳本以更新 Supabase 中的影片資料

-- 1. 清空現有投票記錄（可選，如果要保留舊投票則跳過此步驟）
-- DELETE FROM votes;

-- 2. 刪除舊影片
DELETE FROM videos;

-- 3. 插入新影片
INSERT INTO videos (id, title, youtube_id) VALUES
  (1, '第一個影片', '9_qNJyZR3sI'),
  (2, '第二個影片', 'g7sZsHg05kw'),
  (3, '第三個影片', 'C6rLXGCrejg'),
  (4, '第四個影片', 'Qc7sxKQgfLo');

-- 4. 驗證資料
SELECT * FROM videos ORDER BY id;
