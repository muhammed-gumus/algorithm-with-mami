"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        // middleware'in yeni token'ı algılaması için router.refresh() ve push() kullanıyoruz
        router.refresh();
        router.push('/admin');
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="neo-card max-w-md w-full bg-neo-white">
        <h1 className="text-3xl font-heading font-black text-center mb-2">
          🔐 Admin Girişi
        </h1>
        <p className="text-center text-gray-600 font-body mb-8">
          Devam etmek için şifrenizi girin
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            className="neo-input"
            required
            autoFocus
          />

          {error && (
            <div className="border-3 border-neo-red bg-red-100 text-neo-red p-3 font-heading font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`neo-btn w-full text-center bg-neo-accent text-neo-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
          </button>
        </form>

        <Link href="/" className="block text-center mt-6 font-body text-gray-500 hover:text-neo-accent transition-colors font-bold">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
