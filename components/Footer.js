import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-3 border-neo-black bg-neo-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sol: Logo ve açıklama */}
          <div>
            <h3 className="text-2xl font-heading font-black mb-4">
              Algorithm with Mami <span className="text-xl">🧠</span>
            </h3>
            <p className="text-gray-400 font-body">
              Mülakat sürecindeki problem çözme maceram. LeetCode, HackerRank ve CodeWars'tan özenle seçilmiş sorular ve çözümleri.
            </p>
          </div>

          {/* Orta: Platformlar */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-4 text-neo-yellow">Platformlar</h4>
            <ul className="space-y-2 text-gray-400 font-body font-bold">
              <li><Link href="/platform/leetcode" className="hover:text-neo-orange transition-colors">🏆 LeetCode</Link></li>
              <li><Link href="/platform/hackerrank" className="hover:text-neo-green transition-colors">💻 HackerRank</Link></li>
              <li><Link href="/platform/codewars" className="hover:text-neo-purple transition-colors">⚔️ CodeWars</Link></li>
            </ul>
          </div>

          {/* Sağ: Sosyal medya */}
          <div>
            <h4 className="font-heading font-bold text-xl mb-4 text-neo-accent">Tasarlayan & Geliştiren</h4>
            <a href="https://www.instagram.com/buildwithmami/"
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-body font-bold group">
              <span className="group-hover:scale-110 transition-transform">📸</span> @buildwithmami
            </a>
          </div>
        </div>

        <div className="border-t-2 border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm font-body font-bold text-center sm:text-left">
          <p>© {new Date().getFullYear()} Algorithm with Mami. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
