-- 1. 預覽：看看有多少票是因為「每日超過 3 票」需要被刪除的
-- 使用 ROW_NUMBER() 依照時間倒序排列 (最新的排前面)
-- rw > 3 的就是多出來的舊票
WITH ranked_votes AS (
  SELECT id, user_id, vote_date, created_at,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, vote_date
           ORDER BY created_at DESC
         ) as rn
  FROM votes
)
SELECT * FROM ranked_votes 
WHERE rn > 3
ORDER BY user_id, vote_date;

-- 2. 執行刪除：確認沒問題後，執行這段
-- 這會保留每個號碼每天「最新的 3 票」，刪掉其他較舊的票
WITH ranked_votes AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, vote_date
           ORDER BY created_at DESC
         ) as rn
  FROM votes
)
DELETE FROM votes
WHERE id IN (
  SELECT id FROM ranked_votes WHERE rn > 3
);
