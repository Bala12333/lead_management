import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, property, visitDate, staffName } = body;

    if (!leadId || !property || !visitDate) {
      return NextResponse.json({ error: 'Missing required visit details' }, { status: 400 });
    }

    // Schedule the visit
    const visit = await prisma.visit.create({
      data: {
        leadId,
        property,
        visitDate: new Date(visitDate),
        staffName: staffName || 'Unassigned Staff'
      }
    });

    // Automatically update lead status to Visit Scheduled and add Note
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'Visit Scheduled' }
    });

    await prisma.interaction.create({
      data: {
        leadId,
        type: 'System Note',
        content: `Visit Scheduled for property ${property} on ${new Date(visitDate).toLocaleString()} with ${staffName}`
      }
    });

    return NextResponse.json({ success: true, visit }, { status: 201 });
  } catch (error) {
    console.error('Visit Scheduling Error:', error);
    return NextResponse.json({ error: 'Failed to schedule visit' }, { status: 500 });
  }
}
