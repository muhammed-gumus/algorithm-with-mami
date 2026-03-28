---
description: Faz 2 - Mevcut çözümleri parse edip problems.json oluşturma, veri fonksiyonları ve API routes
---

# Faz 2 — Veri Katmanı

Bu faz, mevcut 41 çözüm dosyasını otomatik parse edip JSON veritabanına aktarmayı, veri okuma/yazma yardımcı fonksiyonlarını ve CRUD API endpoint'lerini oluşturmayı kapsar.

---

## Adım 1: Mevcut Çözüm Dosyalarını Analiz Etme

Her platform ve dil için çözüm dosyalarının formatını anla:

### Dosya Yapısı Özeti
| Platform | Dil | Klasör | Dosya Sayısı | Dosya Uzantısı |
|---|---|---|---|---|
| LeetCode | JavaScript | `LeetCode/JavaScript/` | 21 | `.js` |
| HackerRank | C++ | `HackerRank/CPP/` | 5 | `.cpp` |
| HackerRank | Python | `HackerRank/Python/` | 3 | `.py` |
| CodeWars | SQL | `CodeWars/SQL/` | 12 | `.sql` |

### Dosya İçerik Formatı
Her çözüm dosyasında şu yapı var:
1. **Yorum satırlarında** soru açıklaması (dosyanın üst kısmı)
2. **Kod bloğunda** çözüm implementasyonu

Yorum formatları dil bazlı farklıdır:
- **JavaScript**: `//` ile başlayan satırlar ve `/* */` blokları
- **C++**: `/* */` blokları ve `//` satırları
- **Python**: `#` ile başlayan satırlar
- **SQL**: `--` ile başlayan satırlar

---

## Adım 2: Parse Script'i Oluşturma

`scripts/parse-solutions.js` adlı bir Node.js script'i oluştur. Bu script tüm çözüm dosyalarını okuyup `data/problems.json` dosyasını üretecek.

### Script'in Yapması Gerekenler

```javascript
// scripts/parse-solutions.js

const fs = require('fs');
const path = require('path');

// 1. Her platform klasörünü tara
const platforms = [
  { name: 'leetcode', dir: 'LeetCode/JavaScript', lang: 'javascript', ext: '.js' },
  { name: 'hackerrank', dir: 'HackerRank/CPP', lang: 'cpp', ext: '.cpp' },
  { name: 'hackerrank', dir: 'HackerRank/Python', lang: 'python', ext: '.py' },
  { name: 'codewars', dir: 'CodeWars/SQL', lang: 'sql', ext: '.sql' },
];

// 2. Her dosya için:
//    a. Dosya adından başlık çıkar (CamelCase → boşluklu)
//    b. Yorum satırlarından açıklama çıkar
//    c. Yorum olmayan satırları kod olarak al
//    d. slug oluştur (kebab-case)

// 3. Tüm soruları problems.json formatına dönüştür
```

### Başlık Çıkarma Mantığı
Dosya adından başlık oluşturmak için CamelCase'i ayır:
- `TwoSum.js` → `"Two Sum"`
- `RemoveDuplicatesfromSortedArray.js` → `"Remove Duplicates from Sorted Array"`
- `MiniMaxSum.cpp` → `"Mini Max Sum"`

### Slug Oluşturma Mantığı
Başlıktan URL-uyumlu slug oluştur:
- `"Two Sum"` → `"two-sum"`
- `"Remove Duplicates from Sorted Array"` → `"remove-duplicates-from-sorted-array"`

### Zorluk Seviyesi Belirleme
- Otomatik olarak belirlenemeyeceği için varsayılan olarak `"medium"` ata
- Admin panelinden sonra manuel olarak güncellenebilir

---

## Adım 3: `problems.json` Dosya Formatı

`data/problems.json` dosyasının son hali şu formatta olmalı:

```json
{
  "problems": [
    {
      "id": "two-sum",
      "title": "Two Sum",
      "platform": "leetcode",
      "language": "javascript",
      "difficulty": "medium",
      "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      "code": "var twoSum = function (nums, target) {\n  for (let i = 1; i < nums.length; i++) {\n    for (let k = 0; k < i; k++) {\n      if (nums[i] + nums[k] === target) {\n        return [k, i];\n      }\n    }\n  }\n};",
      "createdAt": "2026-03-25T00:00:00Z"
    }
  ]
}
```

### Alan Açıklamaları
| Alan | Tip | Açıklama |
|---|---|---|
| `id` | string | URL-uyumlu benzersiz slug (kebab-case) |
| `title` | string | Sorunun başlığı |
| `platform` | string | `"leetcode"`, `"hackerrank"`, veya `"codewars"` |
| `language` | string | `"javascript"`, `"cpp"`, `"python"`, veya `"sql"` |
| `difficulty` | string | `"easy"`, `"medium"`, veya `"hard"` |
| `description` | string | Sorunun açıklaması (yorum satırlarından parse edilen) |
| `code` | string | Çözüm kodu |
| `createdAt` | string | ISO 8601 formatında oluşturulma tarihi |

