# 應用圖標和啟動畫面指南

## 🎨 設計說明

### 應用圖標設計
- **主題**: 踩地雷遊戲元素
- **顏色**: 藍色主調 (#1e40af) 配白色和紅色
- **元素**: 地雷、旗幟、網格
- **風格**: 現代扁平化設計

### 啟動畫面設計
- **背景**: 藍色漸變 (#1e40af)
- **內容**: 應用圖標 + 中英文標題 + 載入動畫
- **持續時間**: 2秒自動隱藏
- **效果**: 淡出過渡動畫

## 📐 圖標尺寸規格

### Android 圖標尺寸
| 密度 | 尺寸 | 文件名 |
|------|------|--------|
| ldpi | 36×36 | icon-ldpi.png |
| mdpi | 48×48 | icon-mdpi.png |
| hdpi | 72×72 | icon-hdpi.png |
| xhdpi | 96×96 | icon-xhdpi.png |
| xxhdpi | 144×144 | icon-xxhdpi.png |
| xxxhdpi | 192×192 | icon-xxxhdpi.png |

### 啟動畫面尺寸
| 方向 | 密度 | 尺寸 |
|------|------|------|
| 橫向 | ldpi | 320×200 |
| 橫向 | mdpi | 480×320 |
| 橫向 | hdpi | 800×480 |
| 橫向 | xhdpi | 1280×720 |
| 直向 | ldpi | 200×320 |
| 直向 | mdpi | 320×480 |
| 直向 | hdpi | 480×800 |
| 直向 | xhdpi | 720×1280 |

## 🛠️ 自定義圖標

### 1. 準備圖標文件
將您的圖標文件放在 `resources/` 目錄：
\`\`\`
resources/
├── icon.png (1024×1024)
├── splash.png (2732×2732)
└── android/
    ├── icon-ldpi.png
    ├── icon-mdpi.png
    └── ...
\`\`\`

### 2. 自動生成資源
\`\`\`bash
# 安裝資源生成工具
npm install -g @capacitor-community/capacitor-resources

# 生成所有尺寸的圖標和啟動畫面
npm run resources

# 僅生成 Android 資源
npm run resources:android
\`\`\`

### 3. 手動替換
如果需要手動替換，將圖標文件複製到：
\`\`\`
android/app/src/main/res/
├── mipmap-ldpi/ic_launcher.png
├── mipmap-mdpi/ic_launcher.png
├── mipmap-hdpi/ic_launcher.png
├── mipmap-xhdpi/ic_launcher.png
├── mipmap-xxhdpi/ic_launcher.png
└── mipmap-xxxhdpi/ic_launcher.png
\`\`\`

## 🎨 設計建議

### 圖標設計原則
1. **簡潔明瞭**: 避免過於複雜的細節
2. **識別性強**: 在小尺寸下仍能清楚識別
3. **品牌一致**: 與應用主題保持一致
4. **適配性好**: 在不同背景下都能清楚顯示

### 啟動畫面設計原則
1. **載入時間**: 控制在 2-3 秒內
2. **品牌展示**: 突出應用名稱和特色
3. **視覺連貫**: 與主界面風格保持一致
4. **性能優化**: 避免過大的圖片文件

## 🔧 配置選項

### Capacitor 配置
在 `capacitor.config.ts` 中可以調整：
- 啟動畫面持續時間
- 背景顏色
- 動畫效果
- 全屏模式

### Android 主題配置
在 `styles.xml` 中可以自定義：
- 主題顏色
- 狀態欄樣式
- 啟動畫面佈局
- 夜間模式支持

## 📱 測試建議

1. **多設備測試**: 在不同尺寸和密度的設備上測試
2. **系統版本**: 測試不同 Android 版本的兼容性
3. **主題模式**: 測試淺色和深色主題
4. **性能檢查**: 確保啟動畫面不影響應用啟動速度

現在您的應用擁有專業的圖標和啟動畫面了！
