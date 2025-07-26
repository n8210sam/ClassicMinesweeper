# Chinese Minesweeper 中文踩地雷

一個使用 Next.js 和 Capacitor 開發的中文踩地雷遊戲，支援 Web 和 Android 平台。

## 🎮 功能特色

- 🇹🇼 **繁體中文界面** - 完全本地化的遊戲體驗
- 📱 **手機觸控優化** - 專為觸控設備設計的操作方式
- ⚙️ **多種難度選擇** - 初級、中級、高級三種預設難度
- 🎯 **自定義模式** - 可自由設定格子數和地雷數
- 🎨 **美觀 UI 設計** - 使用 Tailwind CSS 和 shadcn/ui
- 🚀 **跨平台支援** - Web 和 Android 雙平台

## 📱 下載 APK

### 自動構建
每次推送到 main 分支時，GitHub Actions 會自動構建 APK：

1. 前往 [Actions](../../actions) 頁面
2. 選擇最新的 "Build Android APK" 工作流程
3. 在 Artifacts 區域下載 `chinese-minesweeper-apk`
4. 或者在 [Releases](../../releases) 頁面下載最新版本

### 手動構建
\`\`\`bash
# 安裝依賴
npm install

# 構建 Web 應用
npm run export

# 添加 Android 平台
npx cap add android

# 同步到 Android
npx cap sync android

# 構建 APK
cd android
./gradlew assembleRelease
\`\`\`

## 🛠️ 開發設置

### 環境要求
- Node.js 18+
- Android Studio
- Java JDK 17+

### 本地開發
\`\`\`bash
# 克隆項目
git clone https://github.com/your-username/chinese-minesweeper.git
cd chinese-minesweeper

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# Android 開發
npm run android:dev
\`\`\`

## 🎯 遊戲規則

1. **點擊格子** - 揭開格子查看內容
2. **長按格子** - 標記/取消標記地雷
3. **數字提示** - 顯示周圍地雷數量
4. **獲勝條件** - 揭開所有非地雷格子
5. **失敗條件** - 點到地雷

## 📊 難度設定

| 難度 | 格子大小 | 地雷數 |
|------|----------|--------|
| 初級 | 9×9 | 10 |
| 中級 | 16×16 | 40 |
| 高級 | 16×30 | 99 |
| 自定義 | 5×5 到 30×30 | 可調整 |

## 🔧 技術棧

- **前端**: Next.js 15, React 19, TypeScript
- **樣式**: Tailwind CSS, shadcn/ui
- **移動端**: Capacitor
- **構建**: GitHub Actions
- **部署**: Vercel (Web), GitHub Releases (APK)

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 文件

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 聯繫

如有問題或建議，請開啟 Issue 或聯繫開發者。
