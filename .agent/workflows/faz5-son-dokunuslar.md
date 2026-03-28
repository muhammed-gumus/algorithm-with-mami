---
description: Faz 5 - Responsive tasarım, SEO, syntax highlighting, micro-animasyonlar ve son dokunuşlar
---

# Faz 5 — Son Dokunuşlar

Bu faz, uygulamanın profesyonel bir ürün seviyesine getirilmesini kapsar: responsive tasarım, SEO optimizasyonu, syntax highlighting, animasyonlar ve performans iyileştirmeleri.

---

## Adım 1: Syntax Highlighting Entegrasyonu

Kod bloklarında syntax highlighting için `highlight.js` paketini kur ve entegre et.

### Paket Kurulumu
```bash
npm install highlight.js
```

### CodeBlock Bileşeni Güncelleme

`components/CodeBlock.js` dosyasını güncelle:

```jsx
"use client";
import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';

// Sadece kullanılan dilleri import et (bundle boyutunu küçültmek için)
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import sql from 'highlight.js/lib/languages/sql';

// Highlight.js temasını import et — neobrutalism'e uygun koyu tema
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('sql', sql);

export default function CodeBlock({ code, language }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dil adı dönüştürme
  const langMap = {
    javascript: 'javascript',
    python: 'python',
    cpp: 'cpp',
    sql: 'sql',
  };

  return (
    <div className="border-3 border-neo-black overflow-hidden">
      {/* Üst bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b-2 border-neo-black">
        <div className="flex items-center gap-2">
          {/* Mac tarzı noktalar */}
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="ml-4 text-gray-400 font-mono text-sm">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white font-mono text-sm
                     px-3 py-1 border border-gray-600 hover:border-white
                     transition-all duration-200"
        >
          {copied ? '✓ Kopyalandı!' : '📋 Kopyala'}
        </button>
      </div>
      {/* Kod alanı */}
      <pre className="p-6 overflow-x-auto bg-[#282c34]">
        <code ref={codeRef} className={`language-${langMap[language] || language} font-mono text-sm leading-relaxed`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
```

---

## Adım 2: Responsive Tasarım

Tüm sayfalarda mobil uyumluluk sağla. Tailwind'in responsive prefix'lerini kullan.

### Navbar (mobil hamburger menü)

```jsx
// Mobil menü state'i ile aç/kapa
const [menuOpen, setMenuOpen] = useState(false);

// Masaüstünde: linkler yatay sıralı (md:flex)
// Mobilde: hamburger butonu görünür, menü aşağı açılır

<div className={`${menuOpen ? 'block' : 'hidden'} md:hidden
                 absolute top-full left-0 right-0
                 bg-neo-white border-b-3 border-neo-black`}>
  {/* Mobil linkler, dikey sıralı */}
  <a className="block px-4 py-3 border-b border-gray-200 font-heading font-bold
               hover:bg-neo-yellow transition-colors">
    LeetCode
  </a>
  {/* ... */}
</div>
```

### Grid Düzenlemeleri

| Sayfa | Masaüstü | Tablet | Mobil |
|---|---|---|---|
| Platform kartları | 3 sütun (`grid-cols-3`) | 2 sütun (`md:grid-cols-2`) | 1 sütun (`grid-cols-1`) |
| Soru kartları | 3 sütun | 2 sütun | 1 sütun |
| İstatistik kutuları | 4 sütun | 2 sütun | 2 sütun |
| Admin tablo | Tam tablo | Yatay kaydırma | Kart görünüm |

### Özel Breakpoint Kontrolleri

```css
/* globals.css'e ekle */
@media (max-width: 768px) {
  .hero-title {
    @apply text-4xl;
  }
}
```

### Admin Tablo → Mobil Kart Dönüşümü

Mobilde tabloyu gizleyip kart formatına geç:

