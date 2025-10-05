import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || '');
    const month = parseInt(searchParams.get('month') || '');

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Valid year and month parameters are required' },
        { status: 400 }
      );
    }

    // Calculate date range for the month using UTC to avoid timezone issues
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0)); // Last day of the month

    const earnings = await prisma.dailyEarning.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      }
    });

    // Transform data into the format expected by the frontend
    const monthlyData: { [categoryId: number]: { [day: number]: number } } = {};

    earnings.forEach((earning) => {
      const day = earning.date.getUTCDate(); // Use UTC date to avoid timezone issues
      const categoryId = earning.categoryId;
      
      if (!monthlyData[categoryId]) {
        monthlyData[categoryId] = {};
      }
      
      monthlyData[categoryId][day] = earning.amount;
    });

    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly earnings' },
      { status: 500 }
    );
  }
}
