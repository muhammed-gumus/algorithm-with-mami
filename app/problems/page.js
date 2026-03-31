import { getAllProblems } from "@/lib/problems";
import FilterBar from "@/components/FilterBar";

export const metadata = {
  title: "Tüm Sorular | Algorithm with Mami",
  description:
    "LeetCode, HackerRank ve CodeWars platformlarından tüm algoritma soruları ve çözümleri.",
};

export default async function AllProblemsPage() {
  const problems = await getAllProblems();

  return (
    <div className="min-h-screen bg-neo-white pb-20">
      {/* Sayfa Başlık */}
      <section className="bg-neo-blue border-b-3 border-neo-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-black mb-4">
            Tüm Sorular
          </h1>
          <p className="text-xl font-body font-medium opacity-90 max-w-2xl mx-auto">
            Tüm platformlardaki algoritma soruları ve çözümleri. Filtreleyerek
            aradığını bul!
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
