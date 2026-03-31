import Link from "next/link";
import { getAllProblems, getStats } from "@/lib/problems";
import PlatformCard from "@/components/PlatformCard";
import ProblemCard from "@/components/ProblemCard";

export default async function Home() {
  const problems = await getAllProblems();
  const stats = await getStats();

  // Son eklenen 6 soruyu al
  const recentProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-neo-yellow border-b-3 border-neo-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 ">
            Algoritma Soruları
            <br />
            ve
            <br /> Çözümleri
          </h1>
          <p className="text-xl font-body max-w-2xl mx-auto mb-10 text-neo-black/80 font-medium">
            Mülakatlara hazırlık sürecindeki LeetCode, HackerRank ve CodeWars
            çözümleri. Kendi çözüm yolculuğumu takip ettiğim kişisel
            veritabanım.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/problems"
              className="neo-btn bg-neo-white w-full sm:w-auto text-center"
            >
              Soruları Keşfet →
            </Link>
            <a
              href="https://www.instagram.com/buildwithmami/"
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn bg-neo-red text-neo-white w-full sm:w-auto text-center"
            >
              Instagram'da Takip Et 📸
            </a>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="py-12 px-4 border-b-3 border-neo-black bg-neo-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform -rotate-1">
            <p className="text-4xl font-heading font-black text-neo-blue">
              {stats.total}
            </p>
            <p className="font-heading font-bold mt-2">Toplam Soru</p>
          </div>
          <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform rotate-1">
            <p className="text-4xl font-heading font-black text-neo-orange">
              {stats.byPlatform.leetcode || 0}
            </p>
            <p className="font-heading font-bold mt-2">LeetCode</p>
          </div>
          <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform -rotate-2">
            <p className="text-4xl font-heading font-black text-neo-green">
              {stats.byPlatform.hackerrank || 0}
            </p>
            <p className="font-heading font-bold mt-2">HackerRank</p>
          </div>
          <div className="p-4 border-3 border-neo-black shadow-neo bg-neo-white transform rotate-2">
            <p className="text-4xl font-heading font-black text-neo-purple">
              {stats.byPlatform.codewars || 0}
            </p>
            <p className="font-heading font-bold mt-2">CodeWars</p>
          </div>
        </div>
      </section>

      {/* Platform Kartları */}
      <section className="py-20 px-4 bg-neo-bg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-heading font-black mb-10 text-center">
            Platformlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PlatformCard
              name="LeetCode"
              icon="🏆"
              count={stats.byPlatform.leetcode || 0}
              languages={["JavaScript"]}
              color="bg-neo-orange"
              slug="leetcode"
            />
            <PlatformCard
              name="HackerRank"
              icon="💻"
              count={stats.byPlatform.hackerrank || 0}
              languages={["C++", "Python"]}
              color="bg-neo-green"
              slug="hackerrank"
            />
            <PlatformCard
              name="CodeWars"
              icon="⚔️"
              count={stats.byPlatform.codewars || 0}
              languages={["SQL"]}
              color="bg-neo-purple text-white"
              slug="codewars"
            />
          </div>
        </div>
      </section>

      {/* Son Eklenenler */}
      <section className="py-20 px-4 border-t-3 border-neo-black bg-neo-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 border-b-3 border-neo-black pb-4">
            <h2 className="text-4xl font-heading font-black">Son Eklenenler</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProblems.map((problem) => (
              <div key={problem.id} className="animate-slide-up">
                <ProblemCard problem={problem} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
