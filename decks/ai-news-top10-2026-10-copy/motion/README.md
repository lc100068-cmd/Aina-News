# 表紙モーション（cover-motion.mp4）の作り方

1. `python3 layers.py <表紙画像>` — 背景の緑を抜いて、月・やぐら・稲穂5本を透過PNGに分け、`meta.json`（稲穂の揺れの支点）を書き出す
2. `node render.js frames` — 10秒ループ（30fps・300枚）をレンダリング
3. `ffmpeg -framerate 30 -i frames/f%04d.png -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart cover-motion.mp4`

動画と静止画（1フレーム目）はスライドのアセットとしてアップロード済み。文字はスライド側の本物のテキストで、順番に表示される。
