---
description: Faz 1 - Next.js proje kurulumu, Tailwind CSS ve neobrutalism design system oluşturma
---

# Faz 1 — Proje Kurulumu

Bu faz, Next.js projesinin sıfırdan kurulmasını, Tailwind CSS entegrasyonunu ve neobrutalism tasarım sisteminin oluşturulmasını kapsar.

---

## Adım 1: Next.js Projesi Oluşturma

Mevcut `algorithm-with-mami` dizininde yeni bir Next.js projesi oluştur. Mevcut dosyalar (LeetCode, HackerRank, CodeWars klasörleri ve README.md) korunmalı.

```bash
# Proje dizinine git ve Next.js projesini başlat
# --help ile mevcut seçenekleri kontrol et
npx -y create-next-app@latest --help
```

```bash
# Non-interactive modda Next.js projesi oluştur
# Tailwind CSS dahil, TypeScript KULLANMA, App Router KULLAN, src/ dizini KULLANMA
npx -y create-next-app@latest ./ \
  --js \
  --tailwind \
  --app \
  --no-src-dir \
  --no-turbopack \
  --eslint \
  --import-alias "@/*"
```

> **DİKKAT**: Eğer mevcut dosyalarla çakışma olursa, `--overwrite` flag'ini KULLANMA. Gerekli dosyaları elle oluştur.

### Doğrulama
```bash
npm run dev
# http://localhost:3000 adresinde Next.js varsayılan sayfası görünmeli
```

---

## Adım 2: Tailwind CSS Neobrutalism Konfigürasyonu

`tailwind.config.js` dosyasını neobrutalism tasarımına uygun şekilde güncelle.

### `tailwind.config.js` değişiklikleri:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Neobrutalism renk paleti
      colors: {
        'neo-yellow': '#FFD600',
        'neo-pink': '#FF6B9D',
        'neo-blue': '#4ECDC4',
        'neo-orange': '#FF8A00',
        'neo-purple': '#A855F7',
        'neo-green': '#22C55E',
        'neo-red': '#EF4444',
        'neo-bg': '#FFF8E7',
        'neo-black': '#1A1A2E',
        'neo-white': '#FFFFFF',
      },
      // Neobrutalism sert gölge
      boxShadow: {
        'neo': '4px 4px 0px 0px #1A1A2E',
        'neo-lg': '6px 6px 0px 0px #1A1A2E',
        'neo-xl': '8px 8px 0px 0px #1A1A2E',
        'neo-hover': '2px 2px 0px 0px #1A1A2E',
        'neo-active': '1px 1px 0px 0px #1A1A2E',
      },
      // Neobrutalism kenarlık
      borderWidth: {
        '3': '3px',
      },
      // Font aileleri
      fontFamily: {
        'heading': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

---

## Adım 3: Google Fonts Entegrasyonu

`app/layout.js` dosyasına Google Fonts ekle:

```javascript
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});
```

`<body>` tag'ına font variable'larını class olarak ekle:
```html
<body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
```

---

## Adım 4: Neobrutalism Global CSS

`app/globals.css` dosyasını güncelle. Tailwind directive'lerinin altına temel neobrutalism stilleri ekle:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-body bg-neo-bg text-neo-black;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading font-bold;
  }

  code, pre {
    @apply font-mono;
  }
}

@layer components {
  /* Neobrutalism buton stili */
  .neo-btn {
    @apply px-6 py-3 font-heading font-bold text-lg
           border-3 border-neo-black bg-neo-yellow
           shadow-neo cursor-pointer
           transition-all duration-150 ease-in-out
           hover:translate-x-[2px] hover:translate-y-[2px]
           hover:shadow-neo-hover
           active:translate-x-[3px] active:translate-y-[3px]
           active:shadow-neo-active;
  }

  /* Neobrutalism kart stili */
  .neo-card {
    @apply border-3 border-neo-black bg-neo-white
           shadow-neo p-6
           transition-all duration-150 ease-in-out
           hover:translate-x-[2px] hover:translate-y-[2px]
           hover:shadow-neo-hover;
  }

  /* Neobrutalism input stili */
  .neo-input {
    @apply w-full px-4 py-3 font-body text-lg
           border-3 border-neo-black bg-neo-white
           focus:outline-none focus:ring-0
           focus:shadow-neo;
  }

  /* Neobrutalism badge stili */
  .neo-badge {
    @apply inline-block px-3 py-1 text-sm font-heading font-bold
           border-2 border-neo-black;
  }
}
```

---

## Adım 5: Temel Sayfa Yapısını Hazırlama

`app/page.js` dosyasını temizleyip basit bir "coming soon" sayfası yap. Bu, Tailwind ve fontların düzgün çalıştığını doğrulamak içindir:

```jsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neo-bg">
      <div className="neo-card text-center">
        <h1 className="text-5xl font-heading font-black mb-4">
          Algorithm with Mami 🧠
        </h1>
        <p className="text-xl font-body text-gray-700 mb-6">
          Algoritma soruları ve çözümleri — yakında burada!
        </p>
        <button className="neo-btn">Keşfet</button>
      </div>
    </main>
  );
}
```

---

## Adım 6: Dizin Yapısını Oluşturma

Projenin geri kalanı için gerekli boş dizinleri oluştur:

```bash
mkdir -p components
mkdir -p data
mkdir -p lib
mkdir -p app/platform/\[slug\]
mkdir -p app/problem/\[id\]
mkdir -p app/admin/login
mkdir -p app/api/auth/login
mkdir -p app/api/problems/\[id\]
```

---

## Doğrulama Kontrol Listesi

Bu fazın sonunda aşağıdakilerin çalıştığından emin ol:

- [ ] `npm run dev` hatasız çalışıyor
- [ ] `http://localhost:3000` adresinde neobrutalism tarzında "coming soon" sayfası görünüyor
- [ ] Fontlar (Space Grotesk, Inter, JetBrains Mono) yükleniyor
- [ ] Neobrutalism renkleri, gölgeler ve buton hover efektleri çalışıyor
- [ ] Tüm gerekli dizinler oluşturulmuş
- [ ] Mevcut çözüm dosyaları (LeetCode, HackerRank, CodeWars) hala yerinde
