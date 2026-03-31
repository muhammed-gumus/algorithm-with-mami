import { getProblemById, updateProblem, deleteProblem } from "@/lib/problems";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const problem = await getProblemById(id);

    if (problem) {
      return Response.json({ success: true, problem });
    } else {
      return Response.json(
        { success: false, error: "Soru bulunamadı" },
        { status: 404 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authorized = await isAuthenticated(request);
    if (!authorized) {
      return Response.json(
        { success: false, error: "Yetkisiz erişim" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const updatedProblem = await updateProblem(id, body);

    if (updatedProblem) {
      return Response.json({ success: true, problem: updatedProblem });
    } else {
      return Response.json(
        { success: false, error: "Soru bulunamadı veya güncellenemedi" },
        { status: 404 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authorized = await isAuthenticated(request);
    if (!authorized) {
      return Response.json(
        { success: false, error: "Yetkisiz erişim" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const success = await deleteProblem(id);

    if (success) {
      return Response.json({ success: true });
    } else {
      return Response.json(
        { success: false, error: "Soru bulunamadı veya silinemedi" },
        { status: 404 },
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
