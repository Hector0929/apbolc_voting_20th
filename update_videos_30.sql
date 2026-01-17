-- ==========================================================
-- 安平靈糧堂 20週年投票系統 - 完整環境設定腳本
-- 包含：30部影片更新 + 每日3票限制架構設定
-- ==========================================================

-- 1. [架構更新] 確保每日投票限制的資料結構正確
-- 移除舊的唯一約束
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_user_id_video_id_key;
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_user_video_date_unique;

-- 新增投票日期欄位 (台灣時區)
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS vote_date date DEFAULT (CURRENT_DATE AT TIME ZONE 'Asia/Taipei');

-- [重要] 清除舊資料，以防現存的重複資料導致無法建立 UNIQUE 約束
-- 注意：這會刪除所有現有的投票記錄
TRUNCATE votes CASCADE;
DELETE FROM videos;

-- 2. [規則套用] 建立索引與唯一約束
CREATE INDEX IF NOT EXISTS idx_votes_user_date ON votes(user_id, vote_date);

-- 確保每人每天對同一部影片只能投一票
ALTER TABLE votes ADD CONSTRAINT votes_user_video_date_unique UNIQUE (user_id, video_id, vote_date);


-- 3. [資料插入] 插入正式的 30 部影片清單
INSERT INTO videos (id, title, youtube_id) VALUES
  (1, '01 讚美小組 祝福安平靈糧堂20週年', 'I56goHmk9d8'),
  (2, '02 橄欖樹 祝福安平靈糧堂20週年', 'ngyXLZZjCWs'),
  (3, '03 五餅二魚小組 祝福安平靈糧堂20週年', 'Bc4fLH0J2zc'),
  (4, '04 天使心第一小組 祝福安平靈糧堂20週年V', 'LHUXIqfqacc'),
  (5, '05 巴底買小組 祝福安平靈糧堂20週年', 'dQ7C7QHn6Mg'),
  (6, '06 以勒 祝福安平靈糧堂20週年', 'GdcCenmeQ58'),
  (7, '07 光鹽小組 祝福安平靈糧堂20週年', '2vHoaP1XgnY'),
  (8, '08 何其美小組 祝福安平靈糧堂20週年', 'WD89-THw45w'),
  (9, '09 佳美小組 祝福安平靈糧堂20週年', 'o3XeoFhyIKc'),
  (10, '10 房角石小組 祝福安平靈糧堂20週年', 'L-dr_MlWa5g'),
  (11, '11 約書亞小組 祝福安平靈糧堂20週年', 'FOCv1m6TGkY'),
  (12, '12 美福小組 祝福安平靈糧堂20週年', 'O7CzwEagyhU'),
  (13, '13 迦南小組 祝福安平靈糧堂20週年', 'PyaS4N7Monw'),
  (14, '14 恩愛小組 祝福安平靈糧堂20週年', 'PWw3egLSVrw'),
  (15, '15 得勝小組 祝福安平靈糧堂20週年', 'StHkhmA8o-4'),
  (16, '16 喜樂 祝福安平靈糧堂20週年', 'BE7cUOzm2nY'),
  (17, '17 雅歌小組 祝福安平靈糧堂20週年', 'yNWDYtN1niA'),
  (18, '18 雲柱小組 祝福安平靈糧堂20週年', 'uXRW5xPZcss'),
  (19, '19 溪邊小組 祝福安平靈糧堂20週年', 'INv5yWxFQK0'),
  (20, '20 跨越小組 祝福安平靈糧堂20週年', 'tR2r9O1CaIc'),
  (21, '21 撒拉弗小組 祝福安平靈糧堂20週年', 'KH1Ik3AEzF0'),
  (22, '22 磐石小組 祝福安平靈糧堂20週年', 'bUKz_FewoF8'),
  (23, '23 小孩第一小組 祝福安平靈糧堂20週年', 'EfSpifuHqeY'),
  (24, '24 宇光小組 祝福安平靈糧堂20週年', '5phkp3DED4g'),
  (25, '25 迦勒小組 祝福安平靈糧堂20週年', 'permReG7XTk'),
  (26, '26 營火小組 祝福安平靈糧堂20週年V', 'zl9NuViXg7o'),
  (27, '27 SQUAT小組 祝福安平靈糧堂20週年', 'iz3x3rzUwHI'),
  (28, '28 唯光小組 祝福安平靈糧堂20週年 V', 'QJrgrTL20NU'),
  (29, '29 以斯帖小組 祝福安平靈糧堂20週年', 'nVcbnRRHGBU'),
  (30, '30 冠冕小組小組 祝福安平靈糧堂20週年', 'C6jmaURPYGw');


-- 4. [驗證] 檢查最終結果
SELECT '影片總數' as info, COUNT(*) as count FROM videos
UNION ALL
SELECT '資料表欄位' as info, COUNT(*) 
FROM information_schema.columns 
WHERE table_name = 'votes' AND column_name = 'vote_date';

SELECT * FROM videos ORDER BY id LIMIT 5;
