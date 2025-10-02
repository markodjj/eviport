'use client';

import { useState, useEffect } from 'react';
import { Container, Section, Typography, useToast } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Category {
  id: number;
  name: string;
}

interface MonthlyStats {
  month: number;
  monthName: string;
  totalEarnings: number;
  averageEarnings: number;
  daysWithEarnings: number;
  weeklyPatterns: {
    [dayOfWeek: number]: {
      count: number;
      total: number;
      average: number;
    };
  };
}

interface YearlyData {
  [categoryId: number]: MonthlyStats[];
}

export default function YearlyEarningsPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyData>({});
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchYearlyData();
  }, [currentYear]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchYearlyData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/yearly-earnings?year=${currentYear}`);
      
      if (response.ok) {
        const data = await response.json();
        setYearlyData(data);
      }
    } catch (error) {
      console.error('Error fetching yearly data:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load yearly data. Please try again.',
        type: 'error',
        duration: 6000
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const getCategoryYearlyStats = (categoryId: number) => {
    const monthlyStats = yearlyData[categoryId] || [];
    const totalYearlyEarnings = monthlyStats.reduce((sum, month) => sum + month.totalEarnings, 0);
    const totalDaysWithEarnings = monthlyStats.reduce((sum, month) => sum + month.daysWithEarnings, 0);
    const yearlyAverage = totalDaysWithEarnings > 0 ? totalYearlyEarnings / totalDaysWithEarnings : 0;
    
    return {
      totalYearlyEarnings,
      yearlyAverage,
      totalDaysWithEarnings,
      monthsWithData: monthlyStats.filter(month => month.totalEarnings > 0).length
    };
  };

  const getBestWorstMonths = (categoryId: number) => {
    const monthlyStats = yearlyData[categoryId] || [];
    const monthsWithData = monthlyStats.filter(month => month.totalEarnings > 0);
    
    if (monthsWithData.length === 0) return { best: null, worst: null };
    
    const sorted = [...monthsWithData].sort((a, b) => b.totalEarnings - a.totalEarnings);
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
      <Section padding="xl">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <Typography variant="h1" className="mb-4">
                Yearly Earnings
              </Typography>
              <Typography variant="p" className="text-gray-600 dark:text-gray-300 mb-6">
                Comprehensive statistics and analysis by category
              </Typography>
              
              {/* Year Navigation */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button
                  onClick={() => navigateYear('prev')}
                  variant="outline"
                  className="px-4 py-2"
                >
                  ← Previous Year
                </Button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {currentYear}
                </h2>
                <Button
                  onClick={() => navigateYear('next')}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Next Year →
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <Typography variant="p">Loading yearly data...</Typography>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => {
                  const monthlyStats = yearlyData[category.id] || [];
                  const yearlyStats = getCategoryYearlyStats(category.id);
                  const bestWorst = getBestWorstMonths(category.id);
                  
                  return (
                    <Card key={category.id} className="p-6">
                      <div className="mb-6">
                        <Typography variant="h3" className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          {category.name}
                        </Typography>
                        
                        {/* Yearly Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {formatAmount(yearlyStats.totalYearlyEarnings)}
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Average per Day</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {formatAmount(Math.round(yearlyStats.yearlyAverage))}
                            </div>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Days with Earnings</div>
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {yearlyStats.totalDaysWithEarnings}
                            </div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 dark:text-gray-400">Active Months</div>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {yearlyStats.monthsWithData}
                            </div>
                          </div>
                        </div>

                        {/* Best/Worst Months */}
                        {bestWorst.best && bestWorst.worst && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Best Month</div>
                              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                {bestWorst.best.monthName}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatAmount(bestWorst.best.totalEarnings)} ({bestWorst.best.daysWithEarnings} days)
                              </div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 dark:text-gray-400">Worst Month</div>
                              <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                                {bestWorst.worst.monthName}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatAmount(bestWorst.worst.totalEarnings)} ({bestWorst.worst.daysWithEarnings} days)
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Monthly Breakdown */}
                      <div className="mb-6">
                        <Typography variant="h4" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Monthly Breakdown
                        </Typography>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold text-gray-800 dark:text-gray-200">
                                  Month
                                </th>
                                <th className="border border-gray-300 dark:border-gray-600 p-3 text-center font-semibold text-gray-800 dark:text-gray-200">
                                  Total Earnings
                                </th>
                                <th className="border border-gray-300 dark:border-gray-600 p-3 text-center font-semibold text-gray-800 dark:text-gray-200">
                                  Average per Day
                                </th>
                                <th className="border border-gray-300 dark:border-gray-600 p-3 text-center font-semibold text-gray-800 dark:text-gray-200">
                                  Days with Earnings
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthlyStats.map((month) => (
                                <tr key={month.month} className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium text-gray-800 dark:text-gray-200">
                                    {month.monthName}
                                  </td>
                                  <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-gray-800 dark:text-gray-200">
                                    {formatAmount(month.totalEarnings)}
                                  </td>
                                  <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-gray-800 dark:text-gray-200">
                                    {month.averageEarnings > 0 ? formatAmount(Math.round(month.averageEarnings)) : '-'}
                                  </td>
                                  <td className="border border-gray-300 dark:border-gray-600 p-3 text-center text-gray-800 dark:text-gray-200">
                                    {month.daysWithEarnings}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Weekly Patterns */}
                      <div>
                        <Typography variant="h4" className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Weekly Patterns by Month
                        </Typography>
                        <div className="space-y-4">
                          {monthlyStats.filter(month => month.totalEarnings > 0).map((month) => (
                            <div key={month.month} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-gray-800 dark:text-gray-200">
                                  {month.monthName}
                                </h5>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  Total: {formatAmount(month.totalEarnings)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                                {dayNames.map((dayName, dayIndex) => {
                                  const dayStats = month.weeklyPatterns[dayIndex];
                                  return (
                                    <div key={dayIndex} className="text-center p-2 bg-white dark:bg-gray-700 rounded">
                                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {dayName.substring(0, 3)}
                                      </div>
                                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {dayStats ? formatAmount(dayStats.total) : '0'}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-500">
                                        {dayStats ? `${dayStats.count} days` : '0 days'}
                                      </div>
                                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                        Avg: {dayStats ? formatAmount(Math.round(dayStats.average)) : '0'}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
