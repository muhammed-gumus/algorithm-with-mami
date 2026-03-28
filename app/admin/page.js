"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminForm from '@/components/AdminForm';
import Badge from '@/components/Badge';

export default function AdminDashboard() {
  const router = useRouter();
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form durumları
  const [showForm, setShowForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);

  // Verileri getir
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/problems');
      const data = await res.json();
      
      if (data.success) {
        setProblems(data.problems);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auth kontrolü ve ilk veri yükleme
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          fetchProblems();
        }
      } catch (err) {
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Çıkış yap
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Çıkış yapılamadı', err);
    }
  };

  // Soru Sil
  const handleDelete = async (id, title) => {
    if (!confirm(`"${title}" adlı soruyu silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/problems/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        fetchProblems(); // Listeyi yenile
      } else {
        alert('Silme işlemi başarısız: ' + data.error);
      }
    } catch (err) {
      alert('Sunucu hatası oluştu.');
    }
  };

  // Yeni Soru aç
  const openNewForm = () => {
    setEditingProblem(null);
    setShowForm(true);
  };

  // Düzenleme aç
  const openEditForm = (problem) => {
    setEditingProblem(problem);
    setShowForm(true);
  };

  // Formdan Kaydet işlemi sonrası
  const handleSaveProblem = () => {
    setShowForm(false);
    setEditingProblem(null);
    fetchProblems();
  };

  // Form Kapat
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProblem(null);
  };

  if (loading && problems.length === 0) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center">
        <div className="text-3xl font-heading font-black animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-bg">
      {/* Admin Navbar */}
      <header className="bg-neo-black text-neo-white py-4 px-6 border-b-3 border-neo-black flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-heading font-black text-2xl hover:text-neo-accent transition-colors">
            AW/M
          </Link>
          <span className="font-body opacity-50 px-2">|</span>
          <h1 className="font-heading font-black text-xl text-neo-yellow">Admin Panel</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-neo-white text-neo-black font-body font-bold px-4 py-2 border-2 border-neo-white hover:bg-neo-accent hover:text-white hover:border-neo-black transition-colors"
        >
          Çıkış Yap
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* İstatistikler */}
        {!showForm && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="neo-card bg-neo-white text-center p-4">
              <p className="text-3xl font-heading font-black text-neo-blue mb-1">{stats.total}</p>
              <p className="font-body text-sm font-bold text-gray-500">Toplam Soru</p>
            </div>
            <div className="neo-card bg-neo-white text-center p-4">
              <p className="text-3xl font-heading font-black text-neo-orange mb-1">{stats.byPlatform.leetcode || 0}</p>
              <p className="font-body text-sm font-bold text-gray-500">LeetCode</p>
            </div>
            <div className="neo-card bg-neo-white text-center p-4">
              <p className="text-3xl font-heading font-black text-neo-green mb-1">{stats.byPlatform.hackerrank || 0}</p>
              <p className="font-body text-sm font-bold text-gray-500">HackerRank</p>
            </div>
            <div className="neo-card bg-neo-white text-center p-4">
              <p className="text-3xl font-heading font-black text-neo-purple mb-1">{stats.byPlatform.codewars || 0}</p>
              <p className="font-body text-sm font-bold text-gray-500">CodeWars</p>
            </div>
          </div>
        )}

        {/* Form Alanı */}
        {showForm ? (
          <div className="mb-8">
            <AdminForm 
              problem={editingProblem} 
              onSave={handleSaveProblem} 
              onCancel={handleCancelForm} 
            />
          </div>
        ) : (
          <div className="neo-card bg-neo-white overflow-hidden p-0">
            {/* Tablo Üst Kısım */}
            <div className="p-6 border-b-3 border-neo-black flex items-center justify-between flex-wrap gap-4 bg-neo-yellow/20">
              <h2 className="text-2xl font-heading font-black">Sorular Yönetimi</h2>
              <button 
                onClick={openNewForm}
                className="neo-btn bg-neo-green text-neo-black text-sm px-4 py-2"
              >
                + Yeni Soru Ekle
              </button>
            </div>

            {/* Tablo Alanı */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neo-black text-neo-white font-heading text-sm uppercase tracking-wider">
                    <th className="p-4 py-3 min-w-[250px]">Başlık</th>
                    <th className="p-4 py-3 w-32 hidden md:table-cell">Platform</th>
                    <th className="p-4 py-3 w-32 hidden sm:table-cell">Dil</th>
                    <th className="p-4 py-3 w-32 hidden lg:table-cell">Zorluk</th>
                    <th className="p-4 py-3 w-40 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="font-body text-sm divide-y-2 divide-neo-black">
                  {[...problems].reverse().map(problem => (
                    <tr key={problem.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold max-w-xs truncate">
                        <Link href={`/problem/${problem.id}`} target="_blank" className="hover:text-neo-accent hover:underline">
                          {problem.title}
                        </Link>
                      </td>
                      <td className="p-4 hidden md:table-cell capitalize font-bold opacity-80">
                        {problem.platform}
                      </td>
                      <td className="p-4 hidden sm:table-cell capitalize font-bold">
                        {problem.language}
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <Badge type={problem.difficulty} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEditForm(problem)}
                            className="px-2 py-1 bg-neo-blue border-2 border-neo-black text-xs font-bold hover:bg-neo-yellow transition-colors"
                          >
                            Düzenle
                          </button>
                          <button 
                            onClick={() => handleDelete(problem.id, problem.title)}
                            className="px-2 py-1 bg-neo-red border-2 border-neo-black text-neo-white text-xs font-bold hover:bg-red-600 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {problems.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500 font-bold">
                        Henüz hiç soru eklenmemiş.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
