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

  // Restore the semantic gradients!! This is huge.
  content = content.replace(/\bto-white\s+dark:to-neutral-950\b/g, 'to-background');
  content = content.replace(/\bvia-white\s+dark:via-neutral-950\b/g, 'via-background');

  // Restore border-border
  content = content.replace(/\bborder-slate-200\s+dark:border-white\/10\b/g, 'border-border');

  // Restore text-foreground
  content = content.replace(/\btext-slate-900\s+dark:text-zinc-100\b/g, 'text-foreground');
  content = content.replace(/\btext-slate-900\s+dark:text-white\b/g, 'text-foreground dark:text-white');
  
  // Restore text-muted-foreground
  content = content.replace(/\btext-slate-500\s+dark:text-zinc-400\b/g, 'text-muted-foreground');

  // Restore backgrounds (if they broke things, removing the hardcoded darks)
  // Actually, setting bg-white/70 dark:bg-zinc-900/40 is okay as long as dark:bg-zinc-900/40 is what the user had.
  // The user said: "CSS of the dark mode is same as before"
  // Before my script, `bg-card/40 dark:bg-zinc-900/40` was the code! I just changed `bg-card/40` to `bg-white/70`. That didn't touch the dark CSS.
  
  // What DID touch dark CSS was:
  // content = content.replace(/\bbg-neutral-900\b/g, 'bg-white dark:bg-neutral-900');
  content = content.replace(/\bbg-white\s+dark:bg-neutral-900\b/g, 'bg-neutral-900');
  content = content.replace(/\bbg-white\s+dark:bg-zinc-900\b/g, 'bg-zinc-900');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements++;
    console.log(`Reverted in: ${file}`);
  }
});

console.log(`Total files reverted: ${totalReplacements}`);
