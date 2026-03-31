import fs from "fs";
import path from "path";

// JSON dosyasının yolu
const dataFilePath = path.join(process.cwd(), "data", "problems.json");
const gistId = process.env.GITHUB_GIST_ID;
const gistToken = process.env.GITHUB_TOKEN;
const gistFileName = process.env.GITHUB_GIST_FILENAME || "problems.json";
const useGistStorage = Boolean(gistId);

function getGitHubHeaders(withJsonContentType = false) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (gistToken) {
    headers.Authorization = `Bearer ${gistToken}`;
  }

  if (withJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function normalizeProblemsPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.problems)) return payload.problems;
  return [];
}

// Yardımcı Fonksiyon: JSON'dan veriyi oku
async function readData() {
  if (useGistStorage) {
    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: getGitHubHeaders(),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Gist okunamadı (${response.status})`);
      }

      const gist = await response.json();
      const requestedFile = gist.files?.[gistFileName]?.content;
      const fallbackJsonFile = Object.values(gist.files || {}).find((file) =>
        file?.filename?.endsWith(".json"),
      )?.content;
      const rawContent = requestedFile || fallbackJsonFile;

      if (!rawContent) return [];

      return normalizeProblemsPayload(JSON.parse(rawContent));
    } catch (error) {
      console.error("Gist veri okuma hatası:", error);
      return [];
    }
  }

  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return normalizeProblemsPayload(JSON.parse(fileContents));
  } catch (error) {
    console.error("Veri okuma hatası:", error);
    return [];
  }
}

// Yardımcı Fonksiyon: JSON'a veriyi yaz
async function writeData(problems) {
  if (useGistStorage) {
    if (!gistToken) {
      console.error("GITHUB_TOKEN tanımlı değil, Gist yazma yapılamıyor.");
      return false;
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: "PATCH",
        headers: getGitHubHeaders(true),
        body: JSON.stringify({
          files: {
            [gistFileName]: {
              content: JSON.stringify({ problems }, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        let details = "";
        try {
          const errorBody = await response.json();
          details = errorBody?.message ? `: ${errorBody.message}` : "";
        } catch {
          // JSON parse edilemezse detay boş kalır
        }
        throw new Error(`Gist yazılamadı (${response.status})${details}`);
      }

      return true;
    } catch (error) {
      console.error("Gist veri yazma hatası:", error);
      return false;
    }
  }

  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify({ problems }, null, 2),
      "utf8",
    );
    return true;
  } catch (error) {
    console.error("Veri yazma hatası:", error);
    return false;
  }
}

// 1. Tüm soruları getir
export async function getAllProblems() {
  return await readData();
}

// 2. ID'ye göre tek soru getir
export async function getProblemById(id) {
  const problems = await readData();
  return problems.find((p) => p.id === id) || null;
}

// 3. Platforma göre filtrele
export async function getProblemsByPlatform(platform) {
  const problems = await readData();
  return problems.filter((p) => p.platform === platform);
}

// 4. Dile göre filtrele
export async function getProblemsByLanguage(language) {
  const problems = await readData();
  return problems.filter((p) => p.language === language);
}

// 5. Yeni soru ekle
export async function addProblem(problemData) {
  const problems = await readData();

  // Basit slug kontrolü ve oluşturma
  let baseSlug = problemData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  let slug = baseSlug;
  let counter = 1;
  while (problems.some((p) => p.id === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newProblem = {
    id: slug,
    title: problemData.title,
    platform: problemData.platform,
    language: problemData.language,
    difficulty: problemData.difficulty || "medium",
    description: problemData.description || "",
    code: problemData.code || "",
    url: problemData.url || "",
    createdAt: new Date().toISOString(),
  };

  problems.push(newProblem);
  const success = await writeData(problems);

  return success ? newProblem : null;
}

// 6. Soru güncelle
export async function updateProblem(id, updatedData) {
  const problems = await readData();
  const index = problems.findIndex((p) => p.id === id);

  if (index === -1) return null;

  problems[index] = {
    ...problems[index],
    ...updatedData,
    id: id, // ID değiştirilemez
    url: updatedData.url !== undefined ? updatedData.url : problems[index].url,
  };

  const success = await writeData(problems);
  return success ? problems[index] : null;
}

// 7. Soru sil
export async function deleteProblem(id) {
  const problems = await readData();
  const initialLength = problems.length;
  const filtered = problems.filter((p) => p.id !== id);

  if (filtered.length === initialLength) return false;

  return await writeData(filtered);
}

// 8. İstatistikleri getir
export async function getStats() {
  const problems = await readData();

  const stats = {
    total: problems.length,
    byPlatform: {
      leetcode: 0,
      hackerrank: 0,
      codewars: 0,
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
      sql: 0,
    },
    byDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  };

  problems.forEach((p) => {
    if (stats.byPlatform[p.platform] !== undefined)
      stats.byPlatform[p.platform]++;
    else stats.byPlatform[p.platform] = 1;

    if (stats.byLanguage[p.language] !== undefined)
      stats.byLanguage[p.language]++;
    else stats.byLanguage[p.language] = 1;

    if (stats.byDifficulty[p.difficulty] !== undefined)
      stats.byDifficulty[p.difficulty]++;
    else stats.byDifficulty[p.difficulty] = 1;
  });

  return stats;
}
