import Link from 'next/link';
import Badge from './Badge';

export default function ProblemCard({ problem }) {
  const difficultyColor = {
    easy: 'bg-neo-green',
    medium: 'bg-neo-yellow',
    hard: 'bg-neo-red',
  }[problem.difficulty] || 'bg-gray-200';

  return (
    <Link href={`/problem/${problem.id}`} className="neo-card block hover:scale-[1.01] transition-transform">
      <div className="flex items-center justify-between mb-3">
        <span className={`neo-badge ${difficultyColor}`}>
          {problem.difficulty}
        </span>
        <Badge type={problem.language} />
      </div>
      <h3 className="text-xl font-heading font-bold mb-2 text-neo-black group-hover:text-neo-accent transition-colors">
        {problem.title}
      </h3>
      <p className="text-gray-600 font-body text-sm line-clamp-2">
        {problem.description}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Badge type={problem.platform} />
      </div>
    </Link>
  );
}
