# Android APK 構建設置指南

## 🚀 快速開始

### 1. 推送代碼到 GitHub
\`\`\`bash
git add .
git commit -m "Add Android build support"
git push origin main
\`\`\`

### 2. 啟用 GitHub Actions
1. 前往您的 GitHub 倉庫
2. 點擊 "Actions" 標籤
3. 如果是第一次使用，點擊 "I understand my workflows, go ahead and enable them"

### 3. 觸發構建
- **自動觸發**: 每次推送到 main 分支
- **手動觸發**: 在 Actions 頁面點擊 "Run workflow"

### 4. 下載 APK
構建完成後：
1. 前往 Actions 頁面
2. 點擊最新的工作流程運行
3. 在 "Artifacts" 區域下載 APK
4. 或在 Releases 頁面下載

## 🔧 本地開發設置

### 安裝 Android Studio
1. 下載 [Android Studio](https://developer.android.com/studio)
2. 安裝 Android SDK
3. 設置環境變量

### 初始化 Capacitor
\`\`\`bash
# 安裝 Capacitor CLI
npm install -g @capacitor/cli

# 添加 Android 平台
npx cap add android

# 同步項目
npx cap sync android
\`\`\`

### 本地構建 APK
\`\`\`bash
# 構建 Web 應用
npm run export

# 同步到 Android
npx cap copy android
npx cap sync android

# 構建 APK
cd android
./gradlew assembleRelease
\`\`\`

## 📱 APK 簽名（生產環境）

### 創建簽名密鑰
\`\`\`bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
\`\`\`

### 配置 GitHub Secrets
在 GitHub 倉庫設置中添加：
- `KEYSTORE_FILE`: Base64 編碼的 keystore 文件
- `KEYSTORE_PASSWORD`: Keystore 密碼
- `KEY_ALIAS`: 密鑰別名
- `KEY_PASSWORD`: 密鑰密碼

### 更新 GitHub Actions
修改 `.github/workflows/build-android.yml` 以使用真實簽名。

## 🐛 常見問題

### 構建失敗
1. 檢查 Node.js 版本（需要 18+）
2. 確認所有依賴已正確安裝
3. 查看 Actions 日誌獲取詳細錯誤信息

### APK 無法安裝
1. 啟用 Android 設備的「未知來源」安裝
2. 確認 APK 文件完整下載
3. 檢查設備 Android 版本兼容性

### 權限問題
確保 GitHub Actions 有足夠權限：
1. 前往倉庫 Settings > Actions > General
2. 設置 "Workflow permissions" 為 "Read and write permissions"

## 📊 構建狀態

[![Build Android APK](https://github.com/your-username/chinese-minesweeper/actions/workflows/build-android.yml/badge.svg)](https://github.com/your-username/chinese-minesweeper/actions/workflows/build-android.yml)

## 🔄 自動化流程

1. **代碼推送** → 觸發 GitHub Actions
2. **環境設置** → Node.js, Java, Android SDK
3. **依賴安裝** → npm install
4. **Web 構建** → Next.js export
5. **Android 同步** → Capacitor sync
6. **APK 構建** → Gradle assembleRelease
7. **文件上傳** → Artifacts 和 Releases

現在您可以享受全自動的 APK 構建流程！
