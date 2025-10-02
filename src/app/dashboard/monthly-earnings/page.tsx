'use client';

import { useState, useEffect } from 'react';
import { Container, Section, Typography, useToast } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Category {
  id: number;
  name: string;
}

interface DailyEarning {
  id: number;
  date: string;
  amount: number;
  categoryId: number;
}

interface MonthlyData {
  [categoryId: number]: {
    [day: number]: number;
  };
}

export default function MonthlyEarningsPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    categoryId: number;
    categoryName: string;
    day: number;
    amount: number;
  }>({
    isOpen: false,
    categoryId: 0,
    categoryName: '',
    day: 0,
    amount: 0
  });
  const [editAmount, setEditAmount] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMonthlyData();
  }, [currentDate]);

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

  const fetchMonthlyData = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await fetch(`/api/monthly-earnings?year=${year}&month=${month}`);
      
      if (response.ok) {
        const data = await response.json();
        setMonthlyData(data);
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getWeekRanges = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const weeks = [];
    let currentWeekStart = 1;
    
    for (let week = 0; week < 6; week++) {
      const weekStart = currentWeekStart;
      const weekEnd = Math.min(weekStart + 6 - startingDayOfWeek, lastDay.getDate());
      
      if (weekStart <= lastDay.getDate()) {
        weeks.push(`${weekStart}-${weekEnd}`);
        currentWeekStart = weekEnd + 1;
      }
    }
    
    return weeks;
  };

  const calculateWeeklyStats = (weekDays: (number | null)[], categoryId: number) => {
    const validDays = weekDays.filter(day => day !== null) as number[];
    const earnings = validDays.map(day => monthlyData[categoryId]?.[day] || 0);
    const sum = earnings.reduce((total, amount) => total + amount, 0);
    const average = validDays.length > 0 ? sum / validDays.length : 0;
    
    return { sum, average };
  };

  const calculateDailyStats = (categoryId: number) => {
    const dailyStats = {
      average: [0, 0, 0, 0, 0, 0, 0], // Mon-Sun
      sum: [0, 0, 0, 0, 0, 0, 0] // Mon-Sun
    };

    // Group earnings by day of week (0=Monday, 6=Sunday)
    const earningsByDayOfWeek: { [dayOfWeek: number]: number[] } = {};
    
    // Initialize arrays for each day of week
    for (let i = 0; i < 7; i++) {
      earningsByDayOfWeek[i] = [];
    }

    // Collect earnings for each day of the month
    for (let day = 1; day <= 31; day++) {
      const amount = monthlyData[categoryId]?.[day] || 0;
      if (amount > 0) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayOfWeek = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        earningsByDayOfWeek[dayOfWeek].push(amount);
      }
    }

    // Calculate average and sum for each day of week
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const earnings = earningsByDayOfWeek[dayOfWeek];
      if (earnings.length > 0) {
        dailyStats.sum[dayOfWeek] = earnings.reduce((total, amount) => total + amount, 0);
        dailyStats.average[dayOfWeek] = dailyStats.sum[dayOfWeek] / earnings.length;
      }
    }

    return dailyStats;
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const openEditModal = (categoryId: number, categoryName: string, day: number, currentAmount: number) => {
    setEditModal({
      isOpen: true,
      categoryId,
      categoryName,
      day,
      amount: currentAmount
    });
    setEditAmount(currentAmount);
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      categoryId: 0,
      categoryName: '',
      day: 0,
      amount: 0
    });
    setEditAmount(0);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), editModal.day);
      const dateString = date.toISOString().split('T')[0];
      
      const response = await fetch('/api/daily-earnings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString,
          earnings: [{
            categoryId: editModal.categoryId,
            amount: editAmount
          }]
        }),
      });

      if (response.ok) {
        // Update local state
        setMonthlyData(prev => ({
          ...prev,
          [editModal.categoryId]: {
            ...prev[editModal.categoryId],
            [editModal.day]: editAmount
          }
        }));
        addToast({
          title: 'Success!',
          description: 'Earnings edited successfully!',
          type: 'success',
          duration: 4000
        });
        closeEditModal();
      } else {
        addToast({
          title: 'Error',
          description: 'Failed to save earnings. Please try again.',
          type: 'error',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error saving earnings:', error);
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        type: 'error',
        duration: 6000
      });
    } finally {
      setSaving(false);
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekRanges = getWeekRanges(currentDate);
  const weeks: (number | null)[][] = [];
  
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
      <Section padding="xl">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <Typography variant="h1" className="mb-4">
                Monthly Earnings
              </Typography>
              <Typography variant="p" className="text-gray-600 dark:text-gray-300 mb-6">
                Calendar view of earnings by category
              </Typography>
              
              {/* Month Navigation */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button
                  onClick={() => navigateMonth('prev')}
                  variant="outline"
                  className="px-4 py-2"
                >
                  ← Previous
                </Button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button
                  onClick={() => navigateMonth('next')}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Next →
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <Typography variant="p">Loading monthly data...</Typography>
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => (
                  <Card key={category.id} className="p-6">
                    <div className="mb-4">
                      <Typography variant="h3" className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {category.name}
                      </Typography>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                        {/* Header */}
                        <thead>
                          <tr className="bg-green-100 dark:bg-green-900">
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-center font-semibold text-gray-800 dark:text-gray-200 bg-yellow-200 dark:bg-yellow-800">
                              {monthNames[currentDate.getMonth()].substring(0, 3).toUpperCase()}
                            </th>
                            {dayNames.map((day) => (
                              <th key={day} className="border border-gray-300 dark:border-gray-600 p-2 text-center font-semibold text-gray-800 dark:text-gray-200">
                                {day}
                              </th>
                            ))}
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-center font-semibold text-gray-800 dark:text-gray-200 bg-orange-200 dark:bg-orange-800">
                              AVG(nedeljni)
                            </th>
                            <th className="border border-gray-300 dark:border-gray-600 p-2 text-center font-semibold text-gray-800 dark:text-gray-200 bg-purple-200 dark:bg-purple-800">
                              SUM(nedeljni)
                            </th>
                          </tr>
                        </thead>
                        
                        {/* Body */}
                        <tbody>
                          {weeks.map((week, weekIndex) => {
                            const weeklyStats = calculateWeeklyStats(week, category.id);
                            return (
                              <tr key={weekIndex} className={weekIndex % 2 === 0 ? 'bg-blue-50 dark:bg-blue-900' : 'bg-blue-100 dark:bg-blue-800'}>
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center font-medium text-gray-700 dark:text-gray-300">
                                  {weekRanges[weekIndex] || ''}
                                </td>
                                 {week.map((day: number | null, dayIndex: number) => (
                                   <td key={dayIndex} className="border border-gray-300 dark:border-gray-600 p-2 text-center">
                                     {day ? (
                                       <div className="space-y-1">
                                         <div className="text-sm text-gray-600 dark:text-gray-400">
                                           {day}.{String(currentDate.getMonth() + 1).padStart(2, '0')}
                                         </div>
                                         <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                           {monthlyData[category.id]?.[day] ? formatAmount(monthlyData[category.id][day]) : '-'}
                                         </div>
                                         <button
                                           onClick={() => openEditModal(
                                             category.id, 
                                             category.name, 
                                             day, 
                                             monthlyData[category.id]?.[day] || 0
                                           )}
                                           className="mt-1 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors"
                                           title="Edit earnings"
                                         >
                                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                           </svg>
                                         </button>
                                       </div>
                                     ) : (
                                       <div className="h-12"></div>
                                     )}
                                   </td>
                                 ))}
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-orange-100 dark:bg-orange-900">
                                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {weeklyStats.average > 0 ? formatAmount(Math.round(weeklyStats.average)) : '-'}
                                  </div>
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-purple-100 dark:bg-purple-900">
                                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {weeklyStats.sum > 0 ? formatAmount(weeklyStats.sum) : '-'}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          
                          {/* Daily Average Row */}
                          {(() => {
                            const dailyStats = calculateDailyStats(category.id);
                            return (
                              <tr className="bg-orange-50 dark:bg-orange-900">
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center font-medium text-gray-800 dark:text-gray-200 bg-orange-200 dark:bg-orange-800">
                                  AVG (Dan)
                                </td>
                                {dayNames.map((_, dayIndex) => (
                                  <td key={dayIndex} className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-orange-100 dark:bg-orange-900">
                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {dailyStats.average[dayIndex] > 0 ? formatAmount(Math.round(dailyStats.average[dayIndex])) : '-'}
                                    </div>
                                  </td>
                                ))}
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-orange-200 dark:bg-orange-800">
                                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    -
                                  </div>
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-orange-200 dark:bg-orange-800">
                                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    -
                                  </div>
                                </td>
                              </tr>
                            );
                          })()}
                          
                          {/* Daily Sum Row */}
                          {(() => {
                            const dailyStats = calculateDailyStats(category.id);
                            return (
                              <tr className="bg-purple-50 dark:bg-purple-900">
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center font-medium text-gray-800 dark:text-gray-200 bg-purple-200 dark:bg-purple-800">
                                  SUM (Dan)
                                </td>
                                {dayNames.map((_, dayIndex) => (
                                  <td key={dayIndex} className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-purple-100 dark:bg-purple-900">
                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {dailyStats.sum[dayIndex] > 0 ? formatAmount(dailyStats.sum[dayIndex]) : '-'}
                                    </div>
                                  </td>
                                ))}
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-purple-200 dark:bg-purple-800">
                                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    -
                                  </div>
                                </td>
                                <td className="border border-gray-300 dark:border-gray-600 p-2 text-center bg-purple-200 dark:bg-purple-800">
                                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    -
                                  </div>
                                </td>
                              </tr>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ))}
              </div>
            )}
           </div>
         </Container>
       </Section>

       {/* Edit Modal */}
       {editModal.isOpen && (
         <div className="fixed inset-0 backdrop-blur-sm bg-white/10 dark:bg-black/10 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
               Edit Earnings
             </h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Category: {editModal.categoryName}
                 </label>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Date: {editModal.day}.{String(currentDate.getMonth() + 1).padStart(2, '0')}.{currentDate.getFullYear()}
                 </label>
               </div>
               
               <div>
                 <label htmlFor="editAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Amount:
                 </label>
                 <Input
                   id="editAmount"
                   type="number"
                   step="0.01"
                   min="0"
                   value={editAmount}
                   onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                   placeholder="0.00"
                 />
               </div>
             </div>
             
             <div className="flex justify-end gap-3 mt-6">
               <Button
                 onClick={closeEditModal}
                 variant="outline"
                 disabled={saving}
               >
                 Cancel
               </Button>
               <Button
                 onClick={saveEdit}
                 disabled={saving}
               >
                 {saving ? 'Saving...' : 'Save'}
               </Button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }
