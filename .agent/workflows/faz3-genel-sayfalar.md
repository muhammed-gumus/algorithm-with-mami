---
description: Faz 3 - Navbar, ana sayfa, platform sayfası ve soru detay sayfası geliştirme
---

# Faz 3 — Genel Sayfalar (Public)

Bu faz, kullanıcıların göreceği tüm genel sayfaların oluşturulmasını kapsar: Navbar, ana sayfa, platform listesi ve soru detay sayfası.

---

## Adım 1: Navbar Bileşeni

`components/Navbar.js` dosyasını oluştur.

### Tasarım Gereksinimleri
- Sayfanın üstüne sabit (sticky) konumlandır
- Sol tarafta logo/başlık: **"Algorithm with Mami"** (font-heading, bold)
- Sağ tarafta navigasyon linkleri:
  - Ana Sayfa (`/`)
  - LeetCode (`/platform/leetcode`)
  - HackerRank (`/platform/hackerrank`)
  - CodeWars (`/platform/codewars`)
- Mobilde hamburger menü (state ile aç/kapa)
- Neobrutalism stili:
  - `border-b-3 border-neo-black`
  - `bg-neo-white`
  - Linkler hover'da renkli alt çizgi efekti

### Tailwind Sınıfları Örneği
```html
<nav class="sticky top-0 z-50 bg-neo-white border-b-3 border-neo-black">
  <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="font-heading text-2xl font-black">
      Algorithm with Mami 🧠
    </a>
    <!-- Links -->
    <div class="hidden md:flex gap-6">
      <a class="font-heading font-bold hover:text-neo-pink transition-colors">...</a>
    </div>
    <!-- Hamburger (mobil) -->
    <button class="md:hidden neo-btn !px-3 !py-2">☰</button>
  </div>
</nav>
```

### `"use client"` Direktifi
Bu bileşen state kullandığı için dosyanın başına `"use client"` ekle (hamburger menü toggle).

---

## Adım 2: Layout'a Navbar Ekleme

`app/layout.js` dosyasında `<Navbar />` bileşenini `<body>` içine, `{children}` öncesine ekle.

```jsx
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Algorithm with Mami',
  description: 'Algoritma soruları ve çözümleri — LeetCode, HackerRank, CodeWars',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${fonts} antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

---

## Adım 3: Ana Sayfa (`app/page.js`)

Ana sayfa aşağıdaki bölümlerden oluşmalı:

### 3a. Hero Section
- Büyük, dikkat çekici başlık: **"Algoritma Soruları & Çözümleri"**
- Alt başlık açıklama metni
- CTA butonu: **"Soruları Keşfet"** → `/platform/leetcode`'a yönlendir
- Instagram linki: [@buildwithmami](https://www.instagram.com/buildwithmami/reels/)
- Neobrutalism stili: arka plan `bg-neo-yellow` veya `bg-neo-bg`, büyük sert gölgeli kart

```html
<section class="bg-neo-yellow border-b-3 border-neo-black">
  <div class="max-w-7xl mx-auto px-4 py-20 text-center">
    <h1 class="text-6xl md:text-7xl font-heading font-black mb-6">
      Algoritma Soruları<br/>& Çözümleri
    </h1>
    <p class="text-xl font-body max-w-2xl mx-auto mb-8">
      LeetCode, HackerRank ve CodeWars çözümleri...
    </p>
    <a href="/platform/leetcode" class="neo-btn inline-block">
      Soruları Keşfet →
    </a>
  </div>