```html
<!-- Masaüstü tablo -->
<div class="hidden md:block">
  <table>...</table>
</div>

<!-- Mobil kartlar -->
<div class="md:hidden space-y-4">
  {problems.map(p => (
    <div class="neo-card">
      <h3 class="font-heading font-bold">{p.title}</h3>
      <div class="flex gap-2 mt-2">
        <Badge type={p.difficulty} />
        <Badge type={p.platform} />
      </div>
      <div class="flex gap-2 mt-4">
        <button>Düzenle</button>
        <button>Sil</button>
      </div>
    </div>
  ))}
</div>
```

---

## Adım 3: SEO Optimizasyonu

### Root Layout Metadata (`app/layout.js`)

```javascript
export const metadata = {
  title: {
    default: 'Algorithm with Mami — Algoritma Soruları & Çözümleri',
    template: '%s | Algorithm with Mami',
  },
  description: 'LeetCode, HackerRank ve CodeWars algoritma soruları ve çözümleri. Teknik mülakat hazırlığı için kapsamlı kaynak.',
  keywords: ['algoritma', 'leetcode', 'hackerrank', 'codewars', 'javascript', 'python', 'c++', 'sql', 'mülakat hazırlığı'],
  authors: [{ name: 'Mami', url: 'https://www.instagram.com/buildwithmami/' }],
  openGraph: {
    title: 'Algorithm with Mami',
    description: 'Algoritma soruları ve çözümleri',
    type: 'website',
  },
};
```

### Platform Sayfası Metadata

```javascript
// app/platform/[slug]/page.js
export async function generateMetadata({ params }) {
  const meta = platformMeta[params.slug];
  return {
    title: `${meta.name} Çözümleri`,
    description: `${meta.name} platformundaki algoritma soruları ve çözümleri — ${meta.description}`,
  };
}
```

### Soru Detay Sayfası Metadata

```javascript
// app/problem/[id]/page.js
export async function generateMetadata({ params }) {
  const problem = getProblemById(params.id);
  if (!problem) return { title: 'Soru Bulunamadı' };

  return {
    title: problem.title,
    description: `${problem.title} — ${problem.platform} ${problem.difficulty} çözümü (${problem.language})`,
  };
}
```

### Robots ve Sitemap

Admin sayfalarını arama motorlarından gizle:

```javascript
// app/admin/robots.js veya admin layout'una ekle
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
```

---

## Adım 4: Micro-Animasyonlar

Neobrutalism tarzıyla uyumlu, ince animasyonlar ekle.

### Kart Hover Efektleri (globals.css)

```css
@layer components {
  .neo-card {
    @apply border-3 border-neo-black bg-neo-white
           shadow-neo p-6
           transition-all duration-150 ease-in-out;
  }

  .neo-card:hover {
    @apply translate-x-[2px] translate-y-[2px] shadow-neo-hover;
  }

  .neo-card:active {
    @apply translate-x-[3px] translate-y-[3px] shadow-neo-active;
  }
}
```

### Sayfa Yüklenme Animasyonu

Ana sayfadaki kartlar için stagger animasyonu:

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
}

/* Stagger efekti */
.animate-slide-up:nth-child(1) { animation-delay: 0.1s; }
.animate-slide-up:nth-child(2) { animation-delay: 0.2s; }
.animate-slide-up:nth-child(3) { animation-delay: 0.3s; }
.animate-slide-up:nth-child(4) { animation-delay: 0.4s; }
.animate-slide-up:nth-child(5) { animation-delay: 0.5s; }
.animate-slide-up:nth-child(6) { animation-delay: 0.6s; }
```

### Badge Hover Efekti

```css
.neo-badge {
  @apply transition-all duration-100;
}

