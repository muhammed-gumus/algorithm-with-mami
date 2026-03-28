import { getAllProblems, addProblem, getStats } from '@/lib/problems';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    let problems = getAllProblems();
    const stats = getStats();

    // Filtreleme
    if (platform && platform !== 'all') {
      problems = problems.filter(p => p.platform === platform);
    }
    if (language && language !== 'all') {
      problems = problems.filter(p => p.language === language);
    }
    if (difficulty && difficulty !== 'all') {
      problems = problems.filter(p => p.difficulty === difficulty);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      problems = problems.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return Response.json({ success: true, problems, stats });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Auth kontrolü
    const authorized = await isAuthenticated(request);
    if (!authorized) {
      return Response.json({ success: false, error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    
    // Gerekli alanların kontrolü
    if (!body.title || !body.platform || !body.language) {
      return Response.json({ success: false, error: 'Eksik bilgi: Başlık, Platform ve Dil zorunludur.' }, { status: 400 });
    }

    const newProblem = addProblem(body);

    if (newProblem) {
      return Response.json({ success: true, problem: newProblem }, { status: 201 });
    } else {
      return Response.json({ success: false, error: 'Soru eklenirken bir hata oluştu' }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
