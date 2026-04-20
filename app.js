// ── i18n ──
const i18n = {
  en: {
    badge: '100% Client-Side Processing',
    title: 'Remove Gemini Image Watermark',
    subtitle: 'Drop your image and remove the watermark instantly. Nothing leaves your browser — no uploads, no tracking, no data stored.',
    uploadTitle: 'Drop your image here',
    uploadHint: 'or <strong>click to browse</strong>',
    modeBlend: 'Smart Repair',
    modeCrop: 'Crop',
    tolerance: 'Tolerance',
    btnProcess: 'Remove Watermark',
    btnReset: 'New Image',
    resultTitle: 'Result',
    resultLabel: 'Processed',
    btnDownload: 'Download',
    btnRetry: 'Adjust Parameters',
    footer1: 'Client-Side Only',
    footer2: 'Zero Dependencies',
    footer3: 'Nothing Uploaded',
    wmLabel: 'Watermark',
    infoDim: 'Dimensions',
    statusProcessing: 'Processing…',
    statusDone: 'Done',
    statusError: 'Error',
    cropResult: 'Processed',
    processingTime: (ms) => `✓ Done (${ms}ms)`,
  },
  zh: {
    badge: '纯前端处理 · 零隐私风险',
    title: '去除 Gemini 图片水印',
    subtitle: '上传图片，瞬间去除水印。全程在浏览器本地完成，不上传、不追踪、不存储。',
    uploadTitle: '拖拽图片到这里',
    uploadHint: '或 <strong>点击选择文件</strong>',
    modeBlend: '智能修复',
    modeCrop: '裁切',
    tolerance: '容差',
    btnProcess: '去除水印',
    btnReset: '换一张',
    resultTitle: '处理结果',
    resultLabel: '处理后',
    btnDownload: '下载图片',
    btnRetry: '调整参数',
    footer1: '纯前端处理',
    footer2: '零依赖',
    footer3: '不上传服务器',
    wmLabel: '水印区域',
    infoDim: '尺寸',
    statusProcessing: '处理中…',
    statusDone: '✓ 完成',
    statusError: '处理失败',
    cropResult: '处理后',
    processingTime: (ms) => `✓ 完成 (${ms}ms)`,
  }
};

let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = i18n[lang][key];
    if (!val) return;
    if (typeof val === 'string' && val.includes('<')) el.innerHTML = val;
    else if (typeof val === 'string') el.textContent = val;
  });

  // Update overlay label
  const overlay = document.getElementById('wm-overlay');
  if (overlay) overlay.dataset.label = i18n[lang].wmLabel;
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

// Default to English
setLang('en');

// ── App logic ──
const $ = s => document.querySelector(s);
const uploadZone = $('#upload-zone');
const fileInput = $('#file-input');
const editor = $('#editor');
const srcCanvas = $('#src-canvas');
const dstCanvas = $('#dst-canvas');
const wmOverlay = $('#wm-overlay');
const wmResize = $('#wm-resize');
const resultArea = $('#result-area');
const statusEl = $('#status');
const toleranceSlider = $('#tolerance-slider');
const toleranceVal = $('#tolerance-val');
const blendParams = $('#blend-params');
const resultLabel = $('#result-label');

let srcCtx = srcCanvas.getContext('2d');
let img = new Image();
let imgW, imgH;
let wmRect = { x: 0, y: 0, w: 0, h: 0 };
let mode = 'blend';

toleranceSlider.addEventListener('input', () => { toleranceVal.textContent = toleranceSlider.value; });

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    blendParams.style.display = mode === 'blend' ? 'flex' : 'none';
  });
});

// --- Upload ---
uploadZone.addEventListener('click', () => fileInput.click());
uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => { if (fileInput.files.length) loadFile(fileInput.files[0]); });

