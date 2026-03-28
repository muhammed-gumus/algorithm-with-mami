"use client";
import { useState, useEffect } from 'react';
import ProblemCard from './ProblemCard';

export default function FilterBar({ initialProblems }) {
  const [problems, setProblems] = useState(initialProblems);
  const [language, setLanguage] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [search, setSearch] = useState('');

  // Sadece ilgili dilleri topla
  const availableLanguages = ['all', ...Array.from(new Set(initialProblems.map(p => p.language)))];
  const availablePlatforms = ['all', ...Array.from(new Set(initialProblems.map(p => p.platform)))];

  useEffect(() => {
    let filtered = initialProblems;

    if (platform !== 'all') {
      filtered = filtered.filter(p => p.platform === platform);
    }

    if (language !== 'all') {
      filtered = filtered.filter(p => p.language === language);
    }
    
    if (difficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === difficulty);
    }
    
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s)
      );
    }

    setProblems(filtered);
  }, [platform, language, difficulty, search, initialProblems]);

  return (
    <div>
      <div className="neo-card mb-8 bg-neo-bg">
        <h3 className="font-heading font-bold text-xl mb-4">Soruları Filtrele</h3>

        {/* Platform filtreleri */}
        <div className="mb-4">
          <p className="font-body text-sm font-bold mb-2 text-gray-600">Platforma Göre:</p>
          <div className="flex flex-wrap gap-3">
            {availablePlatforms.map(plat => (
              <button
                key={plat}
                onClick={() => setPlatform(plat)}
                className={`neo-badge cursor-pointer transition-colors ${
                  platform === plat
                    ? 'bg-neo-black text-neo-white'
                    : 'bg-neo-white hover:bg-gray-100 text-neo-black'
                }`}
              >
                {plat === 'all' ? 'Tümü' : plat.charAt(0).toUpperCase() + plat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Dil filtreleri */}
        <div className="mb-4">
          <p className="font-body text-sm font-bold mb-2 text-gray-600">Dile Göre:</p>
          <div className="flex flex-wrap gap-3">
            {availableLanguages.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`neo-badge cursor-pointer transition-colors ${
                  language === lang 
                    ? 'bg-neo-black text-neo-white' 
                    : 'bg-neo-white hover:bg-gray-100 text-neo-black'
                }`}
              >
                {lang === 'all' ? 'Tümü' : lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Zorluk filtreleri */}
        <div className="mb-6">
          <p className="font-body text-sm font-bold mb-2 text-gray-600">Zorluğa Göre:</p>
          <div className="flex flex-wrap gap-3">
            {['all', 'easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`neo-badge cursor-pointer transition-colors ${
                  difficulty === diff 
                    ? 'bg-neo-black text-neo-white' 
                    : 'bg-neo-white hover:bg-gray-100 text-neo-black'
                }`}
              >
                {diff === 'all' ? 'Tümü' : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Arama */}
        <div>
          <p className="font-body text-sm font-bold mb-2 text-gray-600">Soru Ara:</p>
          <input
            type="text"
            placeholder="Başlık veya açıklama içinde ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="neo-input"
          />
        </div>
      </div>

      {/* Sonuç Listesi */}
      <div className="mb-6 flex justify-between items-end border-b-3 border-neo-black pb-2">
        <h2 className="text-2xl font-heading font-black">Sorular</h2>
        <span className="font-body font-bold text-gray-600">{problems.length} sonuç</span>
      </div>

      {problems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map(problem => (
            <div key={problem.id} className="animate-slide-up">
              <ProblemCard problem={problem} />
            </div>
          ))}
        </div>
      ) : (
        <div className="neo-card bg-neo-white text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-heading font-bold mb-2">Soru Bulunamadı</h3>
          <p className="font-body text-gray-600">
            Arama kriterlerinize uygun soru bulunamadı. Lütfen filtreleri değiştirin.
          </p>
          <button 
            onClick={() => { setLanguage('all'); setDifficulty('all'); setPlatform('all'); setSearch(''); }}
            className="neo-btn bg-neo-yellow mt-6"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
