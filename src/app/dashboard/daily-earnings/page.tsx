'use client';

import { useState, useEffect } from 'react';
import { Container, Section, Typography, useToast } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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

export default function DailyEarningsPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [earnings, setEarnings] = useState<Record<number, number>>({});
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch existing earnings for the selected date
  useEffect(() => {
    if (selectedDate) {
      fetchEarningsForDate(selectedDate);
    }
  }, [selectedDate]);

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

  const fetchEarningsForDate = async (date: string) => {
    try {
      const response = await fetch(`/api/daily-earnings?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        const earningsMap: Record<number, number> = {};
        data.forEach((earning: DailyEarning) => {
          earningsMap[earning.categoryId] = earning.amount;
        });
        setEarnings(earningsMap);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const handleAmountChange = (categoryId: number, amount: string) => {
    const numericAmount = parseFloat(amount) || 0;
    setEarnings(prev => ({
      ...prev,
      [categoryId]: numericAmount
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/daily-earnings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          earnings: Object.entries(earnings).map(([categoryId, amount]) => ({
            categoryId: parseInt(categoryId),
            amount: amount
          }))
        }),
      });

      if (response.ok) {
        addToast({
          title: 'Success!',
          description: 'Daily earnings saved successfully!',
          type: 'success',
          duration: 4000
        });
      } else {
        addToast({
          title: 'Error',
          description: 'Failed to save daily earnings. Please try again.',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
      <Section padding="xl">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Typography variant="h1" className="mb-4">
                Daily Earnings
              </Typography>
              <Typography variant="p" className="text-gray-600 dark:text-gray-300">
                Track your daily earnings by category
              </Typography>
            </div>

            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date:
                </label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                          {category.name}
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={earnings[category.id] || ''}
                            onChange={(e) => handleAmountChange(category.id, e.target.value)}
                            placeholder="0.00"
                            className="w-32"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2"
                >
                  {saving ? 'Saving...' : 'Save Daily Earnings'}
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
