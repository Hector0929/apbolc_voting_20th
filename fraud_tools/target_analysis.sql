-- 1. 找出「約書亞」的影片 ID 和目前的總票數 (確認目標)
SELECT id, title, (SELECT count(*) FROM votes WHERE video_id = videos.id) as total_votes
FROM videos 
WHERE title LIKE '%約書亞%';

-- 2. 「忠誠度」分析：投給約書亞的人，還有投給別人嗎？
-- 如果絕大多數 (例如 95%) 都「只投給他」，甚至連每天 3 票的額度都不用完，非常可疑
WITH target_video AS (SELECT id FROM videos WHERE title LIKE '%約書亞%' LIMIT 1)
SELECT 
  CASE 
    WHEN vote_counts.total_videos_voted = 1 THEN '只投給約書亞 (死忠/灌票)'
    ELSE '有投給其他人 (正常)' 
  END as voter_type,
  COUNT(*) as voter_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(DISTINCT user_id) FROM votes WHERE video_id = (SELECT id FROM target_video)), 1) as percentage
FROM (
  -- 找出投給約書亞的所有人，並計算這些人總共投過幾部「不同」的影片
  SELECT user_id, COUNT(DISTINCT video_id) as total_videos_voted
  FROM votes
  WHERE user_id IN (
    SELECT user_id FROM votes WHERE video_id = (SELECT id FROM target_video)
  )
  GROUP BY user_id
) vote_counts
GROUP BY voter_type;

-- 3. 「時間軸」分析：他的票是怎麼進來的？
-- 檢查是否有「垂直爬升」的時段 (例如 19:00~19:10 突然幾百票)
SELECT 
  to_char(created_at, 'MM-DD HH24:MI') as minute_time,
  COUNT(*) as votes_per_minute
FROM votes
WHERE video_id = (SELECT id FROM videos WHERE title LIKE '%約書亞%' LIMIT 1)
GROUP BY minute_time
HAVING COUNT(*) > 5 -- 過濾掉只有零星票的時間，只看「大量灌入」的時段
ORDER BY votes_per_minute DESC
LIMIT 20;

-- 4. 「號碼慣性」分析：投給他的人，電話號碼有什麼特徵？
-- 例如是不是都來自 0900, 0912 這種特定開頭
SELECT 
  SUBSTRING(user_id, 1, 5) as phone_prefix, -- 取前五碼 (e.g. 09123)
  COUNT(*) as count
FROM votes 
WHERE video_id = (SELECT id FROM videos WHERE title LIKE '%約書亞%' LIMIT 1)
GROUP BY phone_prefix
ORDER BY count DESC
LIMIT 10;

-- 5. [NEW] 「IP 來源」分析：他的票是來自哪裡？
-- 檢查是否有特定的 IP 貢獻了大量票數
SELECT 
  ip_address,
  COUNT(*) as votes_from_ip,
  COUNT(DISTINCT user_id) as users_from_this_ip
FROM votes 
WHERE video_id = (SELECT id FROM videos WHERE title LIKE '%約書亞%' LIMIT 1)
AND ip_address IS NOT NULL
GROUP BY ip_address
ORDER BY votes_from_ip DESC
LIMIT 10;
