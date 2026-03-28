---
description: Faz 4 - Admin login sayfası, JWT authentication, admin dashboard, soru ekleme/düzenleme/silme
---

# Faz 4 — Admin Paneli

Bu faz, şifre korumalı admin panelini kapsar: login sayfası, JWT kimlik doğrulama, soru yönetimi (ekleme, düzenleme, silme).

---

## Adım 1: Ortam Değişkenlerini Tanımlama

`.env.local` dosyasını proje kök dizininde oluştur:

```env
ADMIN_PASSWORD=buraya-guclu-bir-sifre-belirle
JWT_SECRET=buraya-rastgele-uzun-bir-karakter-dizisi-yaz
```

> **ÖNEMLİ**: Bu dosyayı `.gitignore`'a ekle (Next.js zaten `.env.local`'ı ignore eder ama kontrol et).

### Paket Kurulumu

JWT işlemleri için `jose` paketini kur:

```bash
npm install jose
```

> `jose` paketi edge runtime uyumludur ve Next.js App Router ile iyi çalışır. `jsonwebtoken` yerine tercih edilmesinin sebebi budur.

---

## Adım 2: JWT Yardımcı Fonksiyonları

`lib/auth.js` dosyasını oluştur:

```javascript
// lib/auth.js
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// 1. createToken() → string
//    - Payload: { role: 'admin', iat: now }
//    - Expire: 24 saat
//    - Algorithma: HS256
//    - JWT token string döndür

// 2. verifyToken(token) → payload | null
//    - Token'ı doğrula
//    - Geçerliyse payload döndür
//    - Geçersiz veya süresi dolmuşsa null döndür

// 3. getTokenFromRequest(request) → string | null
//    - Önce cookie'den 'admin-token' ara
//    - Sonra Authorization header'dan 'Bearer xxx' ara
//    - Token bulursa döndür, bulamazsa null döndür

// 4. isAuthenticated(request) → boolean
//    - getTokenFromRequest ile token al
//    - verifyToken ile doğrula
//    - Geçerliyse true, değilse false döndür
```

### Fonksiyon Detayları

**createToken:**
```javascript
export async function createToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}
```

**verifyToken:**
```javascript
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
```

---

## Adım 3: Login API Endpoint

`app/api/auth/login/route.js` dosyasını oluştur:

```javascript
// POST /api/auth/login
// Request Body: { password: "..." }
//
// İşlem adımları:
// 1. Body'den password'ü al
// 2. process.env.ADMIN_PASSWORD ile karşılaştır
// 3. Eşleşirse:
//    a. createToken() ile JWT oluştur
//    b. Token'ı httpOnly cookie olarak set et:
//       - name: 'admin-token'
//       - httpOnly: true
//       - secure: process.env.NODE_ENV === 'production'
//       - sameSite: 'strict'
//       - maxAge: 86400 (24 saat, saniye cinsinden)
//       - path: '/'
//    c. Response: { success: true }
// 4. Eşleşmezse:
//    a. Response: { success: false, error: "Geçersiz şifre" }
//    b. Status: 401
```

### Logout Endpoint

`app/api/auth/logout/route.js` dosyasını oluştur:

```javascript
// POST /api/auth/logout
//
// İşlem:
// 1. 'admin-token' cookie'sini sil (maxAge: 0)
// 2. Response: { success: true }
```

### Auth Kontrol Endpoint

`app/api/auth/check/route.js` dosyasını oluştur:

```javascript
// GET /api/auth/check
//
// İşlem:
// 1. isAuthenticated(request) ile kontrol et
// 2. Geçerliyse: { authenticated: true }
// 3. Değilse: { authenticated: false }, Status: 401
```

---

## Adım 4: API Routes'u Koruma

Faz 2'de oluşrulan API endpoint'lerine auth koruması ekle.

### `app/api/problems/route.js` — POST Koruması

```javascript
import { isAuthenticated } from '@/lib/auth';

// POST metoduna şu kontrolü ekle:
export async function POST(request) {
  // 1. Auth kontrolü
  const authorized = await isAuthenticated(request);
  if (!authorized) {
    return Response.json(
      { success: false, error: 'Yetkisiz erişim' },
      { status: 401 }
    );
  }

  // 2. Mevcut POST mantığı devam eder...
}
```

### `app/api/problems/[id]/route.js` — PUT ve DELETE Koruması

Aynı auth kontrolünü PUT ve DELETE metodlarına da ekle. GET metodu herkese açık kalmalı.

---

## Adım 5: Admin Login Sayfası

`app/admin/login/page.js` dosyasını oluştur.

### Tasarım Gereksinimleri
- Sayfa ortasında yer alan login kartı
- Arka plan: `bg-neo-bg` full ekran
- Kart: `neo-card` geniş, merkezi konumda
- Sadece şifre alanı (kullanıcı adı yok — tek admin)
- Neobrutalism tarzında input ve buton
- Hatalı girişte kırmızı hata mesajı
- Başarılı girişte `/admin` sayfasına yönlendirme

### Bileşen Yapısı

```jsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="neo-card max-w-md w-full">
        <h1 className="text-3xl font-heading font-black text-center mb-2">
          🔐 Admin Girişi
        </h1>
        <p className="text-center text-gray-600 font-body mb-8">
          Devam etmek için şifrenizi girin
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="neo-input mb-4"
            required
          />

          {error && (
            <div className="border-3 border-neo-red bg-red-100 text-neo-red
                          p-3 mb-4 font-heading font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="neo-btn w-full text-center bg-neo-pink"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
          </button>
        </form>

        <a href="/" className="block text-center mt-6 font-body text-gray-500
                              hover:text-neo-black transition-colors">
          ← Ana Sayfaya Dön
        </a>
      </div>
    </div>
  );
}
```

