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
    tolerance: 'Strength',
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
    tolerance: '强度',
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

// ── Alpha Mask Data (extracted from mark.png, base64 encoded 1 byte/pixel) ──
const MASK_MAX_ALPHA = 0.52;
const MASK_LOGO_VALUE = 255; // white overlay
const MASK_96 = { w: 96, h: 96, data: "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" };
const MASK_48 = { w: 48, h: 48, data: "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" };

function decodeMask(mask) {
  const raw = atob(mask.data);
  const a = new Float32Array(mask.w * mask.h);
  for (let i = 0; i < raw.length; i++) a[i] = (raw.charCodeAt(i) / 255) * MASK_MAX_ALPHA;
  return a;
}

// Dilate mask by radius pixels — expands watermark coverage to catch edge pixels
function dilateMask(alpha, w, h, radius) {
  const result = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let maxA = alpha[y * w + x];
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          maxA = Math.max(maxA, alpha[ny * w + nx]);
        }
      }
      result[y * w + x] = maxA;
    }
  }
  return result;
}

function getWatermarkMask(imgW, imgH) {
  // Gemini rules: >1024 on both dims → 96×96 (margin 64), else → 48×48 (margin 32)
  return (imgW > 1024 && imgH > 1024)
    ? { mask: MASK_96, margin: 64 }
    : { mask: MASK_48, margin: 32 };
}


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

// Version marker — confirms the latest algorithm is loaded
document.body.dataset.algoVersion = '2.1.0-bilateral-floor';
console.log('%c🧹 Clean Gemini Watermark %cv2.1.0-bilateral-floor',
  'font-weight:bold;font-size:1.1em;color:#a78bfa',
  'color:#a1a1aa;font-size:0.9em');
console.log('  Algorithm: Background-Aware Alpha Inversion');
console.log('  Changes: bilateral BG estimation, horizontal interpolation, background floor');

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

  // Use Gemini's actual watermark size rules
  const { mask: wmMask, margin: wmMargin } = getWatermarkMask(imgW, imgH);
  const boxSide = wmMask.w;
  const marginOffset = wmMargin;

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
 * Background-Aware Alpha Inversion
 *
 * Uses algebraic inversion to recover original pixels, combined with
 * per-row background estimation and a strength map that cuts off at low alpha
 * to avoid over-correcting JPEG compression ringing artifacts at the boundary.
 *
 * Watermark formula:  output = original * (1 - α) + white * α
 * Recovery formula:   original = (output - α * 255) / (1 - α)
 */
