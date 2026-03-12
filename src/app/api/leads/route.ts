import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');

    const where: any = {};
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;

    const leads = await prisma.lead.findMany({
      where,
      include: {
        owner: { select: { name: true } },
        _count: { select: { interactions: true, visits: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('Fetch Leads Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
