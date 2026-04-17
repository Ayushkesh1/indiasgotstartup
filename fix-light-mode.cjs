const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let totalReplacements = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix text-white except on Buttons and Badges 
  // Actually, setting dark:text-white text-foreground is safer, but let's just do text-foreground dark:text-white
  // except where we see bg-primary, bg-emerald, bg-purple, etc.
  
  // Safe replacement logic:
  // Replace text-white with text-foreground dark:text-white if not adjacent to a button-like background
  // Easy way: just do it anywhere and manually fix buttons. But wait, buttons use text-primary-foreground!
  // Our codebase often uses `text-white` directly though.
  
  content = content.replace(/\btext-white\b/g, 'text-foreground dark:text-white');
  
  // Fix background black transparencies which look like huge gray blobs on light
  content = content.replace(/\bbg-black\/40\b/g, 'bg-black/5 dark:bg-black/40');
  content = content.replace(/\bbg-black\/60\b/g, 'bg-black/5 dark:bg-black/60');
  
  // Fix gradients that assume dark mode
  content = content.replace(/\bvia-neutral-950\b/g, 'via-background dark:via-neutral-950');
  content = content.replace(/\bto-neutral-950\/20\b/g, 'to-background/20 dark:to-neutral-950/20');
  
  // Fix specific elements like inputs
  content = content.replace(/\bbg-neutral-900\b/g, 'bg-muted dark:bg-neutral-900');
  
  // Fix text-zinc-300 and text-zinc-400 that are hardcoded
  content = content.replace(/\btext-zinc-300\b/g, 'text-muted-foreground dark:text-zinc-300');
  content = content.replace(/\btext-zinc-400\b/g, 'text-muted-foreground dark:text-zinc-400');
  content = content.replace(/\btext-zinc-500\b/g, 'text-muted-foreground dark:text-zinc-500');

  // Fix borders
  content = content.replace(/\bborder-white\/(\d+)\b/g, 'border-border dark:border-white/$1');
  
  // Fix specific button combos if broken by text-white replacement
  content = content.replace(/bg-primary text-foreground dark:text-white/g, 'bg-primary text-primary-foreground text-white');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Total files updated: ${totalReplacements}`);
