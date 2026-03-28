import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="neo-card text-center max-w-lg bg-neo-white">
        <div className="text-8xl mb-4 animate-[bounce_2s_infinite]">🤔</div>
        <h1 className="text-6xl font-heading font-black mb-4">404</h1>
        <p className="text-2xl font-body font-bold text-gray-800 mb-8">
          Aradığın sayfa bulunamadı.<br/>Belki yanlış bir yol izledin?
        </p>
        <Link href="/" className="neo-btn inline-block bg-neo-accent text-white">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
