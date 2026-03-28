import Link from 'next/link';

export default function PlatformCard({ name, icon, count, languages, color, slug }) {
  return (
    <Link 
      href={`/platform/${slug}`}
      className={`neo-card ${color} block group`}
    >
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <h3 className="text-2xl font-heading font-bold mb-2">{name}</h3>
      <div className="flex items-end gap-2 mb-4">
        <p className="text-4xl font-heading font-black leading-none">{count}</p>
        <p className="font-body font-bold text-sm mb-1 opacity-80">soru</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {languages.map(lang => (
          <span key={lang} className="neo-badge bg-neo-white text-neo-black">
            {lang}
          </span>
        ))}
      </div>
    </Link>
  );
}
