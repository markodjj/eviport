import { Container, Section, Typography, Card } from '@/components/ui';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
      <Section padding="xl">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Typography variant="h1" className="mb-4">
                Dashboard
              </Typography>
              <Typography variant="p" className="text-gray-600 dark:text-gray-300 text-lg">
                Welcome to your earnings tracking dashboard
              </Typography>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Daily Tracking
                </Typography>
                <Typography variant="p" className="text-gray-600 dark:text-gray-300 mb-4">
                  Track your daily earnings by category
                </Typography>
                <Link href="/dashboard/daily-earnings">
                  <Button className="w-full">
                    View Daily Earnings
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Monthly Overview
                </Typography>
                <Typography variant="p" className="text-gray-600 dark:text-gray-300 mb-4">
                  Calendar view of your monthly earnings
                </Typography>
                <Link href="/dashboard/monthly-earnings">
                  <Button className="w-full">
                    View Monthly Earnings
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <Typography variant="h3" className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Yearly Analytics
                </Typography>
                <Typography variant="p" className="text-gray-600 dark:text-gray-300 mb-4">
                  Comprehensive yearly statistics and trends
                </Typography>
                <Link href="/dashboard/yearly-earnings">
                  <Button className="w-full">
                    View Yearly Earnings
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <Typography variant="h3" className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Quick Actions
              </Typography>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Link href="/dashboard/daily-earnings">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Today's Earnings
                    </Button>
                  </Link>
                  <Link href="/dashboard/monthly-earnings">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Monthly Calendar
                    </Button>
                  </Link>
                  <Link href="/dashboard/categories">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Manage Categories
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  <Link href="/dashboard/yearly-earnings">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Yearly Statistics
                    </Button>
                  </Link>
                  <Link href="/dashboard/monthly-earnings">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Edit Previous Entries
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
