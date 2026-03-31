import Link from "next/link";
import { notFound } from "next/navigation";
import { getProblemById, getAllProblems } from "@/lib/problems";
import Badge from "@/components/Badge";
import CodeBlock from "@/components/CodeBlock";

export async function generateStaticParams() {
  const problems = await getAllProblems();
  return problems.map((problem) => ({
    id: problem.id,
  }));
}

export default async function ProblemPage({ params }) {
  const { id } = await params;
  const problem = await getProblemById(id);

  if (!problem) {
    return notFound();
  }

  // Önceki / Sonraki soru tespiti
  const problems = await getAllProblems();
  const currentIndex = problems.findIndex((p) => p.id === id);
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-neo-bg py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex text-sm font-body font-bold text-gray-600 mb-8 items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-neo-accent hover:underline">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link
            href={`/platform/${problem.platform}`}
            className="hover:text-neo-accent hover:underline uppercase"
          >
            {problem.platform}
          </Link>
          <span>/</span>
          <span className="text-neo-black px-2 py-0.5 border-2 border-neo-black bg-neo-yellow line-clamp-1 flex-1 min-w-[200px]">
            {problem.title}
          </span>
        </nav>

        {/* İçerik Kartı */}
        <article className="neo-card bg-neo-white mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-3 border-neo-black pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge type={problem.difficulty} />
              <Badge type={problem.platform} />
              <Badge type={problem.language} />
            </div>

            {problem.url && (
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn bg-neo-accent text-neo-black text-sm font-bold py-2 px-4 flex items-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                Soruyu Platformda Gör
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-black mb-8 leading-tight">
            {problem.title}
          </h1>

          <div className="prose prose-lg max-w-none font-body mb-10 text-neo-black whitespace-pre-wrap">
            {/* API'den gelen çok satırlı açıklamayı render ediyoruz */}
            {problem.description}
          </div>

          <h2 className="text-2xl font-heading font-black mb-4">
            Çözüm (<span className="uppercase">{problem.language}</span>)
          </h2>

          <CodeBlock code={problem.code} language={problem.language} />
        </article>

        {/* Alt Navigasyon */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12">
          {prevProblem ? (
            <Link
              href={`/problem/${prevProblem.id}`}
              className="neo-btn bg-neo-white flex flex-col items-start w-full sm:w-1/2 group"
            >
              <span className="text-sm text-gray-500 font-body">
                ← Önceki Soru
              </span>
              <span className="text-lg text-left line-clamp-1 group-hover:text-neo-accent transition-colors">
                {prevProblem.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2"></div>
          )}

          {nextProblem ? (
            <Link
              href={`/problem/${nextProblem.id}`}
              className="neo-btn bg-neo-white flex flex-col items-end w-full sm:w-1/2 group text-right"
            >
              <span className="text-sm text-gray-500 font-body">
                Sonraki Soru →
              </span>
              <span className="text-lg line-clamp-1 group-hover:text-neo-accent transition-colors">
                {nextProblem.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2"></div>
          )}
        </div>
      </div>
    </div>
  );
}
