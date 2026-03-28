import fs from 'fs';
import path from 'path';

// JSON dosyasının yolu
const dataFilePath = path.join(process.cwd(), 'data', 'problems.json');

// Yardımcı Fonksiyon: JSON'dan veriyi oku
function readData() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents).problems || [];
  } catch (error) {
    console.error('Veri okuma hatası:', error);
    return [];
  }
}

// Yardımcı Fonksiyon: JSON'a veriyi yaz
function writeData(problems) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify({ problems }, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Veri yazma hatası:', error);
    return false;
  }
}

// 1. Tüm soruları getir
export function getAllProblems() {
  return readData();
}

// 2. ID'ye göre tek soru getir
export function getProblemById(id) {
  const problems = readData();
  return problems.find(p => p.id === id) || null;
}

// 3. Platforma göre filtrele
export function getProblemsByPlatform(platform) {
  const problems = readData();
  return problems.filter(p => p.platform === platform);
}

// 4. Dile göre filtrele
export function getProblemsByLanguage(language) {
  const problems = readData();
  return problems.filter(p => p.language === language);
}

// 5. Yeni soru ekle
export function addProblem(problemData) {
  const problems = readData();
  
  // Basit slug kontrolü ve oluşturma
  let baseSlug = problemData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
    
  let slug = baseSlug;
  let counter = 1;
  while (problems.some(p => p.id === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newProblem = {
    id: slug,
    title: problemData.title,
    platform: problemData.platform,
    language: problemData.language,
    difficulty: problemData.difficulty || 'medium',
    description: problemData.description || '',
    code: problemData.code || '',
    url: problemData.url || '',
    createdAt: new Date().toISOString()
  };

  problems.push(newProblem);
  const success = writeData(problems);
  
  return success ? newProblem : null;
}

// 6. Soru güncelle
export function updateProblem(id, updatedData) {
  const problems = readData();
  const index = problems.findIndex(p => p.id === id);
  
  if (index === -1) return null;

  problems[index] = {
    ...problems[index],
    ...updatedData,
    id: id, // ID değiştirilemez
    url: updatedData.url !== undefined ? updatedData.url : problems[index].url
  };

  const success = writeData(problems);
  return success ? problems[index] : null;
}

// 7. Soru sil
export function deleteProblem(id) {
  const problems = readData();
  const initialLength = problems.length;
  const filtered = problems.filter(p => p.id !== id);
  
  if (filtered.length === initialLength) return false;

  return writeData(filtered);
}

// 8. İstatistikleri getir
export function getStats() {
  const problems = readData();
  
  const stats = {
    total: problems.length,
    byPlatform: {
      leetcode: 0,
      hackerrank: 0,
      codewars: 0
    },
    byLanguage: {
      javascript: 0,
      typescript: 0,
      python: 0,
      java: 0,
      cpp: 0,
      csharp: 0,
      go: 0,
      rust: 0,
      swift: 0,
      kotlin: 0,
      ruby: 0,
      php: 0,
      c: 0,
      sql: 0
    },
    byDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0
    }
  };

  problems.forEach(p => {
    if (stats.byPlatform[p.platform] !== undefined) stats.byPlatform[p.platform]++;
    else stats.byPlatform[p.platform] = 1;

    if (stats.byLanguage[p.language] !== undefined) stats.byLanguage[p.language]++;
    else stats.byLanguage[p.language] = 1;

    if (stats.byDifficulty[p.difficulty] !== undefined) stats.byDifficulty[p.difficulty]++;
    else stats.byDifficulty[p.difficulty] = 1;
  });

  return stats;
}