---

## Adım 4: Veri Yardımcı Fonksiyonları

`lib/problems.js` dosyasını oluştur. Bu dosya `problems.json`'dan veri okuma ve yazma işlemlerini yönetecek.

### Gerekli Fonksiyonlar

```javascript
// lib/problems.js

// 1. getAllProblems() → Problem[]
//    - problems.json dosyasını oku ve parse et
//    - Tüm soruları döndür

// 2. getProblemById(id) → Problem | null
//    - Verilen id'ye sahip soruyu bul ve döndür
//    - Bulunamazsa null döndür

// 3. getProblemsByPlatform(platform) → Problem[]
//    - Verilen platforma ait soruları filtrele ve döndür

// 4. getProblemsByLanguage(language) → Problem[]
//    - Verilen dile ait soruları filtrele ve döndür

// 5. addProblem(problemData) → Problem
//    - Yeni soru ekle (slug otomatik oluşturulacak)
//    - problems.json dosyasını güncelle
//    - Eklenen soruyu döndür

// 6. updateProblem(id, updatedData) → Problem | null
//    - Mevcut soruyu güncelle
//    - problems.json dosyasını güncelle
//    - Güncellenen soruyu döndür

// 7. deleteProblem(id) → boolean
//    - Soruyu sil
//    - problems.json dosyasını güncelle
//    - Başarılıysa true döndür

// 8. getStats() → { total, byPlatform, byLanguage, byDifficulty }
//    - İstatistikleri hesapla ve döndür
```

### Dikkat Edilecekler
- Dosya okuma/yazma işlemlerinde `fs.readFileSync` / `fs.writeFileSync` kullan
- JSON parse hatalarını yakala ve anlamlı hata mesajları ver
- `addProblem` fonksiyonunda slug çakışmasını kontrol et
- `createdAt` alanını otomatik olarak `new Date().toISOString()` ile doldur

---

## Adım 5: API Routes Oluşturma

Next.js App Router formatında API endpoint'leri oluştur.

### `app/api/problems/route.js` — Liste ve Ekleme

```javascript
// GET /api/problems
// Query parametreleri: platform, language, difficulty, search
// Filtreleme ve arama desteği
// Dönüş: { problems: [...], stats: {...} }

// POST /api/problems
// Body: { title, platform, language, difficulty, description, code }
// Authorization header'ında JWT token kontrol et
// Sadece admin erişebilir
// Dönüş: { problem: {...} }
```

### `app/api/problems/[id]/route.js` — Detay, Güncelleme, Silme

```javascript
// GET /api/problems/[id]
// Tek bir sorunun detayını döndür
// Dönüş: { problem: {...} }

// PUT /api/problems/[id]
// Body: güncellenecek alanlar
// Authorization header'ında JWT token kontrol et
// Dönüş: { problem: {...} }

// DELETE /api/problems/[id]
// Authorization header'ında JWT token kontrol et
// Dönüş: { success: true }
```

### HTTP Yanıt Formatı
Tüm API yanıtları şu formatta olmalı:

**Başarılı yanıt:**
```json
{ "success": true, "data": { ... } }
```

**Hata yanıtı:**
```json
{ "success": false, "error": "Hata mesajı" }
```

### Status Code'lar
| Durum | Code |
|---|---|
| Başarılı | 200 |
| Oluşturuldu | 201 |
| Bulunamadı | 404 |
| Yetkisiz | 401 |
| Sunucu Hatası | 500 |

---

## Adım 6: Parse Script'ini Çalıştır

```bash
node scripts/parse-solutions.js
```

Çalıştırdıktan sonra `data/problems.json` dosyasının oluştuğunu ve 41 sorunun doğru şekilde parse edildiğini kontrol et:

```bash
# Toplam soru sayısını kontrol et
node -e "const d = require('./data/problems.json'); console.log('Toplam soru:', d.problems.length)"
```

---

## Doğrulama Kontrol Listesi

- [ ] `data/problems.json` dosyası oluşturuldu ve 41 soru içeriyor
- [ ] Her soru için id, title, platform, language, difficulty, description, code alanları dolu
- [ ] `lib/problems.js` tüm fonksiyonları içeriyor
- [ ] `GET /api/problems` tüm soruları döndürüyor
- [ ] `GET /api/problems?platform=leetcode` filtreleme çalışıyor
- [ ] `GET /api/problems/two-sum` tek soru detayını döndürüyor
- [ ] `GET /api/problems/nonexistent` → 404 döndürüyor
- [ ] POST, PUT, DELETE endpoint'leri (auth olmadan) 401 döndürüyor
