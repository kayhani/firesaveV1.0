import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma'dan veritabanı bağlantısını sağlayın.

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const recipientInstId = searchParams.get('recipientInstId');
    const creatorInstId = searchParams.get('creatorInstId');

    try {
        const offers = await prisma.offerCards.findMany({
            where: {
                OR: [
                    { recipientInsId: Number(recipientInstId) },
                    { creatorInsId: Number(creatorInstId) },
                ],
            },
        });
        return NextResponse.json(offers);
    } catch (error) {
        return NextResponse.json({ error: 'Veri getirilemedi.' }, { status: 500 });
    }
}