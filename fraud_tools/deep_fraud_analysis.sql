-- 1. 相似號碼檢查 (Sequential Phone Numbers)
-- 檢查是否有大量「前 7 碼相同」的號碼群聚
-- 正常情況下，號碼應該是隨機分佈的。如果發現某一區段 (例如 0912-345-xxx) 特別多，可能是生成號碼
SELECT 
  SUBSTRING(user_id, 1, 8) as prefix, 
  COUNT(*) as count,
  array_agg(user_id) as interact_ids -- 列出這些號碼
FROM votes 
GROUP BY prefix 
HAVING COUNT(*) > 5 -- 調整這個閥值，看是否有一群相似號碼
ORDER BY count DESC;

-- 2. "機器人打卡" 行為 (Perfect Attendance)
-- 找出連續 N 天都有投票，且每天都投滿 3 票的「超勤勞」帳號
-- 雖然可能是超級粉絲，但如果是幾百個這種人，就很可能是腳本
SELECT user_id, count(DISTINCT vote_date) as days_voted, COUNT(*) as total_votes
FROM votes
GROUP BY user_id
HAVING count(DISTINCT vote_date) > 3 AND COUNT(*) >= count(DISTINCT vote_date) * 3
ORDER BY total_votes DESC;

-- 3. 「死忠部隊」分析 (Single Target Cohorts)
-- 找出只投給特定一部影片，從來沒投過別人的帳號
-- 如果某部影片有極高比例的「單一死忠票」，代表可能有專門的灌票部隊
SELECT 
  v.title,
  COUNT(DISTINCT vo.user_id) as unique_voters,
  COUNT(DISTINCT CASE WHEN user_vote_counts.videos_voted_count = 1 THEN vo.user_id END) as single_target_voters,
  ROUND(COUNT(DISTINCT CASE WHEN user_vote_counts.videos_voted_count = 1 THEN vo.user_id END) * 100.0 / COUNT(DISTINCT vo.user_id), 2) as suspicious_percent
FROM votes vo
JOIN videos v ON vo.video_id = v.id
JOIN (
  -- 統計每個使用者投過幾部「不同」的影片
  SELECT user_id, COUNT(DISTINCT video_id) as videos_voted_count
  FROM votes
  GROUP BY user_id
) user_vote_counts ON vo.user_id = user_vote_counts.user_id
GROUP BY v.title
ORDER BY suspicious_percent DESC;

-- 4. 密集時間攻擊 (Time Density Attack)
-- 檢查每 5 分鐘區間內，特定影片的得票數
-- 正常投票是平滑的波浪，機器人攻擊會是突然的「尖刺」
SELECT 
  v.title,
  date_trunc('hour', vo.created_at) + interval '5 min' * floor(date_part('minute', vo.created_at) / 5.0) as time_window,
  COUNT(*) as vote_burst
FROM votes vo
JOIN videos v ON vo.video_id = v.id
GROUP BY v.title, time_window
HAVING COUNT(*) > 10 -- 閥值：5分鐘內超過 10 票 (依總流量調整)
ORDER BY vote_burst DESC;
