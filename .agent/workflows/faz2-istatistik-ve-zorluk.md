---
description: Faz 2 - Ana sayfa istatistiklerini platform bazlı yapma ve soru zorluk seviyelerini araştırıp güncelleme
---

# Faz 2 - İstatistik & Zorluk Seviyesi İyileştirmesi

Bu faz iki sorunu çözer:
1. Ana sayfadaki istatistik alanında zorluk yerine platform ve soru sayılarını gösterme.
2. Her sorunun gerçek zorluk seviyesini araştırıp `problems.json` verisini güncelleme.

## Sorun 3: İstatistik Alanını Değiştirme

Ana sayfadaki istatistik bölümünde easy/medium/hard yerine platform bazlı soru sayıları gösterilecek.

### Adımlar:

// turbo-all

1. `app/page.js` dosyasındaki istatistik section'ını güncelle. Mevcut 4'lü grid'i şu şekilde değiştir:

```jsx
{/* İstatistikler */}
<section className="py-12 px-4 border-b-3 border-neo-black bg-neo-white">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
    <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform -rotate-1">
      <p className="text-4xl font-heading font-black text-neo-blue">{stats.total}</p>
      <p className="font-heading font-bold mt-2">Toplam Soru</p>
    </div>
    <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform rotate-1">
      <p className="text-4xl font-heading font-black text-neo-orange">{stats.byPlatform.leetcode || 0}</p>
      <p className="font-heading font-bold mt-2">LeetCode</p>
    </div>
    <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform -rotate-2">
      <p className="text-4xl font-heading font-black text-neo-green">{stats.byPlatform.hackerrank || 0}</p>
      <p className="font-heading font-bold mt-2">HackerRank</p>
    </div>
    <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform rotate-2">
      <p className="text-4xl font-heading font-black text-neo-purple">{stats.byPlatform.codewars || 0}</p>
      <p className="font-heading font-bold mt-2">CodeWars</p>
    </div>
  </div>
</section>
```

2. `lib/problems.js` dosyasındaki `getStats()` fonksiyonundan `byDifficulty` kısmını kaldırma. Zorluk hâlâ veride mevcut olacak ama istatistik kartlarında gösterilmeyecek.

---

## Sorun 4: Zorluk Seviyelerini Araştırıp Güncelleme

Tüm soruların `difficulty` alanı `"medium"` olarak ayarlanmış. Her sorunun gerçek zorluk seviyesi araştırılıp güncellenecek.

### Adımlar:

1. Her platformdaki soruların gerçek zorluk seviyelerini araştır:

**LeetCode soruları** (easy/medium/hard olarak sınıflandırılır):
   - `Two Sum` → easy
   - `Palindrome Number` → easy
   - `Roman To Integer` → easy
   - `Longest Common Prefix` → easy
   - `Valid Parentheses` → easy
   - `Merge Two Sorted Lists` → easy
   - `Remove Duplicates from Sorted Array` → easy
   - `Remove Element` → easy
   - `Find the Index of the First Occurrence in a String` → easy
   - `Search Insert Position` → easy
   - `Length of Last Word` → easy
   - `Plus One` → easy
   - `Add Binary` → easy
   - `Sqrt(x)` → easy
   - `Merge Sorted Array` → easy
   - `Remove Duplicates from Sorted List` → easy
   - `Counter` → easy (LeetCode 30 Days of JavaScript)
   - `Counter II` → easy
   - `Create Hello World Function` → easy
   - `To Be Or Not To Be` → easy
   - `Apply Transform Over Each Element in Array` → easy

**HackerRank soruları** (easy/medium/hard olarak sınıflandırılır):
   - `Solve Me First` → easy
   - `Simple Array Sum` → easy
   - `A Very Big Sum` → easy
   - `Plus Minus` → easy
   - `Staircase` → easy
   - `Mini-Max Sum` → easy
   - `Birthday Cake Candles` → easy
   - `Time Conversion` → easy

**CodeWars soruları** (8 kyu - 1 kyu, kyu sistemi kullanır ama biz easy/medium/hard'a çevirelim):
   - `Adults Only` → easy (8 kyu)
   - `On the Canadian Border` → easy (8 kyu)
   - `Register for the Party` → easy (8 kyu)
   - `Collect Tuition` → easy (8 kyu)
   - `Best Selling Books` → easy (8 kyu)
   - `Countries Capitals for Trivia Night` → easy (8 kyu)
   - `Third Angle of a Triangle` → easy (8 kyu)
   - `Bit Length` → easy (8 kyu)
   - `Repeat and Reverse` → easy (7 kyu)
   - `Simple IN` → medium (7 kyu)
   - `Pokemon Damage Multipliers` → medium (7 kyu)
   - `Top 10 Customers by Total Payments` → medium (6 kyu)

2. `data/problems.json` dosyasında her sorunun `difficulty` alanını doğru değerle güncelle.

3. Tarayıcıdan kontrol et:
   - Ana sayfadaki istatistik kartlarında platform adları ve soru sayıları doğru gösteriliyor mu?
   - Soru kartlarındaki zorluk badge'leri doğru renklerde mi? (easy=yeşil, medium=sarı, hard=kırmızı)
   - Admin paneldeki soru listesi doğru zorlukları gösteriyor mu?
