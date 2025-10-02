import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const earnings = await prisma.dailyEarning.findMany({
      where: {
        date: new Date(date)
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(earnings);
  } catch (error) {
    console.error('Error fetching daily earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily earnings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, earnings } = body;

    if (!date || !earnings || !Array.isArray(earnings)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Delete existing earnings for this date
    await prisma.dailyEarning.deleteMany({
      where: {
        date: new Date(date)
      }
    });

    // Create new earnings
    const earningsData = earnings
      .filter((earning: any) => earning.amount > 0)
      .map((earning: any) => ({
        date: new Date(date),
        amount: earning.amount,
        categoryId: earning.categoryId
      }));

    if (earningsData.length > 0) {
      await prisma.dailyEarning.createMany({
        data: earningsData
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving daily earnings:', error);
    return NextResponse.json(
      { error: 'Failed to save daily earnings' },
      { status: 500 }
    );
  }
}
