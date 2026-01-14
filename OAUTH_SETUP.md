# 社群登入設定指南

本專案整合了 Google、Facebook 和 LINE 的 OAuth 登入功能。請依照以下步驟設定：

## 1. 環境變數設定

複製 `.env.local.example` 並重新命名為 `.env.local`，然後填入以下資訊：

### NextAuth 基本設定

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<使用以下指令生成>
```

生成 NEXTAUTH_SECRET：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 2. Google OAuth 設定

### 步驟：
1. 前往 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 建立新專案或選擇現有專案
3. 啟用「Google+ API」
4. 建立「OAuth 2.0 用戶端 ID」憑證
5. 應用程式類型選擇「網頁應用程式」
6. 已授權的重新導向 URI 新增：
   - `http://localhost:3000/api/auth/callback/google`
   - 生產環境：`https://your-domain.com/api/auth/callback/google`

### 環境變數：
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## 3. Facebook OAuth 設定

### 步驟：
1. 前往 [Facebook Developers](https://developers.facebook.com/apps/)
2. 建立新應用程式，選擇「消費者」類型
3. 在應用程式設定中，新增「Facebook 登入」產品
4. 在「Facebook 登入」→「設定」中，新增有效的 OAuth 重新導向 URI：
   - `http://localhost:3000/api/auth/callback/facebook`
   - 生產環境：`https://your-domain.com/api/auth/callback/facebook`
5. 在「設定」→「基本資料」中取得應用程式編號和密鑰

### 環境變數：
```bash
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret
```

---

## 4. LINE OAuth 設定

### 步驟：
1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 建立新的 Provider（如果還沒有）
3. 建立新的 Channel，類型選擇「LINE Login」
4. 在 Channel 設定中：
   - 啟用「LINE Login」
   - Callback URL 新增：
     - `http://localhost:3000/api/auth/callback/line`
     - 生產環境：`https://your-domain.com/api/auth/callback/line`
5. 在「Basic settings」中取得 Channel ID 和 Channel Secret

### 環境變數：
```bash
LINE_CLIENT_ID=your-channel-id
LINE_CLIENT_SECRET=your-channel-secret
```

---

## 5. 啟動應用程式

設定完成後，重新啟動開發伺服器：

```bash
npm run dev
```

訪問 http://localhost:3000，應該可以看到三個社群登入按鈕。

---

## 注意事項

- **開發環境**：使用 `http://localhost:3000` 作為 callback URL
- **生產環境**：記得更新 `NEXTAUTH_URL` 和所有 OAuth 平台的 callback URLs
- **安全性**：`.env.local` 已加入 `.gitignore`，請勿將憑證提交到版本控制
- **測試**：建議先在開發環境測試所有登入流程後再部署到生產環境

---

## 疑難排解

### 登入後跳轉錯誤
- 檢查 `NEXTAUTH_URL` 是否正確
- 確認 OAuth 平台的 callback URL 設定正確

### 無法取得使用者資訊
- 確認 OAuth 應用程式已啟用必要的權限（profile, email）
- 檢查環境變數是否正確設定

### LINE 登入失敗
- LINE 的 callback URL 必須完全匹配，包括協議（http/https）
- 確認 Channel 已啟用「LINE Login」功能