---

## Adım 6: Admin Middleware (Sayfa Koruması)

`middleware.js` dosyasını proje kök dizininde oluştur. Bu, `/admin` sayfasına yetkisiz erişimi engelleyecek:

```javascript
// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  // /admin/login sayfasını koru_MA_ — login sayfasına herkes erişebilmeli
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // /admin ile başlayan diğer tüm sayfaları koru
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: '/admin/:path*',
};
```

---

## Adım 7: Admin Dashboard Sayfası

`app/admin/page.js` dosyasını oluştur.

### Sayfa İçeriği

1. **Üst çubuk**: "Admin Panel" başlığı + Çıkış butonu
2. **İstatistik kartları**: Toplam soru, platform bazlı dağılım
3. **Soru tablosu**: Tüm soruları listeleyen tablo
4. **"Yeni Soru Ekle" butonu**: Ekleme formunu açar

### Soru Tablosu Yapısı

| Sütun | Açıklama |
|---|---|
| Başlık | Soru başlığı (soruya link) |
| Platform | LeetCode / HackerRank / CodeWars |
| Dil | JavaScript / Python / C++ / SQL |
| Zorluk | Easy / Medium / Hard (renkli badge) |
| Tarih | Eklenme tarihi |
| İşlemler | Düzenle / Sil butonları |

### Silme İşlemi
- Silme butonuna tıklandığında `confirm()` ile onay iste
- Onaylanırsa `DELETE /api/problems/[id]` endpoint'ini çağır
- Başarılıysa tablodan kaldır

### Çıkış İşlemi
- Çıkış butonuna tıklandığında `POST /api/auth/logout` çağır
- Başarılıysa `/admin/login` sayfasına yönlendir

```jsx
"use client";

// State yönetimi:
// - problems: tüm soruların listesi
// - showForm: ekleme/düzenleme formu görünürlüğü
// - editingProblem: düzenlenen sorunun verisi (null ise yeni ekleme)

// useEffect ile sayfa yüklendiğinde:
// 1. GET /api/auth/check → yetkisiz ise /admin/login'e yönlendir
// 2. GET /api/problems → soruları çek ve state'e yaz
```

---

## Adım 8: Admin Form Bileşeni

`components/AdminForm.js` dosyasını oluştur. Hem yeni soru ekleme hem de düzenleme için kullanılacak.

### Form Alanları

| Alan | Tip | Açıklama |
|---|---|---|
| title | text input | Soru başlığı (zorunlu) |
| platform | select | leetcode / hackerrank / codewars (zorunlu) |
| language | select | javascript / python / cpp / sql (zorunlu) |
| difficulty | select | easy / medium / hard (zorunlu) |
| description | textarea | Soru açıklaması (zorunlu) |
| code | textarea (monospace) | Çözüm kodu (zorunlu, font-mono) |

### Form Davranışı

```jsx
"use client";

export default function AdminForm({ problem, onSave, onCancel }) {
  // problem null ise → yeni ekleme modu
  // problem dolu ise → düzenleme modu (alanları doldur)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = problem ? 'PUT' : 'POST';
    const url = problem
      ? `/api/problems/${problem.id}`
      : '/api/problems';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onSave(); // tabloyu yenile
    }
  };

  // ...
}
```

### Kod Textarea'sı Özelleştirmesi
- `font-mono` sınıfı ile monospace font
- Satır numaraları (opsiyonel, CSS ile)
- Tab desteği (Tab tuşuna basınca 2 boşluk ekle):

```javascript
const handleKeyDown = (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const value = e.target.value;
    e.target.value = value.substring(0, start) + '  ' + value.substring(end);
    e.target.selectionStart = e.target.selectionEnd = start + 2;
  }
};
```

---

## Adım 9: Admin Panel Stili

Admin panelindeki tablo için ek Tailwind sınıfları:

```html
<table class="w-full border-3 border-neo-black">
  <thead>
    <tr class="bg-neo-black text-white">
      <th class="p-3 font-heading text-left">Başlık</th>
      <!-- ... -->
    </tr>
  </thead>
  <tbody>
    <tr class="border-b-2 border-neo-black hover:bg-neo-yellow/20 transition-colors">
      <td class="p-3 font-body">...</td>
      <!-- ... -->
    </tr>
  </tbody>
</table>
```

---

## Doğrulama Kontrol Listesi

- [ ] `.env.local` dosyası oluşturulmuş ve şifre + JWT secret tanımlı
- [ ] `/admin/login` sayfası görünüyor
- [ ] Yanlış şifre ile giriş yapılamıyor, hata mesajı gösteriliyor
- [ ] Doğru şifre ile giriş yapıldığında `/admin`'e yönlendiriliyor
- [ ] `/admin` sayfasına login olmadan erişildiğinde `/admin/login`'e yönlendiriliyor
- [ ] Admin dashboard'da tüm sorular tablo halinde listeleniyor
- [ ] "Yeni Soru Ekle" formu açılıp yeni soru eklenebiliyor
- [ ] Eklenen soru hemAPI'den hem de sitedeki listeden görülüyor
- [ ] Mevcut soru düzenlenebiliyor
- [ ] Soru silinebiliyor (onay dialogu sonrası)
- [ ] Çıkış butonu çalışıyor ve login sayfasına yönlendiriyor
- [ ] Token 24 saat sonra otomatik expire oluyor
