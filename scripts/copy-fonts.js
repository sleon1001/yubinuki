// Copies the game's fonts from node_modules into www/fonts so the app works offline.
// Run with: npm run fonts
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const fonts = {
  'dela-gothic-one': ['400.css'],
  'zen-kaku-gothic-new': ['500.css', '700.css'],
};
let ok = true;
for (const [name, cssFiles] of Object.entries(fonts)) {
  const src = path.join(root, 'node_modules', '@fontsource', name);
  const dst = path.join(root, 'www', 'fonts', name);
  if (!fs.existsSync(src)) {
    console.log(`見つかりません: @fontsource/${name}  (npm install を先に実行してください)`);
    ok = false;
    continue;
  }
  fs.mkdirSync(dst, { recursive: true });
  for (const css of cssFiles) fs.copyFileSync(path.join(src, css), path.join(dst, css));
  fs.cpSync(path.join(src, 'files'), path.join(dst, 'files'), { recursive: true });
  console.log(`コピーしました: ${name}`);
}
if (ok) console.log('フォントの準備ができました。');
