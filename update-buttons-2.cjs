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
  
  // Replace standard button classes
  content = content.replace(/bg-zinc-900 text-white hover:bg-zinc-800/g, 'bg-gradient-to-b from-zinc-500 to-zinc-950 text-white border border-zinc-500 hover:from-zinc-400 hover:to-zinc-900 hover:border-zinc-400');
  content = content.replace(/bg-zinc-900 hover:bg-zinc-800 text-white/g, 'bg-gradient-to-b from-zinc-500 to-zinc-950 text-white border border-zinc-500 hover:from-zinc-400 hover:to-zinc-900 hover:border-zinc-400');
  
  // Replace secondary button classes
  content = content.replace(/bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/g, 'bg-gradient-to-b from-zinc-800 to-zinc-950 hover:from-zinc-700 hover:to-zinc-900 border border-zinc-700 text-white hover:shadow-md hover:shadow-zinc-700/20');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated buttons in ' + file);
  }
});