function loadFile(file) {
  if (!file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = e => {
    img.onload = () => setupEditor();
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function setupEditor() {
  imgW = img.naturalWidth;
  imgH = img.naturalHeight;

  const MAX_DIM = 4096;
  if (imgW > MAX_DIM || imgH > MAX_DIM) {
    const scale = MAX_DIM / Math.max(imgW, imgH);
    imgW = Math.round(imgW * scale);
    imgH = Math.round(imgH * scale);
  }

  srcCanvas.width = imgW;
  srcCanvas.height = imgH;
  srcCtx.drawImage(img, 0, 0, imgW, imgH);

  const dimLabel = i18n[currentLang].infoDim;
  $('#img-info').innerHTML = `
    <span><span class="label">${dimLabel}</span>${imgW} × ${imgH}</span>
    <span class="dot"></span>
    <span>${(fileInput.files[0]?.size / 1024).toFixed(0)} KB</span>
  `;

  const isSmallImage = Math.max(imgW, imgH) < 800;
  const boxSide = isSmallImage ? 60 : 90;
  const marginOffset = isSmallImage ? 12 : 24;

  wmRect = {
    x: imgW - boxSide - marginOffset,
    y: imgH - boxSide - marginOffset,
    w: boxSide, h: boxSide
  };
  wmRect.x = Math.max(0, wmRect.x);
  wmRect.y = Math.max(0, wmRect.y);

  uploadZone.classList.add('has-file');
  editor.classList.add('active');
  resultArea.classList.remove('active');
  statusEl.textContent = '';
  statusEl.className = 'status';
  updateOverlay();
}

function updateOverlay() {
  const rect = srcCanvas.getBoundingClientRect();
  const sx = rect.width / imgW;
  const sy = rect.height / imgH;
  wmOverlay.style.left = (wmRect.x * sx) + 'px';
  wmOverlay.style.top = (wmRect.y * sy) + 'px';
  wmOverlay.style.width = (wmRect.w * sx) + 'px';
  wmOverlay.style.height = (wmRect.h * sy) + 'px';
}

// --- Drag & Resize ---
let dragging = false, resizing = false, dragStart = {};

wmOverlay.addEventListener('mousedown', e => {
  if (e.target === wmResize) return;
  e.preventDefault();
  dragging = true;
  const rect = srcCanvas.getBoundingClientRect();
  dragStart = { mx: e.clientX, my: e.clientY, rx: wmRect.x, ry: wmRect.y, sx: imgW / rect.width, sy: imgH / rect.height };
});
wmResize.addEventListener('mousedown', e => {
  e.preventDefault(); e.stopPropagation();
  resizing = true;
  const rect = srcCanvas.getBoundingClientRect();
  dragStart = { mx: e.clientX, my: e.clientY, rw: wmRect.w, rh: wmRect.h, sx: imgW / rect.width, sy: imgH / rect.height };
});

document.addEventListener('mousemove', e => {
  if (dragging) {
    const dx = (e.clientX - dragStart.mx) * dragStart.sx;
    const dy = (e.clientY - dragStart.my) * dragStart.sy;
    wmRect.x = Math.max(0, Math.min(imgW - wmRect.w, Math.round(dragStart.rx + dx)));
    wmRect.y = Math.max(0, Math.min(imgH - wmRect.h, Math.round(dragStart.ry + dy)));
    updateOverlay();
  } else if (resizing) {
    const dx = (e.clientX - dragStart.mx) * dragStart.sx;
    const dy = (e.clientY - dragStart.my) * dragStart.sy;
    wmRect.w = Math.max(20, Math.min(imgW - wmRect.x, Math.round(dragStart.rw + dx)));
    wmRect.h = Math.max(10, Math.min(imgH - wmRect.y, Math.round(dragStart.rh + dy)));
    updateOverlay();
  }
});
document.addEventListener('mouseup', () => { dragging = false; resizing = false; });

// Touch support
wmOverlay.addEventListener('touchstart', e => {
  if (e.target === wmResize) return;
  e.preventDefault(); dragging = true;
  const t = e.touches[0], rect = srcCanvas.getBoundingClientRect();
  dragStart = { mx: t.clientX, my: t.clientY, rx: wmRect.x, ry: wmRect.y, sx: imgW / rect.width, sy: imgH / rect.height };
}, { passive: false });
wmResize.addEventListener('touchstart', e => {
  e.preventDefault(); e.stopPropagation(); resizing = true;
  const t = e.touches[0], rect = srcCanvas.getBoundingClientRect();
  dragStart = { mx: t.clientX, my: t.clientY, rw: wmRect.w, rh: wmRect.h, sx: imgW / rect.width, sy: imgH / rect.height };
}, { passive: false });
document.addEventListener('touchmove', e => {
  if (!dragging && !resizing) return;
  const t = e.touches[0];
  if (dragging) {
    const dx = (t.clientX - dragStart.mx) * dragStart.sx;
    const dy = (t.clientY - dragStart.my) * dragStart.sy;
    wmRect.x = Math.max(0, Math.min(imgW - wmRect.w, Math.round(dragStart.rx + dx)));
    wmRect.y = Math.max(0, Math.min(imgH - wmRect.h, Math.round(dragStart.ry + dy)));
    updateOverlay();
  } else if (resizing) {
    const dx = (t.clientX - dragStart.mx) * dragStart.sx;
    const dy = (t.clientY - dragStart.my) * dragStart.sy;
    wmRect.w = Math.max(20, Math.min(imgW - wmRect.x, Math.round(dragStart.rw + dx)));
    wmRect.h = Math.max(10, Math.min(imgH - wmRect.y, Math.round(dragStart.rh + dy)));
    updateOverlay();
  }
}, { passive: false });
document.addEventListener('touchend', () => { dragging = false; resizing = false; });

// --- Processing ---
function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + (type || '');
}

$('#btn-process').addEventListener('click', process);
$('#btn-download').addEventListener('click', download);
$('#btn-reset').addEventListener('click', reset);
$('#btn-retry').addEventListener('click', () => resultArea.classList.remove('active'));

function process() {
  setStatus(i18n[currentLang].statusProcessing, 'processing');
  requestAnimationFrame(() => {
    setTimeout(() => {
      try {
        const t0 = performance.now();
        const srcData = srcCtx.getImageData(0, 0, imgW, imgH);

        if (mode === 'crop') {
          cropAndShow(srcData);
        } else {
          blendAndShow(srcData);
        }

        const elapsed = (performance.now() - t0).toFixed(0);
        setStatus(i18n[currentLang].processingTime(elapsed), 'done');
        resultArea.classList.add('active');
      } catch (err) {
        console.error(err);
        setStatus(i18n[currentLang].statusError + ': ' + err.message, 'error');
      }
    }, 16);
  });
}

function cropAndShow(srcData) {
  const { x, y, w, h } = wmRect;
  const cropH = y + 2;
  dstCanvas.width = imgW;
  dstCanvas.height = cropH;
  const ctx = dstCanvas.getContext('2d');
  ctx.putImageData(new ImageData(
    new Uint8ClampedArray(srcData.data.buffer.slice(0, cropH * imgW * 4)),
    imgW, cropH
  ), 0, 0);
  resultLabel.textContent = i18n[currentLang].cropResult + ' (' + imgW + ' × ' + cropH + ')';
}

/**
 * Intelligent Watermark Removal:
 * 1. Estimates local background using bilinear interpolation of selection boundaries.
 * 2. Thresholds image against estimated background to detect watermark.
 * 3. Expands the mask slightly to cover anti-aliasing edges.
 * 4. Applies inpainting (local diffusion) for seamless blending.
 */
function blendAndShow(srcData) {
  const { x: rx, y: ry, w: rw, h: rh } = wmRect;
  const tolerance = parseInt(toleranceSlider.value);
  const threshold = 140 - tolerance;
  const src = srcData.data;
  const w = imgW, h = imgH;
  const dst = new Uint8ClampedArray(src);

  const getIdx = (x, y) => (y * w + x) * 4;
  const clampX = x => Math.max(0, Math.min(w - 1, x));
  const clampY = y => Math.max(0, Math.min(h - 1, y));

  const isWMInit = new Uint8Array(rw * rh);
  const bgData = new Float32Array(rw * rh * 3);

  // Step 1: Detect watermark pixels based on luminance diff from boundary interpolation
  for (let py = ry; py < ry + rh; py++) {
    for (let px = rx; px < rx + rw; px++) {
      const i = getIdx(px, py);
      const r = src[i], g = src[i+1], b = src[i+2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      const leftI = getIdx(clampX(rx - 1), py);
      const rightI = getIdx(clampX(rx + rw), py);
      const topI = getIdx(px, clampY(ry - 1));
      const btmI = getIdx(px, clampY(ry + rh));

      const tx = rw > 1 ? (px - rx) / (rw - 1) : 0;
      const ty = rh > 1 ? (py - ry) / (rh - 1) : 0;

      const bgR = ((src[leftI]*(1-tx) + src[rightI]*tx) + (src[topI]*(1-ty) + src[btmI]*ty)) / 2;
      const bgG = ((src[leftI+1]*(1-tx) + src[rightI+1]*tx) + (src[topI+1]*(1-ty) + src[btmI+1]*ty)) / 2;
      const bgB = ((src[leftI+2]*(1-tx) + src[rightI+2]*tx) + (src[topI+2]*(1-ty) + src[btmI+2]*ty)) / 2;

      const lxi = px - rx, lyi = py - ry;
      const localIdx = (lyi * rw + lxi) * 3;
      bgData[localIdx] = bgR;
      bgData[localIdx+1] = bgG;
      bgData[localIdx+2] = bgB;

      const bgLum = 0.299 * bgR + 0.587 * bgG + 0.114 * bgB;
      const isPureWhite = (r > 240 && g > 240 && b > 240);

      if (lum - bgLum > threshold || isPureWhite) {
        isWMInit[lyi * rw + lxi] = 1;
      }
    }
  }

  // Step 2: Dilation to cover soft edges
  const isWM = new Uint8Array(rw * rh);
  const dilateR = 2;
  for (let py = ry; py < ry + rh; py++) {
    for (let px = rx; px < rx + rw; px++) {
      const lxi = px - rx, lyi = py - ry;
      if (isWMInit[lyi * rw + lxi]) {
        for (let dy = -dilateR; dy <= dilateR; dy++) {
          for (let dx = -dilateR; dx <= dilateR; dx++) {
            const nx = lxi + dx, ny = lyi + dy;
            if (nx >= 0 && nx < rw && ny >= 0 && ny < rh) {
              isWM[ny * rw + nx] = 1;
            }
          }
        }
      }
    }
  }

  // Step 3: Initialize target pixels with estimated background
  for (let py = ry; py < ry + rh; py++) {
    for (let px = rx; px < rx + rw; px++) {
      const lxi = px - rx, lyi = py - ry;
      if (isWM[lyi * rw + lxi]) {
        const i = getIdx(px, py);
        const localIdx = (lyi * rw + lxi) * 3;
        dst[i] = bgData[localIdx];
        dst[i+1] = bgData[localIdx+1];
        dst[i+2] = bgData[localIdx+2];
      }
    }
  }

  // Step 4: Diffusion passes
  const passes = 20;
  for (let pass = 0; pass < passes; pass++) {
    for (let py = ry; py < ry + rh; py++) {
      for (let px = rx; px < rx + rw; px++) {
        const lxi = px - rx, lyi = py - ry;
        if (!isWM[lyi * rw + lxi]) continue;

        let aR = 0, aG = 0, aB = 0, c = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = px + dx, ny = py + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const ni = getIdx(nx, ny);
              aR += dst[ni]; aG += dst[ni+1]; aB += dst[ni+2]; c++;
            }
          }
        }
        if (c > 0) {
          const i = getIdx(px, py);
          dst[i] = aR / c;
          dst[i+1] = aG / c;
          dst[i+2] = aB / c;
        }
      }
    }
  }

  // Subtle noise to prevent plastic look
  for (let py = ry; py < ry + rh; py++) {
    for (let px = rx; px < rx + rw; px++) {
      const lxi = px - rx, lyi = py - ry;
      if (isWM[lyi * rw + lxi]) {
        const i = getIdx(px, py);
        const noise = (Math.random() - 0.5) * 6;
        dst[i] = Math.max(0, Math.min(255, dst[i] + noise));
        dst[i+1] = Math.max(0, Math.min(255, dst[i+1] + noise));
        dst[i+2] = Math.max(0, Math.min(255, dst[i+2] + noise));
      }
    }
  }

  // Output
  dstCanvas.width = imgW;
  dstCanvas.height = imgH;
  const dstCtx = dstCanvas.getContext('2d');
  dstCtx.putImageData(new ImageData(dst, w, h), 0, 0);
  resultLabel.textContent = i18n[currentLang].resultLabel;
}

function download() {
  const link = document.createElement('a');
  link.download = 'cleaned.png';
  link.href = dstCanvas.toDataURL('image/png');
  link.click();
}

function reset() {
  editor.classList.remove('active');
  uploadZone.classList.remove('has-file');
  resultArea.classList.remove('active');
  statusEl.textContent = '';
  statusEl.className = 'status';
  fileInput.value = '';
  img = new Image();
}

window.addEventListener('resize', () => { if (editor.classList.contains('active')) updateOverlay(); });
