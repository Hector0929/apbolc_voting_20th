-- 1. 檢查是否有短時間內的大量灌票 (每分鐘票數統計)
-- 如果看到某一分鐘突然有數百張票，非常可能是機器人
SELECT 
  date_trunc('minute', created_at) AS vote_minute,
  COUNT(*) AS vote_count
FROM votes
GROUP BY vote_minute
ORDER BY vote_count DESC
LIMIT 10;

-- 2. 檢查是否有規律性的 User ID (例如 0900000001, 090000002...)
SELECT user_id, COUNT(*) as total_votes
FROM votes
GROUP BY user_id
ORDER BY user_id ASC
LIMIT 50;

-- 3. 檢查單一影片的異常爆衝 (依據影片 ID 統計)
SELECT 
  v.title,
  COUNT(*) as vote_count
FROM votes vo
JOIN videos v ON vo.video_id = v.id
GROUP BY v.title
ORDER BY vote_count DESC;

-- 4. 檢查是否有「秒投」的情況 (同一秒多張票)
-- 理論上人類操作不太可能同時產生大量票數
SELECT created_at, COUNT(*) 
FROM votes 
GROUP BY created_at 
HAVING COUNT(*) > 1 
ORDER BY COUNT(*) DESC;

-- 5. [NEW] 檢查單一 IP 的大量投票 (IP 多重帳號)
-- 找出同一個 IP 使用了大量不同 User ID 的情況
SELECT 
  ip_address, 
  COUNT(DISTINCT user_id) as distinct_users,
  COUNT(*) as total_votes
FROM votes
WHERE ip_address IS NOT NULL
GROUP BY ip_address
ORDER BY distinct_users DESC
LIMIT 20;
