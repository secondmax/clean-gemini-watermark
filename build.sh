#!/bin/bash
# Build script: minify app.js → app.min.js
# Usage: ./build.sh
set -e
cd "$(dirname "$0")"

echo "🔨 Minifying app.js → app.min.js"

npx terser app.js \
  --compress passes=3,dead_code=true,drop_console=false,drop_debugger=true,collapse_vars=true,reduce_vars=true \
  --mangle toplevel=true \
  --toplevel \
  -o app.min.js

ORIG=$(wc -c < app.js)
MINI=$(wc -c < app.min.js)
RATIO=$(awk "BEGIN {printf \"%.0f\", 100 - ($MINI * 100 / $ORIG)}")

echo "✅ Done: ${ORIG}B → ${MINI}B (${RATIO}% smaller)"
echo "   修改 app.js 后运行 ./build.sh 即可重新压缩"
