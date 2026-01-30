-- 1. 檢查 09190 開頭的號碼是否為「連號」 (Sequential Check)
-- 如果看到號碼是連續的 (例如 001, 002, 003)，那就是機器人產生的
SELECT user_id, created_at
FROM votes
WHERE user_id LIKE '09190%'
ORDER BY user_id ASC
LIMIT 50;

-- 2. 檢查這批 09190 的人都在什麼時候投票 (Time Clustering)
-- 如果這 422 票都集中在某個小時內，就是腳本跑的
SELECT 
  date_trunc('hour', created_at) as vote_hour,
  COUNT(*) as count
FROM votes
WHERE user_id LIKE '09190%'
GROUP BY vote_hour
ORDER BY count DESC;

-- 3. 交叉比對：這三大嫌疑開頭 (09190, 09223, 09282) 除了一致投給約書亞，還有投給別人嗎？
-- 如果 sum_other_votes = 0，代表他們是完美的「幽靈投票部隊」
SELECT 
  SUBSTRING(user_id, 1, 5) as prefix,
  COUNT(*) as total_votes_from_prefix,
  COUNT(CASE WHEN video_id = (SELECT id FROM videos WHERE title LIKE '%約書亞%' LIMIT 1) THEN 1 END) as votes_for_target,
  COUNT(CASE WHEN video_id != (SELECT id FROM videos WHERE title LIKE '%約書亞%' LIMIT 1) THEN 1 END) as votes_for_others
FROM votes
WHERE user_id LIKE '09190%' OR user_id LIKE '09223%' OR user_id LIKE '09282%'
GROUP BY prefix;
