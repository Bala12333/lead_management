import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalLeads = await prisma.lead.count();
    const newLeads = await prisma.lead.count({ where: { status: 'New Lead' } });
    const contacted = await prisma.lead.count({ where: { status: 'Contacted' } });
    const visited = await prisma.lead.count({ where: { status: 'Visit Completed' } });
    const booked = await prisma.lead.count({ where: { status: 'Booked' } });
    const lost = await prisma.lead.count({ where: { status: 'Lost Lead' } });
    
    // SLA Performance
    const slaBreached = await prisma.lead.count({ where: { slaBreached: true } });
    
    // Visits Pipeline
    const visitsScheduled = await prisma.visit.count();
    const visitsBooked = await prisma.visit.count({ where: { outcome: 'Booked' } });

    // Try finding average response time
    const leadsWithResponses = await prisma.lead.findMany({
      where: { firstRespondedAt: { not: null } },
      select: { createdAt: true, firstRespondedAt: true }
    });

    let totalResponseTimeMs = 0;
    leadsWithResponses.forEach((l) => {
      // @ts-ignore
      totalResponseTimeMs += l.firstRespondedAt!.getTime() - l.createdAt.getTime();
    });
    
    let avgResponseMs = leadsWithResponses.length > 0 ? (totalResponseTimeMs / leadsWithResponses.length) : 0;
    const avgResponseMinutes = avgResponseMs > 0 ? Math.round(avgResponseMs / 60000 * 10) / 10 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalLeads,
        pipeline: { newLeads, contacted, visited, booked, lost },
        sla: { slaBreached, avgResponseMinutes },
        visits: { scheduled: visitsScheduled, converted: visitsBooked }
      }
    });
  } catch (error) {
    console.error('Fetch Dashboard Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
