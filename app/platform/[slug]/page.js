import { getProblemsByPlatform } from '@/lib/problems';
import FilterBar from '@/components/FilterBar';

// Tüm platformların meta bilgileri
const platformMeta = {
  leetcode: {
    name: 'LeetCode',
    icon: '🏆',
    description: 'Mülakat hazırlığı, Veri Yapıları ve Algoritmalar (DSA) temelleri.',
    color: 'bg-neo-orange',
    textClass: 'text-neo-black'
  },
  hackerrank: {
    name: 'HackerRank',
    icon: '💻',
    description: 'Problem çözme ve spesifik alan bazlı yetenek geliştirme soruları.',
    color: 'bg-neo-green',
    textClass: 'text-neo-black'
  },
  codewars: {
    name: 'CodeWars',
    icon: '⚔️',
    description: 'Kod katası ile dil ustalığı ve yaratıcı problem çözme alışkanlıkları.',
    color: 'bg-neo-purple',
    textClass: 'text-white'
  },
};

export function generateStaticParams() {
  return Object.keys(platformMeta).map((slug) => ({
    slug,
  }));
}

export default async function PlatformPage({ params }) {
  const { slug } = await params;
  
  // Platform kontrolü
  if (!platformMeta[slug]) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="neo-card bg-neo-red text-white text-center p-12">
          <h1 className="text-4xl font-heading font-black mb-4">Platform Bulunamadı</h1>
          <a href="/" className="neo-btn bg-neo-white text-neo-black inline-block mt-4">Ana Sayfaya Dön</a>
        </div>
      </div>
    );
  }

  const meta = platformMeta[slug];
  const problems = getProblemsByPlatform(slug);

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Platform Başlık */}
      <section className={`${meta.color} ${meta.textClass} border-b-3 border-neo-black py-16 px-4`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="text-8xl bg-neo-white w-32 h-32 rounded-full border-3 border-neo-black shadow-neo flex items-center justify-center flex-shrink-0">
            {meta.icon}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">{meta.name}</h1>
            <p className="text-xl font-body font-medium opacity-90 max-w-2xl">{meta.description}</p>
          </div>
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
