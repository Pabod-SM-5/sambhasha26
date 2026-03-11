const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace bg-zinc-900 text-white with gradient
  content = content.replace(/bg-zinc-900 text-white/g, 'bg-gradient-to-b from-zinc-500 to-zinc-950 text-white border border-zinc-500');
  
  // Replace hover:bg-zinc-800 with hover gradient
  content = content.replace(/hover:bg-zinc-800/g, 'hover:from-zinc-400 hover:to-zinc-900 hover:border-zinc-400');
  
  // Replace shadow-zinc-900/20 with shadow-black/50
  content = content.replace(/shadow-zinc-900\/20/g, 'shadow-black/50');
  
  // Replace hover:shadow-zinc-900/30 with hover:shadow-black/70
  content = content.replace(/hover:shadow-zinc-900\/30/g, 'hover:shadow-black/70');
  
  // Replace shadow-zinc-200/50 with shadow-black/50
  content = content.replace(/shadow-zinc-200\/50/g, 'shadow-black/50');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated buttons in ' + file);
  }
});
