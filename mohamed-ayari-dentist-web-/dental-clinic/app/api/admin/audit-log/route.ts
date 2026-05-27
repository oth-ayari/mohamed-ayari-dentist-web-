import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return unauthorized();

  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10));
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { adminId: auth.sub },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          action: true,
          details: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
        },
      }),
      prisma.auditLog.count({ where: { adminId: auth.sub } }),
    ]);

    return ok(logs, undefined, {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch {
    return serverError();
  }
}
