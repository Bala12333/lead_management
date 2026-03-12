import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { assignLead } from '@/lib/assign';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, source } = body;

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        }

        // Determine Owner via assignment logic
        const ownerId = await assignLead();

        // Create the lead
        const lead = await prisma.lead.create({
            data: {
                name,
                phone,
                source: source || 'Direct',
                status: 'New Lead',
                ownerId,
            }
        });

        // Log the interaction automatically
        await prisma.interaction.create({
            data: {
                leadId: lead.id,
                type: 'System Note',
                content: `Lead captured from ${lead.source} and auto-assigned.`
            }
        });

        // Note: In a production system, here we would trigger an async job 
        // to verify the SLA (check if firstRespondedAt is null in 5 minutes).

        return NextResponse.json({ success: true, lead }, { status: 201 });
    } catch (error) {
        console.error('Capture Error:', error);
        return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
    }
}
