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

const files = walkSync('./src/pages').concat(walkSync('./src/components')).filter(f => f.endsWith('.tsx'));

let totalReplacements = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Upgrade glass panels to use crisp white in light mode instead of dim translucent colors.
  content = content.replace(/\bbg-card\/(\d+)\s+dark:bg-(?:zinc|neutral)-900\/\1\b/g, 'bg-white/70 dark:bg-zinc-900/$1');
  content = content.replace(/\bbg-card\/(\d+)\b/g, 'bg-white/70 dark:bg-zinc-900/$1'); // Catch any stray bg-card that lacks dark:

  // 2. Fix the "grey blob" issue where bg-black/5 was being used. We replace with a beautiful clean transparent white or slate.
  content = content.replace(/\bbg-black\/5\s+dark:bg-black\/40\b/g, 'bg-slate-50/80 dark:bg-black/40');
  content = content.replace(/\bbg-black\/40\b/g, 'bg-slate-50/80 dark:bg-black/40'); // catch stray
  content = content.replace(/\bbg-black\/60\b/g, 'bg-slate-100/90 dark:bg-black/60');
  
  // 3. Fix neutral-900 to adapt properly to Slate-50 instead of muted
  content = content.replace(/\bbg-neutral-900\b/g, 'bg-white dark:bg-neutral-900');
  content = content.replace(/\bbg-zinc-900\b/g, 'bg-white dark:bg-zinc-900');

  // 4. Texts
  content = content.replace(/\btext-white\b/g, 'text-slate-900 dark:text-white');
  content = content.replace(/\btext-foreground\s+dark:text-white\b/g, 'text-slate-900 dark:text-white');
  content = content.replace(/\btext-foreground\b/g, 'text-slate-900 dark:text-zinc-100');
  
  // Clean up duplicate combinations that might have formed from repeated scripts
  content = content.replace(/text-slate-900\s+dark:text-zinc-100\s+dark:text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/text-slate-900\s+dark:text-white\s+dark:text-white/g, 'text-slate-900 dark:text-white');

  // Specific high contrast text replacements
  content = content.replace(/\btext-muted-foreground\b/g, 'text-slate-500 dark:text-zinc-400');
  // Clean duplicates again
  content = content.replace(/text-slate-500\s+dark:text-zinc-400\s+dark:text-zinc-\d{3}/g, 'text-slate-500 dark:text-zinc-400');
  content = content.replace(/text-slate-500\s+dark:text-zinc-400\s+dark:text-muted-foreground/g, 'text-slate-500 dark:text-zinc-400');

  // Buttons that got ruined need to revert to white text!
  content = content.replace(/bg-primary\s+text-slate-900\s+dark:text-white/g, 'bg-primary text-white');
  content = content.replace(/bg-emerald-500\b([^>]*?)text-slate-900 dark:text-white/g, 'bg-emerald-500$1text-white');

  // Gradients - let's make sure gradients into dark mode backgrounds use white correctly.
  content = content.replace(/\bto-background\b/g, 'to-white dark:to-neutral-950');
  content = content.replace(/\bvia-background\b/g, 'via-white dark:via-neutral-950');

  // Border improvements
  content = content.replace(/\bborder-border\b/g, 'border-slate-200 dark:border-white/10');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Total files updated: ${totalReplacements}`);
