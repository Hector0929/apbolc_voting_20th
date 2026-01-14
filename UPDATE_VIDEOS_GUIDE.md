# 更新影片清單指南

## 📺 新影片清單

已將影片從 2 部更新為 4 部：

| ID | 標題 | YouTube ID |
|----|------|-----------|
| 1 | 20週年紀念影片 1 | 9_qNJyZR3sI |
| 2 | 20週年紀念影片 2 | g7sZsHg05kw |
| 3 | 20週年紀念影片 3 | C6rLXGCrejg |
| 4 | 20週年紀念影片 4 | Qc7sxKQgfLo |

---

## 🔧 需要執行的步驟

### 步驟 1：更新 Supabase 資料庫

1. **登入 Supabase Dashboard**
   - 前往 [supabase.com](https://supabase.com)
   - 選擇你的專案

2. **打開 SQL Editor**
   - 左側選單 → **SQL Editor**
   - 點擊 **New Query**

3. **執行 SQL 腳本**
   
   複製並執行以下 SQL：

   ```sql
   -- 1. 刪除舊影片（會自動刪除相關投票記錄，因為有外鍵約束）
   DELETE FROM videos;

   -- 2. 插入新影片
   INSERT INTO videos (id, title, youtube_id) VALUES
     (1, '20週年紀念影片 1', '9_qNJyZR3sI'),
     (2, '20週年紀念影片 2', 'g7sZsHg05kw'),
     (3, '20週年紀念影片 3', 'C6rLXGCrejg'),
     (4, '20週年紀念影片 4', 'Qc7sxKQgfLo');

   -- 3. 驗證資料
   SELECT * FROM videos ORDER BY id;
   ```

4. **確認結果**
   - 應該看到 4 筆影片記錄
   - 每筆記錄都有 id, title, youtube_id

---

### 步驟 2：推送程式碼更新

程式碼已經更新，現在推送到 GitHub：

```bash
git add .
git commit -m "Update: Replace videos with 4 new YouTube videos"
git push
```

---

### 步驟 3：等待 Vercel 部署

- Vercel 會自動偵測到新的 commit
- 等待 1-2 分鐘完成部署
- 前往網站查看新的影片清單

---

## ⚠️ 重要提醒

### 關於投票記錄

執行 SQL 腳本時，**所有現有的投票記錄會被刪除**（因為外鍵約束）。

如果你想保留現有投票記錄，需要：

1. **先備份投票記錄**
   ```sql
   -- 備份投票
   CREATE TABLE votes_backup AS SELECT * FROM votes;
   ```

2. **更新影片後，手動調整投票記錄**
   - 但這會很複雜，因為影片 ID 已經改變

**建議：** 如果這是測試階段，直接刪除舊投票重新開始會更簡單。

---

## 🎨 自訂影片標題

如果你想修改影片標題，有兩個地方需要更新：

### 1. Supabase 資料庫
```sql
UPDATE videos SET title = '你的新標題' WHERE id = 1;
```

### 2. 程式碼
編輯 `src/app/vote/page.tsx` 第 14-17 行：
```typescript
const [videos, setVideos] = useState<Video[]>([
    { id: 1, title: '你的新標題', youtube_id: '9_qNJyZR3sI' },
    // ...
]);
```

---

## ✅ 驗證清單

更新完成後，確認：

- [ ] Supabase 中有 4 部影片
- [ ] 網站顯示 4 部影片
- [ ] 每部影片都能正常播放
- [ ] 投票功能正常
- [ ] 排行榜正確顯示

---

## 📝 影片標題建議

如果你想使用更具描述性的標題，可以參考：

- 「安平靈糧堂20週年感恩見證」
- 「20週年主日崇拜精華」
- 「教會歷史回顧影片」
- 「弟兄姊妹感恩分享」

需要我幫你修改標題嗎？
