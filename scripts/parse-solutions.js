const fs = require('fs');
const path = require('path');

const platforms = [
  { name: 'leetcode', dir: 'solutions/LeetCode/JavaScript', lang: 'javascript', ext: '.js' },
  { name: 'hackerrank', dir: 'solutions/HackerRank/CPP', lang: 'cpp', ext: '.cpp' },
  { name: 'hackerrank', dir: 'solutions/HackerRank/Python', lang: 'python', ext: '.py' },
  { name: 'codewars', dir: 'solutions/CodeWars/SQL', lang: 'sql', ext: '.sql' },
];

const basePath = path.join(__dirname, '..');
const problems = [];

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function parseCamelCase(str) {
  // CamelCase to Space separated
  return str.replace(/([A-Z])/g, ' $1').trim().replace(/  +/g, ' ');
}

platforms.forEach(platform => {
  const dirPath = path.join(basePath, platform.dir);
  
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath).filter(file => file.endsWith(platform.ext));

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Dosya adından başlık çıkarma (uzantıyı sil)
    const fileNameWithoutExt = file.replace(platform.ext, '');
    let title = fileNameWithoutExt;
    
    if (platform.name === 'leetcode' || platform.name === 'hackerrank') {
        title = parseCamelCase(fileNameWithoutExt);
    }
    
    // Camel case parsing bazen ilk harfi küçük bırakabilir veya sayılarla bitişik yapabilir.
    // Basit bir temizleme:
    title = title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');


    const slug = generateSlug(title);

    // Yorumları ve kodu ayırma (basit bir yaklaşım)
    let descriptionLines = [];
    let codeLines = [];
    let inCommentBlock = false;

    const lines = content.split('\n');
    let hasFoundCode = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Boş satırları atla
      if (!trimmed && !hasFoundCode) return;

      // JavaScript / C++ blok yorumlar
      if (trimmed.startsWith('/*')) {
        inCommentBlock = true;
        let c = trimmed.replace('/*', '').trim();
        if(c) descriptionLines.push(c);
        if (trimmed.endsWith('*/')) {
           inCommentBlock = false;
        }
        return;
      }
      
      if (inCommentBlock) {
        if (trimmed.endsWith('*/')) {
          inCommentBlock = false;
          let c = trimmed.replace('*/', '').replace(/^\*+/, '').trim();
          if(c) descriptionLines.push(c);
        } else {
            descriptionLines.push(trimmed.replace(/^\*+/, '').trim());
        }
        return;
      }

      // Tek satır yorumlar
      if ((platform.lang === 'javascript' || platform.lang === 'cpp') && trimmed.startsWith('//')) {
         let c = trimmed.substring(2).trim();
         // JSDoc tarzı yorumlar başkadır, ama açıklamaysa alalım
         if (c !== '' && !c.includes('@param') && !c.includes('@return')) {
            descriptionLines.push(c);
         }
         return;
      }
      
      if (platform.lang === 'python' && trimmed.startsWith('#')) {
          descriptionLines.push(trimmed.substring(1).trim());
          return;
      }
      
      if (platform.lang === 'sql' && trimmed.startsWith('--')) {
         descriptionLines.push(trimmed.substring(2).trim());
         return;
      }
      
      if (platform.lang === 'javascript' && trimmed.startsWith('/**')) {
           // JSDoc - ignore
           return;
      }

      // Yukarıdakilere girmiyorsa koddur (ilk kod satırını bulduk)
      if (trimmed.length > 0) {
        hasFoundCode = true;
      }
      
      if (hasFoundCode) {
        codeLines.push(line); 
      }
    });
    
    const description = descriptionLines.filter(l => l.length > 0).join('\n').trim();
    // baştaki/sondaki boş kod satırlarını temizle
    let finalCode = codeLines.join('\n').trim();

    problems.push({
      id: slug,
      title: title,
      platform: platform.name,
      language: platform.lang,
      difficulty: 'medium', // Default
      description: description || "No description provided.",
      code: finalCode,
      createdAt: new Date().toISOString()
    });
  });
});

const outputPath = path.join(basePath, 'data', 'problems.json');
let existingProblems = [];
if (fs.existsSync(outputPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    existingProblems = data.problems || [];
  } catch (e) {
    console.error('Error reading existing problems.json', e);
  }
}

const finalProblems = problems.map(p => {
  const existing = existingProblems.find(ep => ep.id === p.id);
  if (existing && existing.url) {
    return { ...p, url: existing.url };
  }
  return p;
});

fs.writeFileSync(outputPath, JSON.stringify({ problems: finalProblems }, null, 2));

console.log(`Parsed ${problems.length} problems and saved to data/problems.json`);
