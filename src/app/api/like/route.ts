import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return Response.json({ error: 'Moment ID required' }, { status: 400 });
    }

    // Increment likes count
    await prisma.moment.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error liking moment:', error);
    return Response.json({ error: 'Failed to like moment' }, { status: 500 });
  }
} 