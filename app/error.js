"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
      <div className="neo-card bg-neo-white text-center max-w-lg border-neo-red border-3">
        <div className="text-7xl mb-6 animate-pulse">💥</div>
        <h2 className="text-4xl font-heading font-black mb-4">Bir Hata Oluştu!</h2>
        <p className="font-body font-bold text-gray-600 mb-8 p-4 bg-gray-100 border-2 border-gray-300">
          {error?.message || "Sayfa gösterilirken bir sorun yaşandı."}
        </p>
        <button onClick={reset} className="neo-btn bg-neo-blue text-white mr-4">
          Tekrar Dene
        </button>
        <a href="/" className="neo-btn bg-neo-yellow text-neo-black inline-block mt-4 sm:mt-0">
          Ana Sayfa
        </a>
      </div>
    </div>
  );
}
