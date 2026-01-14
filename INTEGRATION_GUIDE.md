# 安平靈糧堂 20 週年網站整合說明

## 📋 專案概述

成功整合 20th.html 作為入口網站，並加入影片投票功能。整體採用航空主題設計，配色以金色 (#be9e69) 為主調。

## 🎨 設計風格

### 色彩系統
- **主色調**: 金色 `#be9e69` (航空金)
- **輔助色**: 深金 `#d4af7a`、棕色 `#8b7355`
- **背景**: 深色系 `#1a1a1a`、`#141414`、黑色
- **文字**: 白色、灰階

### UI 特色
- **玻璃擬態** (Glassmorphism): 使用 `backdrop-blur-md` 和半透明背景
- **金色光暈**: 使用 `shadow-[0_0_30px_rgba(190,158,105,0.3)]`
- **航空元素**: 飛機圖標、登機證、航線等視覺隱喻
- **動畫效果**: hover 縮放、平滑過渡、脈衝動畫

## 📁 檔案結構

```
d:\Projects\apbolc_voting_20th\
├── 20th.html                          # 原始入口頁面
├── public/
│   └── 20th.html                      # Next.js 靜態資源 (已同步)
├── src/
│   ├── app/
│   │   ├── page.tsx                   # 主頁 (重定向到 20th.html)
│   │   ├── vote/
│   │   │   └── page.tsx               # 投票頁面
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts       # NextAuth API
│   │   └── actions/
│   │       └── vote.ts                # 投票 Server Actions
│   ├── components/
│   │   ├── VideoCard.tsx              # 影片卡片 (深色主題)
│   │   ├── Leaderboard.tsx            # 排行榜 (深色主題)
│   │   ├── SocialLoginButtons.tsx     # 社群登入按鈕
│   │   └── AuthProvider.tsx           # Session Provider
│   └── lib/
│       └── auth.ts                    # NextAuth 配置
└── .env.local                         # 環境變數 (需設定 OAuth)
```

## 🚀 頁面流程

### 1. 入口頁面 (`/` → `/20th.html`)
- 使用者訪問根路徑會自動重定向到 `20th.html`
- 展示完整的 20 週年歷史時間軸
- 包含互動式 AI 聊天機器人
- 底部有「立即前往投票」按鈕

### 2. 投票頁面 (`/vote`)
- 深色主題，配合 20th.html 的航空風格
- 社群登入 (Google / Facebook / LINE)
- 影片觀看與投票功能
- 即時排行榜顯示

## 🔐 OAuth 設定

### 需要設定的環境變數

在 `.env.local` 中設定：

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=SNdnY/chUiJyMq059QPnIoZFMsOYiVPaJ6Um3d7TsSc=

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret

# LINE OAuth
LINE_CLIENT_ID=your-channel-id
LINE_CLIENT_SECRET=your-channel-secret
```

### Callback URLs 設定

在各 OAuth 平台設定以下 callback URLs：

- **開發環境**: `http://localhost:3000/api/auth/callback/{provider}`
- **生產環境**: `https://your-domain.com/api/auth/callback/{provider}`

詳細設定步驟請參考 `OAUTH_SETUP.md`

## 🎯 主要功能

### 20th.html 入口頁面
- ✅ 20 年歷史時間軸
- ✅ 互動式時間軸飛機動畫
- ✅ AI 聊天機器人 (需設定 Gemini API Key)
- ✅ 屬靈氣象預報功能
- ✅ 影片票選入口按鈕

### 投票系統 (/vote)
- ✅ 社群登入整合 (Google/Facebook/LINE)
- ✅ YouTube 影片嵌入播放
- ✅ 一人一票投票機制
- ✅ 即時排行榜圖表
- ✅ 深色主題 UI

## 🎨 UI 組件樣式指南

### 按鈕樣式
```html
<!-- 主要 CTA 按鈕 (金色漸層) -->
<button class="px-12 py-5 bg-gradient-to-r from-[#be9e69] to-[#d4af7a] hover:from-[#d4af7a] hover:to-[#be9e69] text-black font-bold text-xl rounded-xl shadow-[0_0_30px_rgba(190,158,105,0.4)] hover:shadow-[0_0_50px_rgba(190,158,105,0.8)] transition-all duration-300 transform hover:scale-105">
  立即前往投票
</button>
```

### 卡片樣式
```html
<!-- 玻璃擬態卡片 -->
<div class="bg-black/40 backdrop-blur-md border border-[#be9e69]/30 rounded-2xl p-6 hover:border-[#be9e69] transition-all">
  內容
</div>
```

### 文字樣式
```html
<!-- 金色標題 -->
<h2 class="text-4xl font-serif text-[#be9e69]">標題</h2>

<!-- 白色內文 -->
<p class="text-white">內文</p>

<!-- 灰色次要文字 -->
<p class="text-gray-400">次要資訊</p>
```

## 📱 響應式設計

所有組件都已針對行動裝置優化：
- 使用 Tailwind 的 `md:` 斷點
- 彈性網格布局 (`grid-cols-1 md:grid-cols-2`)
- 觸控友好的按鈕尺寸

## 🔄 開發流程

### 啟動開發伺服器
```bash
npm run dev
```

### 訪問頁面
- 入口: http://localhost:3000 (自動重定向到 20th.html)
- 投票: http://localhost:3000/vote

### 建置生產版本
```bash
npm run build
npm start
```

## ⚠️ 注意事項

1. **OAuth 憑證**: 必須先設定 OAuth 憑證才能使用登入功能
2. **Gemini API**: 20th.html 的 AI 功能需要 Gemini API Key
3. **Supabase**: 投票功能需要 Supabase 資料庫連線
4. **環境變數**: `.env.local` 不會被 git 追蹤，部署時需要重新設定

## 🎉 完成項目

- ✅ 20th.html 作為入口網站
- ✅ 深色主題投票系統
- ✅ 社群登入整合
- ✅ UI 風格統一 (航空金色主題)
- ✅ 響應式設計
- ✅ 玻璃擬態效果
- ✅ 動畫與互動效果
- ✅ 投票入口按鈕整合

## 📞 技術支援

如有問題，請檢查：
1. `.env.local` 環境變數是否正確設定
2. OAuth callback URLs 是否正確配置
3. Supabase 資料庫連線是否正常
4. 開發伺服器是否正常運行

---

**專案完成時間**: 2026-01-13
**設計風格**: 航空主題 + 深色玻璃擬態
**主色調**: 金色 #be9e69