</section>
```

### 3b. Platform Kartları Bölümü

3 adet platform kartı yan yana (grid):

Her kart için:
- Platform ikonu/emojisi (🏆 LeetCode, 💻 HackerRank, ⚔️ CodeWars)
- Platform adı
- Soru sayısı
- Dil bilgisi
- "Soruları Gör →" linki
- Her kart farklı arka plan rengi:
  - LeetCode: `bg-neo-orange`
  - HackerRank: `bg-neo-green`
  - CodeWars: `bg-neo-purple`

**PlatformCard bileşeni** (`components/PlatformCard.js`) oluştur:

```jsx
export default function PlatformCard({ name, icon, count, languages, color, slug }) {
  return (
    <a href={`/platform/${slug}`}
       className={`neo-card ${color} block hover:-translate-y-1`}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-2xl font-heading font-bold mb-2">{name}</h3>
      <p className="text-4xl font-heading font-black mb-2">{count}</p>
      <p className="font-body text-gray-700">soru çözüldü</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {languages.map(lang => (
          <span key={lang} className="neo-badge bg-neo-white">{lang}</span>
        ))}
      </div>
    </a>
  );
}
```

### 3c. İstatistikler Bölümü

Toplam istatistikleri gösteren sayaçlar:
- Toplam çözülen soru sayısı
- Platform sayısı
- Dil sayısı

Neobrutalism tarzında kutular, büyük rakamlar, kalın kenarlıklar.

### 3d. Son Eklenen Sorular

En son eklenen 6 soruyu kartlar halinde göster.

**ProblemCard bileşeni** (`components/ProblemCard.js`) oluştur:

```jsx
export default function ProblemCard({ problem }) {
  // Zorluk rengini belirle
  const difficultyColor = {
    easy: 'bg-neo-green',
    medium: 'bg-neo-yellow',
    hard: 'bg-neo-red',
  }[problem.difficulty];

  return (
    <a href={`/problem/${problem.id}`} className="neo-card block">
      <div className="flex items-center justify-between mb-3">
        <span className={`neo-badge ${difficultyColor}`}>
          {problem.difficulty}
        </span>
        <span className="neo-badge bg-neo-blue">
          {problem.language}
        </span>
      </div>
      <h3 className="text-xl font-heading font-bold mb-2">{problem.title}</h3>
      <p className="text-gray-600 font-body text-sm line-clamp-2">
        {problem.description}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-heading font-bold text-gray-500">
          {problem.platform}
        </span>
      </div>
    </a>
  );
}
```

### Veri Çekme

Ana sayfa bir **Server Component** olduğu için doğrudan `lib/problems.js`'den veri çek:

```jsx
import { getAllProblems, getStats } from '@/lib/problems';

export default function Home() {
  const problems = getAllProblems();
  const stats = getStats();
  const recentProblems = problems.slice(-6).reverse();
  // ...
}
```

---

## Adım 4: Platform Sayfası (`app/platform/[slug]/page.js`)

Platform bazlı soru listeleme sayfası.

### Veri Çekme
URL'deki `slug` parametresine göre soruları filtrele:
```jsx
import { getProblemsByPlatform } from '@/lib/problems';

export default function PlatformPage({ params }) {
  const problems = getProblemsByPlatform(params.slug);
  // ...
}
```

### Sayfa İçeriği
1. **Platform başlığı ve açıklaması** (üst bölüm, renkli arka plan)
2. **Filtre çubuğu** — Client Component olacak (`"use client"`)
   - Dil filtresi: "Tümü", "JavaScript", "Python", "C++", "SQL" (butonlar)
   - Zorluk filtresi: "Tümü", "Easy", "Medium", "Hard" (butonlar)
   - Arama çubuğu (başlık ve açıklamada arar)
3. **Soru listesi** — `ProblemCard` bileşenleri grid halinde

### Filtre Bileşeni

`components/FilterBar.js` dosyası oluştur:

```jsx
"use client";
import { useState } from 'react';

