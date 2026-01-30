-- 1. 先預覽：檢查這些號碼投了幾票 (確認刪除的數量正確)
SELECT user_id, count(*) as vote_count 
FROM votes 
WHERE user_id IN ('999999999', '912345678', '0999999999', '0912345678') -- 包含可能加了 0 的情況
GROUP BY user_id;

-- 2. 執行刪除：確認數量沒錯後，執行這段
DELETE FROM votes 
WHERE user_id IN ('999999999', '912345678', '0999999999', '0912345678');

-- 3. (進階) 刪除更多這類規則的號碼
-- 例如：所有 9 個數字都一樣的 (111111111, 222222222...)
-- DELETE FROM votes WHERE user_id ~ '^(\d)\1+$'; 
