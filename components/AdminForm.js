"use client";
import { useState, useEffect } from 'react';

export default function AdminForm({ problem, onSave, onCancel }) {
  const isEditing = !!problem;

  const [formData, setFormData] = useState({
    title: '',
    platform: 'leetcode',
    language: 'javascript',
    difficulty: 'medium',
    description: '',
    code: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Düzenleme modundaysa formu doldur
  useEffect(() => {
    if (problem) {
      setFormData({
        title: problem.title || '',
        platform: problem.platform || 'leetcode',
        language: problem.language || 'javascript',
        difficulty: problem.difficulty || 'medium',
        description: problem.description || '',
        code: problem.code || '',
      });
    }
  }, [problem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    // Tab tuşuyla kodu girintileme desteği
    if (e.key === 'Tab' && e.target.name === 'code') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      e.target.value = value.substring(0, start) + '  ' + value.substring(end);
      e.target.selectionStart = e.target.selectionEnd = start + 2;
      
      // State'i de güncelle
      setFormData(prev => ({ ...prev, code: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/problems/${problem.id}` : '/api/problems';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        onSave(); // Üst bileşene haber ver ve formu kapat
      } else {
        setError(data.error || 'Bir hata oluştu');
      }
    } catch (err) {
      setError('İşlem başarısız, sunucuya ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neo-card bg-neo-white">
      <h2 className="text-3xl font-heading font-black mb-6">
        {isEditing ? 'Soru Düzenle' : 'Yeni Soru Ekle'}
      </h2>

      {error && (
        <div className="mb-6 p-4 border-3 border-neo-red bg-red-100 text-neo-red font-heading font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Başlık */}
        <div>
          <label className="block font-body font-bold mb-2">Başlık</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="neo-input"
            placeholder="İki Sayının Toplamı..."
          />
        </div>

        {/* 3'lü Grup (Platform, Dil, Zorluk) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-body font-bold mb-2">Platform</label>
            <select name="platform" value={formData.platform} onChange={handleChange} className="neo-input cursor-pointer">
              <option value="leetcode">LeetCode</option>
              <option value="hackerrank">HackerRank</option>
              <option value="codewars">CodeWars</option>
            </select>
          </div>
          <div>
            <label className="block font-body font-bold mb-2">Dil</label>
            <select name="language" value={formData.language} onChange={handleChange} className="neo-input cursor-pointer">
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="swift">Swift</option>
              <option value="kotlin">Kotlin</option>
              <option value="ruby">Ruby</option>
              <option value="php">PHP</option>
              <option value="c">C</option>
              <option value="sql">SQL</option>
            </select>
          </div>
          <div>
            <label className="block font-body font-bold mb-2">Zorluk</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="neo-input cursor-pointer">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <label className="block font-body font-bold mb-2">Açıklama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="neo-input resize-y"
            placeholder="Sorunun açıklamasını buraya yazın..."
          ></textarea>
        </div>

        {/* Kod */}
        <div>
          <label className="block font-body font-bold mb-2">Çözüm Kodu</label>
          <textarea
            name="code"
            value={formData.code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            required
            rows="10"
            className="neo-input font-mono bg-neo-bg resize-y"
            placeholder="Kodunuzu buraya yapıştırın..."
            spellCheck="false"
          ></textarea>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="neo-btn bg-gray-200 w-full sm:w-auto"
          >
            İptal
          </button>
          
          <button 
            type="submit" 
            disabled={loading}
            className={`neo-btn bg-neo-blue w-full sm:w-auto ml-auto ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Kaydediliyor...' : (isEditing ? 'Değişiklikleri Kaydet' : 'Soruyu Ekle')}
          </button>
        </div>
        
      </form>
    </div>
  );
}
