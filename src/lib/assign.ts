import prisma from '@/lib/prisma';

export async function assignLead() {
    // Simple round-robin MVP implementation: Find least busy agent
    let agents = await prisma.user.findMany({
        include: {
            _count: {
                select: { assignedLeads: true }
            }
        },
        orderBy: {
            assignedLeads: {
                _count: 'asc'
            }
        }
    });

    // If no agents exist in the system, create a default one
    if (agents.length === 0) {
        const defaultAgent = await prisma.user.create({
            data: {
                name: 'Default Agent',
                email: 'agent@gharpayy.com'
            }
        });
        return defaultAgent.id;
    }

    // Return the ID of the agent with the least leads
    return agents[0].id;
}
