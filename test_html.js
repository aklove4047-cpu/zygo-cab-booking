const fs = require('fs');

function testFile(filePath) {
  console.log('Testing:', filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  console.log('Total lines:', lines.length);
  
  lines.forEach((l, i) => {
    if (l.includes('<!DOCTYPE html>')) console.log('  DOCTYPE at line:', i + 1);
    if (l.includes('<html')) console.log('  <html at line:', i + 1);
    if (l.includes('id="view-auth"')) console.log('  view-auth at line:', i + 1);
    if (l.includes('id="view-home"')) console.log('  view-home at line:', i + 1);
    if (l.includes('id="view-driver-home"')) console.log('  view-driver-home at line:', i + 1);
  });

  // Extract inline script
  const scriptRegex = /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;
  while ((match = scriptRegex.exec(content)) !== null) {
    scriptIndex++;
    const jsCode = match[1];
    console.log(`  Evaluating inline script #${scriptIndex} (length: ${jsCode.length})...`);
    try {
      new Function(jsCode);
      console.log(`  Script #${scriptIndex}: SYNTAX OK!`);
    } catch (e) {
      console.error(`  Script #${scriptIndex} ERROR:`, e.message);
    }
  }
}

testFile('public/index.html');
testFile('public/driver.html');
testFile('public/shared/sound-engine.js');
testFile('public/shared/router.js');
testFile('public/shared/live-store.js');