export default function FilterBar({ problems, onFilter }) {
  const [language, setLanguage] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  // Filtreleme mantığı
  // ...

  return (
    <div className="neo-card mb-8">
      {/* Dil filtreleri */}
      <div className="flex flex-wrap gap-3 mb-4">
        {['all', 'javascript', 'python', 'cpp', 'sql'].map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`neo-badge cursor-pointer ${language === lang ? 'bg-neo-yellow' : 'bg-neo-white'}`}
          >
            {lang === 'all' ? 'Tümü' : lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Zorluk filtreleri */}
      <div className="flex flex-wrap gap-3 mb-4">
        {['all', 'easy', 'medium', 'hard'].map(diff => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            className={`neo-badge cursor-pointer ${difficulty === diff ? 'bg-neo-pink' : 'bg-neo-white'}`}
          >
            {diff === 'all' ? 'Tümü' : diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Arama */}
      <input
        type="text"
        placeholder="Soru ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="neo-input"
      />
    </div>
  );
}
```

### Platform Metadata Objesi

Her platform için sabit bilgiler tanımla:

```javascript
const platformMeta = {
  leetcode: {
    name: 'LeetCode',
    icon: '🏆',
    description: 'Mülakat hazırlığı ve DSA temelleri',
    color: 'bg-neo-orange',
    url: 'https://leetcode.com',
  },
  hackerrank: {
    name: 'HackerRank',
    icon: '💻',
    description: 'Problem çözme ve alan bazlı sorular',
    color: 'bg-neo-green',
    url: 'https://hackerrank.com',
  },
  codewars: {
    name: 'CodeWars',
    icon: '⚔️',
    description: 'Kod katası ve dil ustalığı',
    color: 'bg-neo-purple',
    url: 'https://codewars.com',
  },
};
```

---

## Adım 5: Soru Detay Sayfası (`app/problem/[id]/page.js`)

Tek bir sorunun detayını gösteren sayfa.

### Veri Çekme
```jsx
import { getProblemById } from '@/lib/problems';

export default function ProblemPage({ params }) {
  const problem = getProblemById(params.id);
  if (!problem) return notFound();
  // ...
}
```

### Sayfa İçeriği

1. **Breadcrumb**: Ana Sayfa > Platform > Soru Adı
2. **Başlık ve Badge'ler**:
   - Soru başlığı (h1, büyük, bold)
   - Zorluk badge'i (renkli)
   - Platform badge'i
   - Dil badge'i
3. **Soru Açıklaması**:
   - `description` alanının içeriğini göster
   - Paragraflar halinde formatlı
4. **Çözüm Kodu**:
   - **CodeBlock bileşeni** ile syntax-highlighted kod
   - Sağ üstte "Kopyala" butonu
   - Neobrutalism tarzında siyah kenarlıklı kod bloğu
5. **Navigasyon**: Önceki/Sonraki soru butonları

### CodeBlock Bileşeni

`components/CodeBlock.js` dosyasını oluştur:

```jsx
"use client";
import { useState } from 'react';

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-3 border-neo-black bg-neo-black rounded-none overflow-hidden">
      {/* Üst çubuk */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-gray-400 font-mono text-sm">{language}</span>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white font-mono text-sm
                     px-3 py-1 border border-gray-600 hover:border-white transition-colors"
        >
          {copied ? '✓ Kopyalandı!' : '📋 Kopyala'}
        </button>
      </div>
      {/* Kod alanı */}
      <pre className="p-6 overflow-x-auto">
        <code className="font-mono text-sm text-green-400 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}
```

> **NOT**: İlk aşamada basit bir `<pre><code>` bloğu kullan. Faz 5'te syntax highlighting (Prism.js veya highlight.js) eklenecek.

---

## Adım 6: Badge Bileşeni

`components/Badge.js` dosyasını oluştur. Zorluk, platform ve dil badge'leri için tekrar kullanılabilir bileşen:

```jsx
const colorMap = {
  easy: 'bg-neo-green text-white',
  medium: 'bg-neo-yellow text-neo-black',
  hard: 'bg-neo-red text-white',
  leetcode: 'bg-neo-orange text-neo-black',
  hackerrank: 'bg-neo-green text-white',
  codewars: 'bg-neo-purple text-white',
  javascript: 'bg-yellow-300 text-neo-black',
  python: 'bg-blue-500 text-white',
  cpp: 'bg-blue-700 text-white',
  sql: 'bg-pink-500 text-white',
};

export default function Badge({ type, label }) {
  return (
    <span className={`neo-badge ${colorMap[type] || 'bg-gray-200'}`}>
      {label || type}
    </span>
  );
}
```

---

## Doğrulama Kontrol Listesi

- [ ] Navbar tüm sayfalarda görünüyor ve linkleri çalışıyor
- [ ] Mobilde hamburger menü açılıp kapanıyor
- [ ] Ana sayfa: hero section, platform kartları, istatistikler görünüyor
- [ ] Platform sayfası: doğru platforma ait sorular listeleniyor
- [ ] Dil ve zorluk filtreleri doğru filtreleme yapıyor
- [ ] Arama çubuğu başlık ve açıklamada arama yapabiliyor
- [ ] Soru detay sayfası: başlık, açıklama ve kod kodu görünüyor
- [ ] Kod kopyalama butonu çalışıyor
- [ ] Varolmayan soru ID'si için 404 sayfası görünüyor
- [ ] Tüm neobrutalism stilleri (kalın kenarlık, sert gölge, hover efektleri) uygulanmış
