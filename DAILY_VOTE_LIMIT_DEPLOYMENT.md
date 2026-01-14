# 每日投票限制部署指南

## ✅ 已完成的程式碼更新

所有程式碼已經推送到 GitHub，Vercel 會自動部署。

---

## 🗄️ 資料庫遷移（必須執行）

### ⚠️ 重要提醒

在執行資料庫遷移前，你需要決定：

**選項 A：保留現有投票記錄**
- 舊的投票記錄會被設定為今天的日期
- 可能會影響今天的投票限制

**選項 B：清空所有投票記錄（推薦）**
- 從零開始，避免混淆
- 所有用戶都有完整的 3 票

---

## 📋 執行步驟

### 步驟 1：登入 Supabase

1. 前往 [supabase.com](https://supabase.com)
2. 選擇你的專案
3. 點擊左側選單的 **SQL Editor**
4. 點擊 **New Query**

---

### 步驟 2：執行資料庫遷移

#### 選項 A：保留現有投票記錄

```sql
-- 移除舊的 UNIQUE 約束
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_user_id_video_id_key;

-- 新增投票日期欄位
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS vote_date date DEFAULT (CURRENT_DATE AT TIME ZONE 'Asia/Taipei');

-- 為現有記錄設定日期（設為今天）
UPDATE votes 
SET vote_date = (CURRENT_DATE AT TIME ZONE 'Asia/Taipei')
WHERE vote_date IS NULL;

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_votes_user_date ON votes(user_id, vote_date);

-- 驗證
SELECT * FROM votes ORDER BY created_at DESC LIMIT 10;
```

#### 選項 B：清空投票記錄（推薦）

```sql
-- 刪除所有投票記錄
DELETE FROM votes;

-- 刪除舊影片
DELETE FROM videos;

-- 插入新影片
INSERT INTO videos (id, title, youtube_id) VALUES
  (1, '第一個影片', '9_qNJyZR3sI'),
  (2, '第二個影片', 'g7sZsHg05kw'),
  (3, '第三個影片', 'C6rLXGCrejg'),
  (4, '第四個影片', 'Qc7sxKQgfLo');

-- 移除舊的 UNIQUE 約束
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_user_id_video_id_key;

-- 新增投票日期欄位
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS vote_date date DEFAULT (CURRENT_DATE AT TIME ZONE 'Asia/Taipei');

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_votes_user_date ON votes(user_id, vote_date);

-- 驗證
SELECT * FROM videos ORDER BY id;
```

---

### 步驟 3：等待 Vercel 部署

- Vercel 會自動偵測到新的 commit
- 等待 1-2 分鐘完成部署
- 前往 `https://apbolc-voting-20th.vercel.app/vote` 測試

---

## 🧪 測試清單

部署完成後，請測試以下功能：

### 基本功能
- [ ] 登入功能正常
- [ ] 顯示「今日剩餘票數：3 / 3」
- [ ] 可以投票

### 每日限制
- [ ] 投第 1 票後顯示「今日剩餘票數：2 / 3」
- [ ] 投第 2 票後顯示「今日剩餘票數：1 / 3」
- [ ] 投第 3 票後顯示「今日剩餘票數：0 / 3」
- [ ] 投完 3 票後無法再投票
- [ ] 顯示錯誤訊息：「今天的投票次數已用完！明天再來投票吧 🗳️」

### 重複投票
- [ ] 可以投給同一部影片多次（只要還有票數）
- [ ] 排行榜正確累計票數

### 視覺效果
- [ ] 剩餘票數 > 0 時顯示金色
- [ ] 剩餘票數 = 0 時顯示紅色

---

## 🎯 新功能說明

### 投票規則變更

**舊規則：**
- ❌ 每人每部影片只能投一次票（永久）

**新規則：**
- ✅ 每人每天最多投 3 票
- ✅ 可以投給同一部影片多次
- ✅ 過台灣午夜 12 點後重置

### UI 變更

1. **剩餘票數顯示**
   - 位置：登入後的歡迎訊息下方
   - 格式：「今日剩餘票數：X / 3」
   - 顏色：剩餘 > 0 為金色，= 0 為紅色

2. **投票成功訊息**
   - 舊：「投票成功！」
   - 新：「投票成功！今日還剩 X 票」

3. **票數用完訊息**
   - 「今天的投票次數已用完！明天再來投票吧 🗳️」

---

## 📊 資料庫結構

### votes 表（更新後）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | `bigserial` | 主鍵 |
| `user_id` | `text` | 用戶 ID（電話號碼） |
| `video_id` | `bigint` | 影片 ID |
| `vote_date` | `date` | 投票日期（台灣時區）⭐ 新增 |
| `created_at` | `timestamptz` | 建立時間 |

### 索引

- `idx_votes_user_date` - 加速查詢今日投票數

---

## ❓ 常見問題

### Q: 如果我想改變每日票數限制怎麼辦？

A: 修改程式碼中的數字 `3`：
- `src/app/actions/vote.ts` 第 27 行：`if (todayVotes && todayVotes.length >= 3)`
- `src/app/actions/vote.ts` 第 48 行：`return { remaining: 3 - votedCount, ... }`
- `src/app/vote/page.tsx` 第 29 行：`const [remainingVotes, setRemainingVotes] = useState(3);`

### Q: 時區設定正確嗎？

A: 是的，所有日期都使用 `Asia/Taipei` 時區，確保在台灣午夜 12 點重置。

### Q: 排行榜會重置嗎？

A: 不會！排行榜顯示的是**總票數**（所有天數的累計），不會重置。

---

## 🎉 完成！

執行完資料庫遷移後，每日投票限制功能就完全啟用了！

用戶現在可以：
- 每天投 3 票
- 投給喜歡的影片（可重複）
- 過午夜後繼續投票