.neo-badge:hover {
  @apply scale-105;
}
```

### Buton Tıklama Efekti

Butonlar tıklandığında "basılma" hissi vermeli:

```css
.neo-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0px 0px #1A1A2E;
}
```

### Kopyalama Butonu Animasyonu

Kopyalama başarılı olduğunda kısa bir "tick" animasyonu:

```css
@keyframes copyTick {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.copy-success {
  animation: copyTick 0.3s ease-in-out;
  color: #22C55E;
}
```

---

## Adım 5: 404 Sayfası

`app/not-found.js` dosyasını oluştur:

```jsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="neo-card text-center max-w-lg">
        <div className="text-8xl mb-4">🤔</div>
        <h1 className="text-5xl font-heading font-black mb-4">404</h1>
        <p className="text-xl font-body text-gray-600 mb-8">
          Aradığın sayfa bulunamadı. Belki yanlış bir yol izledin?
        </p>
        <Link href="/" className="neo-btn inline-block bg-neo-pink">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
```

---

## Adım 6: Footer Bileşeni

`components/Footer.js` dosyasını oluştur:

```jsx
export default function Footer() {
  return (
    <footer className="border-t-3 border-neo-black bg-neo-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol: Logo ve açıklama */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-2">
              Algorithm with Mami 🧠
            </h3>
            <p className="text-gray-400 font-body text-sm">
              Algoritma soruları ve çözümleri
            </p>
          </div>

          {/* Orta: Platformlar */}
          <div>
            <h4 className="font-heading font-bold mb-2">Platformlar</h4>
            <ul className="space-y-1 text-gray-400 text-sm">
              <li><a href="/platform/leetcode" className="hover:text-neo-yellow">LeetCode</a></li>
              <li><a href="/platform/hackerrank" className="hover:text-neo-green">HackerRank</a></li>
              <li><a href="/platform/codewars" className="hover:text-neo-purple">CodeWars</a></li>
            </ul>
          </div>

          {/* Sağ: Sosyal medya */}
          <div>
            <h4 className="font-heading font-bold mb-2">Sosyal</h4>
            <a href="https://www.instagram.com/buildwithmami/"
               target="_blank"
               rel="noopener noreferrer"
               className="text-gray-400 hover:text-neo-pink text-sm">
              📸 @buildwithmami
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
          © 2026 Algorithm with Mami. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
```

Footer'ı `app/layout.js`'deki `<main>` tag'ından sonra ekle.

---

## Adım 7: Loading ve Error States

### Loading Bileşeni

`app/loading.js` dosyasını oluştur:

```jsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center">
      <div className="neo-card text-center">
        <div className="text-6xl mb-4 animate-bounce">🧠</div>
        <p className="font-heading font-bold text-xl">Yükleniyor...</p>
      </div>
    </div>
  );
}
```

### Error Bileşeni

`app/error.js` dosyasını oluştur:

```jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="neo-card text-center max-w-lg border-neo-red">
        <div className="text-6xl mb-4">💥</div>
        <h2 className="text-3xl font-heading font-black mb-4">Bir Hata Oluştu</h2>
        <p className="font-body text-gray-600 mb-6">{error?.message}</p>
        <button onClick={reset} className="neo-btn bg-neo-blue">
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
```

---

## Adım 8: Final Build ve Test

### Build Kontrolü

```bash
# Production build oluştur
npm run build

# Hata olmamalı. Varsa düzelt.
```

### Lighthouse Kontrolü

Tarayıcıda DevTools → Lighthouse sekmesinden performans, erişilebilirlik, SEO puanlarını kontrol et:

- Performance: > 80
- Accessibility: > 90
- SEO: > 90
- Best Practices: > 90

---

## Doğrulama Kontrol Listesi

- [ ] Syntax highlighting tüm dillerde (JS, Python, C++, SQL) çalışıyor
- [ ] Kopyalama butonu çalışıyor ve başarı animasyonu gösteriliyor
- [ ] Mobilde navbar hamburger menüsü düzgün açılıp kapanıyor
- [ ] Tüm kartlar ve grid'ler mobilde doğru şekilde stack oluyor
- [ ] Admin tablosu mobilde kart formatına dönüşüyor
- [ ] SEO meta tag'leri tüm sayfalarda doğru şekilde set ediliyor
- [ ] Admin sayfaları robots tarafından index'lenmiyor
- [ ] Hover animasyonları pürüzsüz çalışıyor
- [ ] Sayfa yüklenme animasyonları çalışıyor
- [ ] 404 sayfası doğru görünüyor
- [ ] Footer tüm sayfalarda görünüyor
- [ ] `npm run build` hatasız tamamlanıyor
- [ ] Loading ve error state'leri düzgün görünüyor
