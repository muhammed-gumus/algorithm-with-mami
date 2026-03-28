---
description: Faz 1 - Renk tanımlamalarını düzenleme ve pink rengini değiştirme
---

# Faz 1 - Renk Sistemi İyileştirmesi

Bu faz iki sorunu çözer:
1. `globals.css` ve `tailwind.config.mjs` arasındaki renk tanımlama karmaşıklığını giderir.
2. `neo-pink` rengini daha kaliteli bir renkle değiştirir.

## Sorun 1: Çift Renk Tanımlaması

Proje Tailwind CSS v4 kullanıyor. v4'te `@theme` direktifi tek kaynak olarak yeterli.
`tailwind.config.mjs` dosyasındaki renk, shadow, borderWidth ve fontFamily tanımlamaları gereksiz çünkü `globals.css`'teki `@theme` bloğu zaten bunları tanımlıyor.

### Adımlar:

// turbo-all

1. `tailwind.config.mjs` dosyasını sadeleştir — `theme.extend` altındaki `colors`, `boxShadow`, `borderWidth` ve `fontFamily` bloklarının tamamını kaldır. Sadece `content` ve `plugins` kalsın:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  plugins: [],
};
```

2. `globals.css` dosyasındaki `@theme` bloğunun tüm renkleri, shadow'ları ve font tanımlamalarını içerdiğini doğrula. (Zaten içeriyor, değişiklik gerekmez.)

3. `npm run dev` çalıştırarak uygulamanın hatasız çalıştığını doğrula.

---

## Sorun 2: neo-pink Rengini Değiştirme

`neo-pink` (#FF6B9D) çok yerde kullanılıyor ve kötü görünüyor. Yerine **neo-cyan** (#00D4FF) veya **neo-teal** (#2DD4BF) gibi neobrutalism'e uygun, modern ve şık bir vurgu rengi konulacak.

Önerilen yeni renk: `neo-accent` adıyla `#2DD4BF` (teal) — sarı arka plan ile güzel kontrast oluşturur ve neobrutalism'e çok uyar.

### Adımlar:

1. `globals.css` dosyasında `@theme` bloğunda `--color-neo-pink: #FF6B9D;` satırını `--color-neo-accent: #2DD4BF;` olarak değiştir.

2. Projedeki tüm `neo-pink` referanslarını `neo-accent` olarak değiştir. Etkilenen dosyalar:
   - `components/Navbar.js` — `text-neo-pink` → `text-neo-accent` (2 yerde)
   - `components/Footer.js` — `text-neo-pink` → `text-neo-accent`
   - `components/ProblemCard.js` — `group-hover:text-neo-pink` → `group-hover:text-neo-accent`
   - `app/admin/page.js` — `hover:text-neo-pink`, `hover:bg-neo-pink` → `hover:text-neo-accent`, `hover:bg-neo-accent` (3 yerde)
   - `app/admin/login/page.js` — `bg-neo-pink`, `hover:text-neo-pink` → `bg-neo-accent`, `hover:text-neo-accent`
   - `app/problem/[id]/page.js` — `hover:text-neo-pink`, `group-hover:text-neo-pink` → `hover:text-neo-accent`, `group-hover:text-neo-accent` (4 yerde)
   - `app/not-found.js` — `bg-neo-pink` → `bg-neo-accent`

3. Tarayıcıdan tüm sayfaları kontrol et:
   - Ana sayfa
   - Navbar aktif link rengi
   - Footer "Tasarlayan & Geliştiren" başlığı
   - Soru detay sayfası breadcrumb linkleri
   - Admin panel hover efektleri
   - Admin login butonu

4. Her şey teal/accent rengi ile tutarlı göründüğünü doğrula.
