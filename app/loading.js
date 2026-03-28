export default function Loading() {
  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center">
      <div className="neo-card bg-neo-white text-center border-3 border-neo-black shadow-neo-lg py-12 px-16">
        <div className="text-7xl mb-6 animate-bounce transition-transform duration-500">🧠</div>
        <p className="font-heading font-black text-2xl tracking-widest text-neo-black animate-pulse">Yükleniyor...</p>
      </div>
    </div>
  );
}
