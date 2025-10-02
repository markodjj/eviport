import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || '');

    if (!year) {
      return NextResponse.json(
        { error: 'Year parameter is required' },
        { status: 400 }
      );
    }

    // Calculate date range for the year
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31); // December 31st

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

    // Group earnings by category and month
    const yearlyData: { [categoryId: number]: Array<{
      month: number;
      monthName: string;
      totalEarnings: number;
      averageEarnings: number;
      daysWithEarnings: number;
      weeklyPatterns: { [dayOfWeek: number]: { count: number; total: number; average: number } };
    }> } = {};

    earnings.forEach((earning) => {
      const categoryId = earning.categoryId;
      const month = earning.date.getMonth();
      
      if (!yearlyData[categoryId]) {
        yearlyData[categoryId] = Array.from({ length: 12 }, (_, i) => ({
          month: i,
          monthName: getMonthName(i),
          totalEarnings: 0,
          averageEarnings: 0,
          daysWithEarnings: 0,
          weeklyPatterns: {}
        }));
      }

      // Update monthly totals
      yearlyData[categoryId][month].totalEarnings += earning.amount;
      yearlyData[categoryId][month].daysWithEarnings += 1;

      // Update weekly patterns
      const dayOfWeek = (earning.date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      if (!yearlyData[categoryId][month].weeklyPatterns[dayOfWeek]) {
        yearlyData[categoryId][month].weeklyPatterns[dayOfWeek] = {
          count: 0,
          total: 0,
          average: 0
        };
      }
      yearlyData[categoryId][month].weeklyPatterns[dayOfWeek].count += 1;
      yearlyData[categoryId][month].weeklyPatterns[dayOfWeek].total += earning.amount;
    });

    // Calculate averages for each month and weekly patterns
    Object.keys(yearlyData).forEach(categoryId => {
      const categoryData = yearlyData[parseInt(categoryId)];
      categoryData.forEach(month => {
        if (month.daysWithEarnings > 0) {
          month.averageEarnings = month.totalEarnings / month.daysWithEarnings;
        }

        // Calculate weekly pattern averages
        Object.keys(month.weeklyPatterns).forEach(dayOfWeek => {
          const dayStats = month.weeklyPatterns[parseInt(dayOfWeek)];
          if (dayStats.count > 0) {
            dayStats.average = dayStats.total / dayStats.count;
          }
        });
      });
    });

    return NextResponse.json(yearlyData);
  } catch (error) {
    console.error('Error fetching yearly earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch yearly earnings' },
      { status: 500 }
    );
  }
}

function getMonthName(monthIndex: number): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[monthIndex];
}

