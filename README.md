# Clean Gemini Watermark

去除 Gemini AI 生成图片右下角水印的小工具。基于 OpenCV.js (WASM) Inpainting 算法。

纯前端处理，图片不离开浏览器。

## 功能

- 支持 JPG / PNG / WebP
- 拖拽上传
- 可拖动/缩放水印区域选框
- 两种处理模式：修补填充 / 裁切
- 本地下载

## 部署

### Cloudflare Pages

```bash
npx wrangler pages project create clean-canvas
npx wrangler pages deploy ./
```

### 本地开发

直接打开 `index.html` 即可，无依赖。