function blendAndShow(srcData) {
  const ALGO_VERSION = '2.1.0-bilateral-floor';
  const { x: baseRx, y: baseRy } = wmRect;
  const src = srcData.data;
  const w = imgW, h = imgH;
  const dst = new Uint8ClampedArray(src);

  const { mask: maskDef } = getWatermarkMask(imgW, imgH);
  const rawAlpha = decodeMask(maskDef);
  const mW = maskDef.w, mH = maskDef.h;

  const tolerance = parseInt(toleranceSlider.value, 10); // 50-150, default 100

  console.log('%c[CleanGemini v' + ALGO_VERSION + '] %cProcessing…',
    'font-weight:bold;color:#a78bfa', 'color:#a1a1aa');
  console.log('  Mask: ' + mW + '×' + mH + ' | Image: ' + w + '×' + h +
    ' | Watermark @ (' + baseRx + ',' + baseRy + ') | Tolerance: ' + tolerance);

  // --- 1. Dilate mask by 1px for edge coverage ---
  const dilated = new Float32Array(mW * mH);
  for (let y = 0; y < mH; y++) {
    for (let x = 0; x < mW; x++) {
      let maxA = rawAlpha[y * mW + x];
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= mH) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= mW) continue;
          maxA = Math.max(maxA, rawAlpha[ny * mW + nx]);
        }
      }
      dilated[y * mW + x] = maxA;
    }
  }

  // --- 2. Light box blur on dilated mask for edge feathering ---
  const blurR = 1;
  const feathered = new Float32Array(mW * mH);
  const tmp = new Float32Array(mW * mH);
  // Horizontal pass
  for (let y = 0; y < mH; y++) {
    for (let x = 0; x < mW; x++) {
      let sum = 0, cnt = 0;
      for (let dx = -blurR; dx <= blurR; dx++) {
        const nx = x + dx;
        if (nx >= 0 && nx < mW) { sum += dilated[y * mW + nx]; cnt++; }
      }
      tmp[y * mW + x] = sum / cnt;
    }
  }
  // Vertical pass
  for (let y = 0; y < mH; y++) {
    for (let x = 0; x < mW; x++) {
      let sum = 0, cnt = 0;
      for (let dy = -blurR; dy <= blurR; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < mH) { sum += tmp[ny * mW + x]; cnt++; }
      }
      feathered[y * mW + x] = sum / cnt;
    }
  }

  // --- 3. Estimate background bilaterally (left + right, interpolated) ---
  const SAMPLE_W = 15;
  const leftBG = new Float32Array(mH * 3);   // per-row left sample
  const rightBG = new Float32Array(mH * 3);  // per-row right sample
  const globalBG = [0, 0, 0];
  let globalCnt = 0;

  for (let y = 0; y < mH; y++) {
    const imgY = baseRy + y;

    // Sample from left of watermark
    let lr = 0, lg = 0, lb = 0, lc = 0;
    const lsx = Math.max(0, baseRx - SAMPLE_W);
    for (let sx = lsx; sx < baseRx && sx < w; sx++) {
      const idx = (imgY * w + sx) * 4;
      lr += src[idx]; lg += src[idx + 1]; lb += src[idx + 2]; lc++;
    }
    if (lc > 0) {
      leftBG[y * 3] = lr / lc; leftBG[y * 3 + 1] = lg / lc; leftBG[y * 3 + 2] = lb / lc;
    }

    // Sample from right of watermark
    let rr = 0, rg = 0, rb = 0, rc = 0;
    const rex = Math.min(w, baseRx + mW + SAMPLE_W);
    for (let sx = baseRx + mW; sx < rex; sx++) {
      const idx = (imgY * w + sx) * 4;
      rr += src[idx]; rg += src[idx + 1]; rb += src[idx + 2]; rc++;
    }
    if (rc > 0) {
      rightBG[y * 3] = rr / rc; rightBG[y * 3 + 1] = rg / rc; rightBG[y * 3 + 2] = rb / rc;
    }

    // Accumulate global (prefer left side which is more reliable)
    if (lc > 0) {
      globalBG[0] += lr; globalBG[1] += lg; globalBG[2] += lb; globalCnt += lc;
    }
  }

  if (globalCnt > 0) {
    globalBG[0] /= globalCnt; globalBG[1] /= globalCnt; globalBG[2] /= globalCnt;
  }

  // Fill missing rows
  for (let y = 0; y < mH; y++) {
    if (leftBG[y * 3] === 0 && leftBG[y * 3 + 1] === 0 && leftBG[y * 3 + 2] === 0) {
      leftBG[y * 3] = globalBG[0] || 128; leftBG[y * 3 + 1] = globalBG[1] || 128; leftBG[y * 3 + 2] = globalBG[2] || 128;
    }
    if (rightBG[y * 3] === 0 && rightBG[y * 3 + 1] === 0 && rightBG[y * 3 + 2] === 0) {
      rightBG[y * 3] = leftBG[y * 3]; rightBG[y * 3 + 1] = leftBG[y * 3 + 1]; rightBG[y * 3 + 2] = leftBG[y * 3 + 2];
    }
  }

  // --- 4. Build strength map from ORIGINAL alpha ---
  const LOW  = 0.02 + (tolerance - 50) * 0.0005;
  const HIGH = LOW + 0.12;

  const strength = new Float32Array(mW * mH);
  for (let i = 0; i < mW * mH; i++) {
    const a = rawAlpha[i];
    if (a >= HIGH) { strength[i] = 1.0; }
    else if (a <= LOW) { strength[i] = 0.0; }
    else { const t = (a - LOW) / (HIGH - LOW); strength[i] = t * t * (3.0 - 2.0 * t); }
  }

  // --- 5. Apply correction with bilateral BG interpolation + floor ---
  const FLOOR_MARGIN = 0;    // Allow pixels to go this far below bg estimate
  const FLOOR_SOFT = 0.0;    // Hard clamp: corrected pixel must be >= background

  for (let y = 0; y < mH; y++) {
    const imgY = baseRy + y;
    if (imgY < 0 || imgY >= h) continue;
    for (let x = 0; x < mW; x++) {
      const imgX = baseRx + x;
      if (imgX < 0 || imgX >= w) continue;

      const a = feathered[y * mW + x];
      const s = strength[y * mW + x];
      if (a < 0.001 || s < 0.001) continue;

      const aC = Math.min(a, 0.95);
      const inv = 1.0 / (1.0 - aC);
      const idx = (imgY * w + imgX) * 4;

      // Interpolate background: left↔right across watermark width
      const t = x / (mW - 1);
      const bgR = leftBG[y * 3]     * (1 - t) + rightBG[y * 3]     * t;
      const bgG = leftBG[y * 3 + 1] * (1 - t) + rightBG[y * 3 + 1] * t;
      const bgB = leftBG[y * 3 + 2] * (1 - t) + rightBG[y * 3 + 2] * t;

      const alphaTrust = Math.min(1.0, a / HIGH);

      for (let c = 0; c < 3; c++) {
        const val = src[idx + c];
        const bg = (c === 0) ? bgR : (c === 1) ? bgG : bgB;
        // Alpha inversion
        const corrInv = Math.max(0, Math.min(255, (val - aC * 255.0) * inv));
        // Blend inversion with background estimate
        const corr = corrInv * alphaTrust + bg * (1 - alphaTrust);
        let newVal = val + (corr - val) * s;

        // Floor: never let pixel go significantly below background estimate
        const floor = bg - FLOOR_MARGIN;
        if (newVal < floor) {
          newVal = floor + (newVal - floor) * FLOOR_SOFT;
        }

        dst[idx + c] = Math.round(newVal);
      }
    }
  }

  // --- Log processing stats ---
  let totalPx = mW * mH;
  let correctedPx = 0;
  let maxAlphaUsed = 0;
  for (let i = 0; i < totalPx; i++) {
    if (strength[i] > 0.001) correctedPx++;
    if (feathered[i] > maxAlphaUsed) maxAlphaUsed = feathered[i];
  }
  console.log('  LOW=' + LOW.toFixed(3) + ' HIGH=' + HIGH.toFixed(3) +
    ' | Max alpha: ' + maxAlphaUsed.toFixed(3) +
    ' | Pixels corrected: ' + correctedPx + '/' + totalPx +
    ' (' + (correctedPx/totalPx*100).toFixed(1) + '%)');
  console.log('  BG (left→right): R=' + leftBG[0].toFixed(0) + '→' + rightBG[0].toFixed(0) +
    ' G=' + leftBG[1].toFixed(0) + '→' + rightBG[1].toFixed(0) +
    ' B=' + leftBG[2].toFixed(0) + '→' + rightBG[2].toFixed(0));
  console.log('  Floor: margin=' + FLOOR_MARGIN + ' soft=' + FLOOR_SOFT.toFixed(1));

  dstCanvas.width = imgW;
  dstCanvas.height = imgH;
  const dstCtx = dstCanvas.getContext("2d");
  dstCtx.putImageData(new ImageData(dst, w, h), 0, 0);
  resultLabel.textContent = i18n[currentLang].resultLabel;
  console.log('%c[CleanGemini] %cDone', 'font-weight:bold;color:#22c55e', 'color:#a1a1aa');
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
