# 🧹 Clean Gemini Watermark

Instant, private, and smart Gemini image watermark removal.

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>

## English

### Features
- **Smart Precision**: Bounding box anchored to the exact bottom-right position where Gemini watermarks appear, ensuring perfect alignment across all aspect ratios (1:1, 9:16, 4:3, etc.).
- **Soft Alpha Inversion**: A sophisticated texture-preserving algorithm that recovers original pixels using algebraic inversion while eliminating edge artifacts through Gaussian-blurred soft masks.
- **Privacy First**: 100% client-side processing. Your images never leave your browser. Zero tracking, zero uploads.
- **Premium UI**: Modern dark-themed interface with smooth transitions and bilingual support (English/Chinese).
- **Flexible Controls**: Manual drag-and-resize support for non-standard watermarks and adjustable tolerance settings.

### Usage
1. Open [index.html](index.html) in any modern browser.
2. Drag and drop your Gemini-generated image.
3. The watermark will be automatically targeted. Click **"Remove Watermark"**.
4. Download your cleaned image.

### Technical Details
- **Core Algorithm**: **Soft Alpha Inversion** — Inverts Gemini's watermark overlay equation (`original = (output - α * 255) / (1 - α)`) using calibrated alpha masks.
- **Boundary Healing**: Implements a post-processing pass to detect and correct JPEG ringing artifacts (DCT undershoot) at the watermark boundaries by nudging brightness toward local references.
- **Confidence Blending**: Uses alpha-weighted confidence ramps to prevent over-correction in low-alpha boundary areas, ensuring seamless blending with the original background.
- **Auto Watermark Sizing**: Adapts to Gemini's rules (>1024px both dimensions → 96×96, else → 48×48).
- **Dependencies**: Zero. Pure Vanilla JS and Canvas API.

---

<a name="简体中文"></a>

## 简体中文

### 功能特性
- **精准对位**: 针对 Gemini 水印在右下角的固定偏移量进行了像素级适配，完美兼容各种比例（正方形、竖屏 9:16、4:3 等）。
- **软 Alpha 反相**: 采用纹理保留算法，通过代数反相精确恢复原始像素，并利用高斯模糊软化遮罩边缘，彻底消除边缘伪影。
- **隐私至上**: 100% 纯前端处理，图片不会上传到任何服务器，确保您的数据隐私。
- **极简设计**: 全新的深色系高级感 UI，支持中英文双语切换。
- **灵活控制**: 支持鼠标/触摸控制水印区域大小和位置，容差可调，应对不同复杂背景。

### 如何使用
1. 在浏览器中打开 `index.html`。
2. 拖入或选择包含 Gemini 水印的图片。
3. 水印会被默认框选，点击 **“去除水印”**。
4. 预览并下载处理后的图片。

### 技术详情
- **核心算法**: **软 Alpha 反相 (Soft Alpha Inversion)** — 基于标定的 alpha 遮罩精确反解水印叠加方程（`原始像素 = (当前像素 - α * 255) / (1 - α)`）。
- **边界愈合 (Boundary Healing)** — 针对 JPEG 压缩产生的 DCT 振铃效应（暗环）进行后期亮度补偿，通过分析邻域参考值平滑修复交界处异常。
- **置信度融合**: 引入 alpha 权重坡度，在低透明度边界区域动态调整修正力度，防止过度修正导致的偏色。
- **自适应水印尺寸**: 根据 Gemini 规则自动选择（>1024px 两个维度 → 96×96，否则 → 48×48）。
- **零依赖**: 纯原生 JavaScript 与 Canvas API 实现。

---

## Deployment / 部署

### Cloudflare Pages
```bash
npx wrangler pages deploy ./
```

### Local Development / 本地开发
Simply serve the directory using any local server or open `index.html` directly.  
只需使用任何本地服务器托管目录，或者直接打开 `index.html`。
