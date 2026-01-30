-- 1. 最後確認：看看這三組號碼是不是「連號」的 (例如 0919000001, 0919000002)
-- 如果看到號碼長得很像流水號，那就是買榜無誤
SELECT user_id, video_id, created_at 
FROM votes 
WHERE user_id LIKE '09190%' 
   OR user_id LIKE '09282%'
ORDER BY user_id ASC
LIMIT 100;

-- 2. (確認後再執行) 刪除這兩個高度可疑的號段 (09190 和 09282)
-- 09223 因為票數分散 (投給別人也多)，可能是真人或混雜，建議先保留觀察，以免殺錯
DELETE FROM votes 
WHERE user_id LIKE '09190%' 
   OR user_id LIKE '09282%';
