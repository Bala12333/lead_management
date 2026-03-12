import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to extract params correctly in Next.js 15
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, email: true } },
        interactions: { orderBy: { createdAt: 'desc' } },
        visits: { orderBy: { visitDate: 'desc' } },
        followUps: { orderBy: { remindAt: 'asc' } }
      }
    });

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status, ownerId, addNote } = body;

    const currentLead = await prisma.lead.findUnique({ where: { id } });
    if (!currentLead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    const updateData: any = {};
    
    // Changing status
    if (status && currentLead.status !== status) {
      updateData.status = status;
      
      // SLA Fulfillment: If moving from New Lead forward, and no first response was logged
      if (currentLead.status === 'New Lead' && !currentLead.firstRespondedAt) {
        updateData.firstRespondedAt = new Date();
        
        // Check if breached (5 minutes = 300,000 ms)
        const timeSinceCreation = new Date().getTime() - currentLead.createdAt.getTime();
        if (timeSinceCreation > 300000) {
          updateData.slaBreached = true;
        }
      }
      
      await prisma.interaction.create({
        data: {
          leadId: id,
          type: 'System Note',
          content: `Lead status changed from ${currentLead.status} to ${status}`
        }
      });
    }

    // Changing Owner
    if (ownerId && currentLead.ownerId !== ownerId) {
      updateData.ownerId = ownerId;
      await prisma.interaction.create({
        data: {
          leadId: id,
          type: 'System Note',
          content: `Lead reassigned to new owner`
        }
      });
    }

    // Adding manual interaction note
    if (addNote) {
      await prisma.interaction.create({
        data: {
          leadId: id,
          type: 'User Note',
          content: addNote
        }
      });
      // A manual note also counts as SLA fulfillment if not responded to
      if (!currentLead.firstRespondedAt) {
        updateData.firstRespondedAt = new Date();
        if (new Date().getTime() - currentLead.createdAt.getTime() > 300000) {
          updateData.slaBreached = true;
        }
      }
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
