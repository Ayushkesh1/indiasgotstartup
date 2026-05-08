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

  // Replacements
  content = content.replace(/\bbg-neutral-950\b/g, 'bg-background');
  content = content.replace(/\bbg-neutral-900\/(\d+)\b/g, 'bg-card/$1 dark:bg-neutral-900/$1');
  content = content.replace(/\bbg-neutral-800\/(\d+)\b/g, 'bg-muted/$1 dark:bg-neutral-800/$1');
  content = content.replace(/\bbg-zinc-900\/(\d+)\b/g, 'bg-card/$1 dark:bg-zinc-900/$1');
  
  // Specific full white texts that act as primary headings
  content = content.replace(/\btext-zinc-100\b/g, 'text-foreground');
  
  // Muted texts
  content = content.replace(/\btext-zinc-400\b/g, 'text-muted-foreground');
  content = content.replace(/\btext-zinc-500\b/g, 'text-muted-foreground');
  content = content.replace(/\btext-zinc-300\b/g, 'text-foreground/80');
  
  // specific borders
  content = content.replace(/\bborder-white\/(\d+)\b/g, 'border-border');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalReplacements++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Total files updated: ${totalReplacements}`);
