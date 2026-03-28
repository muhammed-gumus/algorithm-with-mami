---
description: Faz 3 - Dil listesini genişletme, tüm sorular sayfası ve admin linkini gizleme
---

# Faz 3 - Diller, Tüm Sorular Sayfası & Admin Gizleme

Bu faz üç sorunu çözer:
1. Admin panelde ve uygulama genelinde dil listesini genişletme.
2. "Soruları Keşfet" butonuna basınca tüm soruları gösteren bir sayfa açılması.
3. Admin girişini footer'dan kaldırma (kimse bilmesin).

## Sorun 5: Dil Listesini Genişletme

Admin formdaki dil dropdown'u ve filtrelerde sadece sorusu olan diller var. Sorusu olmayan diller de olmalı.

### Adımlar:

// turbo-all

1. `components/AdminForm.js` dosyasındaki dil `<select>` alanını genişlet. Şu dilleri ekle:
   - JavaScript, Python, C++, SQL (mevcut)
   - TypeScript, Java, C#, Go, Rust, Swift, Kotlin, Ruby, PHP, C

```jsx
<select name="language" value={formData.language} onChange={handleChange} className="neo-input cursor-pointer">
  <option value="javascript">JavaScript</option>
  <option value="typescript">TypeScript</option>
  <option value="python">Python</option>
  <option value="java">Java</option>
  <option value="cpp">C++</option>
  <option value="csharp">C#</option>
  <option value="go">Go</option>
  <option value="rust">Rust</option>
  <option value="swift">Swift</option>
  <option value="kotlin">Kotlin</option>
  <option value="ruby">Ruby</option>
  <option value="php">PHP</option>
  <option value="c">C</option>
  <option value="sql">SQL</option>
</select>
```

2. `components/Badge.js` dosyasındaki `colorMap`'e yeni diller için renkler ekle:

```javascript
const colorMap = {
  // ... mevcut renkler
  typescript: 'bg-blue-600 text-neo-white',
  java: 'bg-red-600 text-neo-white',
  csharp: 'bg-violet-600 text-neo-white',
  go: 'bg-cyan-500 text-neo-white',
  rust: 'bg-orange-700 text-neo-white',
  swift: 'bg-orange-500 text-neo-white',
  kotlin: 'bg-purple-600 text-neo-white',
  ruby: 'bg-red-700 text-neo-white',
  php: 'bg-indigo-500 text-neo-white',
  c: 'bg-gray-600 text-neo-white',
};
```

3. `lib/problems.js` dosyasındaki `getStats()` fonksiyonundaki `byLanguage` objesine yeni dilleri de ekle (sayıları 0'dan başlayacak).

---

## Sorun 6: Tüm Soruları Gösteren Sayfa

"Soruları Keşfet" butonuna basınca `/platform/leetcode` yerine tüm soruların yer aldığı bir sayfaya gidilmeli. Bu sayfada detaylı filtreleme (platform, dil, zorluk, arama) olmalı.

### Adımlar:

1. `app/problems/page.js` dosyası oluştur — tüm soruları listeleyen sayfa:

```jsx
import { getAllProblems } from '@/lib/problems';
import FilterBar from '@/components/FilterBar';

export const metadata = {
  title: 'Tüm Sorular | Algorithm with Mami',
  description: 'LeetCode, HackerRank ve CodeWars platformlarından tüm algoritma soruları ve çözümleri.',
};

export default function AllProblemsPage() {
  const problems = getAllProblems();

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Sayfa Başlık */}
      <section className="bg-neo-blue border-b-3 border-neo-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">Tüm Sorular</h1>
          <p className="text-xl font-body font-medium opacity-90 max-w-2xl mx-auto">
            Tüm platformlardaki algoritma soruları ve çözümleri. Filtreleyerek aradığını bul!
          </p>
        </div>
      </section>

      {/* İçerik */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <FilterBar initialProblems={problems} />
        </div>
      </section>
    </div>
  );
}
```

2. `components/FilterBar.js` dosyasına **platform filtresi** ekle. Mevcut dil ve zorluk filtresinin yanına platform filtresi de konacak:

```jsx
const [platform, setPlatform] = useState('all');
const availablePlatforms = ['all', ...Array.from(new Set(initialProblems.map(p => p.platform)))];

// useEffect filtreleme mantığına ekle:
if (platform !== 'all') {
  filtered = filtered.filter(p => p.platform === platform);
}
```

Platform filtre UI'ını dil filtresinin üstüne ekle:
```jsx
{/* Platform filtreleri */}
<div className="mb-4">
  <p className="font-body text-sm font-bold mb-2 text-gray-600">Platforma Göre:</p>
  <div className="flex flex-wrap gap-3">
    {availablePlatforms.map(plat => (
      <button
        key={plat}
        onClick={() => setPlatform(plat)}
        className={`neo-badge cursor-pointer transition-colors ${
          platform === plat
            ? 'bg-neo-black text-neo-white'
            : 'bg-neo-white hover:bg-gray-100 text-neo-black'
        }`}
      >
        {plat === 'all' ? 'Tümü' : plat.charAt(0).toUpperCase() + plat.slice(1)}
      </button>
    ))}
  </div>
</div>
```

3. `app/page.js` dosyasındaki "Soruları Keşfet" butonunun `href`'ini `/platform/leetcode`'dan `/problems`'e değiştir:

```jsx
<Link href="/problems" className="neo-btn bg-neo-white w-full sm:w-auto text-center">
  Soruları Keşfet →
</Link>
```

4. `components/Navbar.js` dosyasına "Tüm Sorular" linki ekle (platformlardan önce):

```jsx
<Link href="/problems" className={isActive('/problems')}>
  Tüm Sorular
</Link>
```

Mobil menüye de ekle.

---

## Sorun 7: Admin Linkini Footer'dan Kaldırma

Admin girişi footer'da görünmemeli. Sadece `/admin` URL'ini bilen erişebilsin.

### Adımlar:

1. `components/Footer.js` dosyasından admin girişi linkini kaldır. Satır 42-44 arası şu kodu sil:

```jsx
// BU KISMI SİL:
<Link href="/admin" className="hover:text-neo-green transition-colors mt-4 sm:mt-0 px-2 py-1 rounded">
  Admin Girişi
</Link>
```

Yerine sadece copyright satırı kalsın. Admin paneline sadece doğrudan `/admin` URL'ini yazarak erişilebilir.

2. Tarayıcıdan kontrol et:
   - Footer'da admin linki görünmüyor mu?
   - `/admin` URL'sine doğrudan gidince hâlâ çalışıyor mu?
   - Tüm sorular sayfası (`/problems`) düzgün çalışıyor mu?
   - Platform filtresi dahil tüm filtreler çalışıyor mu?
   - Navbar'da "Tüm Sorular" linki çıkıyor mu?
   - Ana sayfadaki "Soruları Keşfet" butonu `/problems`'e yönlendiriyor mu?
   - Admin formunda tüm dil seçenekleri görünüyor mu?
