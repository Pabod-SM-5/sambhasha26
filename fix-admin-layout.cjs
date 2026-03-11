const fs = require('fs');
const file = './src/components/Admin/AdminLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-zinc-950 text-black shadow-lg shadow-white\/10/g, 'bg-zinc-800 text-white shadow-lg shadow-black/50');
content = content.replace(/text-white\/60 hover:text-white hover:bg-zinc-950\/5/g, 'text-zinc-400 hover:text-white hover:bg-zinc-900');
content = content.replace(/text-black/g, 'text-white');
content = content.replace(/text-white\/60 group-hover:text-white/g, 'text-zinc-400 group-hover:text-white');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed AdminLayout');
