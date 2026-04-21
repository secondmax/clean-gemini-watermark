# 🧹 Clean Gemini Watermark

Instant, private, and smart Gemini image watermark removal.

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>

## English

### Features
- **Smart Precision**: Bounding box anchored to the exact bottom-right position where Gemini watermarks appear, ensuring perfect alignment across all aspect ratios (1:1, 9:16, 4:3, etc.).
- **Local Inpainting**: Uses a custom diffusion-based inpainting algorithm to smoothly blend the background without needing heavy dependencies like OpenCV.
- **Privacy First**: 100% client-side processing. Your images never leave your browser. Zero tracking, zero uploads.
- **Premium UI**: Modern dark-themed interface with smooth transitions and bilingual support (English/Chinese).
- **Flexible Controls**: Manual drag-and-resize support for non-standard watermarks and adjustable tolerance settings.

### Usage
1. Open [index.html](index.html) in any modern browser.
2. Drag and drop your Gemini-generated image.
3. The watermark will be automatically targeted. Click **"Remove Watermark"**.
4. Download your cleaned image.

### Technical Details
- **Algorithm**: Reverse Alpha Blending — uses calibrated 48×48 / 96×96 alpha masks to precisely invert Gemini's watermark overlay equation (`original = (watermarked − α × logo) / (1 − α)`).
- **Auto Watermark Sizing**: Adapts to Gemini's rules (>1024px both dimensions → 96×96, else → 48×48).
- **Performance**: Sub-100ms processing for standard images.
- **Dependencies**: Zero. Pure Vanilla JS and Canvas API.
- **Reference**: [GeminiWatermarkTool](https://github.com/allenk/GeminiWatermarkTool) by Allen Kuo (MIT License).

---

<a name="简体中文"></a>

## 简体中文

### 功能特性
- **精准对位**: 针对 Gemini 水印在右下角的固定偏移量进行了像素级适配，完美兼容各种比例（正方形、竖屏 9:16、4:3 等）。
- **本地智能修补**: 采用自定义的局部扩散（Diffusion）算法，无需加载 OpenCV 等沉重库即可实现平滑的背景融合。
- **隐私至上**: 100% 纯前端处理，图片不会上传到任何服务器，确保您的数据隐私。
- **极简设计**: 全新的深色系高级感 UI，支持中英文双语切换。
- **灵活控制**: 支持鼠标/触摸控制水印区域大小和位置，容差可调，应对不同复杂背景。

### 如何使用
1. 在浏览器中打开 `index.html`。
2. 拖入或选择包含 Gemini 水印的图片。
3. 水印会被默认框选，点击 **“去除水印”**。
4. 预览并下载处理后的图片。

### 技术栈
- **核心算法**: 反向 Alpha 混合 — 使用标定的 48×48 / 96×96 alpha mask 精确反解 Gemini 水印叠加方程（`原始像素 = (水印像素 − α × logo) / (1 − α)`）。
- **自适应水印尺寸**: 根据 Gemini 规则自动选择（>1024px 两个维度 → 96×96，否则 → 48×48）。
- **运行性能**: 标准尺寸图片处理时间小于 100ms。
- **依赖库**: 零依赖。纯原生 JavaScript 与 Canvas API 实现。
- **参考**: [GeminiWatermarkTool](https://github.com/allenk/GeminiWatermarkTool) by Allen Kuo (MIT License)。

---

## Deployment / 部署

### Cloudflare Pages
```bash
npx wrangler pages deploy ./
```

### Local Development / 本地开发
Simply serve the directory using any local server or open `index.html` directly.  
只需使用任何本地服务器托管目录，或者直接打开 `index.html`。
