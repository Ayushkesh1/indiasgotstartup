const fs = require('fs');
const content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

const ecoMatch = content.match(/\{\/\* ═══════════════════════════════════════════\n\s*2\. ECOSYSTEM QUICK-ACCESS GRID[\s\S]*?(?=\{\/\* ═══════════════════════════════════════════\n\s*3\. FEATURED STARTUPS)/);
const startMatch = content.match(/\{\/\* ═══════════════════════════════════════════\n\s*3\. FEATURED STARTUPS[\s\S]*?(?=\{\/\* ═══════════════════════════════════════════\n\s*4\. FEATURED INVESTORS)/);
const invMatch = content.match(/\{\/\* ═══════════════════════════════════════════\n\s*4\. FEATURED INVESTORS[\s\S]*?(?=\{\/\* ═══════════════════════════════════════════\n\s*5\. ARTICLES SECTION)/);
const artMatch = content.match(/\{\/\* ═══════════════════════════════════════════\n\s*5\. ARTICLES SECTION[\s\S]*?(?=\{\/\* Write CTA)/);
const writeMatch = content.match(/\{\/\* Write CTA \*\/\}[\s\S]*?(?=<NewsletterFooter \/>)/);

if (ecoMatch && startMatch && invMatch && artMatch && writeMatch) {
  const eco = ecoMatch[0];
  const start = startMatch[0];
  const inv = invMatch[0];
  let art = artMatch[0];
  
  // Update article grid to 3 columns
  art = art.replace(/<div className="grid gap-6 md:grid-cols-2">/, '<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">');

  let write = writeMatch[0];
  // Redesign Write CTA
  write = `      {/* Write CTA */}
      <section className="w-full bg-muted/50 border-y border-border py-16 mb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
            Have a story to share?
          </h2>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether it's a funding announcement, an inspiring founder journey, or an ecosystem insight, we'd love to feature it. Join hundreds of founders sharing their voice.
          </p>
          <Button onClick={() => !user ? navigate("/auth") : navigate("/write")} size="lg" className="px-8 font-semibold shadow-sm">
            Submit Your Story
          </Button>
        </div>
      </section>\n\n`;

  const before = content.substring(0, ecoMatch.index);
  const after = content.substring(writeMatch.index + writeMatch[0].length);

  const newContent = before + art + write + eco + start + inv + after;
  
  fs.writeFileSync('src/pages/Index.tsx', newContent);
  console.log("Reordered and redesigned successfully.");
} else {
  console.log("Failed to match sections.");
}
