'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const DataVisualizationDemo = () => {
  // Mock data for demonstration
  const workerData = [
    { name: 'Slaviša', hours: 180, overtime: 24, efficiency: 95 },
    { name: 'Mile', hours: 172, overtime: 12, efficiency: 88 },
    { name: 'Dragan', hours: 168, overtime: 8, efficiency: 92 },
    { name: 'Denis', hours: 175, overtime: 15, efficiency: 90 },
    { name: 'Bakir', hours: 160, overtime: 0, efficiency: 85 },
    { name: 'Dražen', hours: 185, overtime: 30, efficiency: 98 },
  ];

  const teamDistribution = [
    { name: 'Team 1', value: 400 },
    { name: 'Team 2', value: 300 },
    { name: 'Team 3', value: 300 },
    { name: 'Regular', value: 200 },
  ];

  const monthlyTrend = [
    { month: 'Jan', hours: 2100 },
    { month: 'Feb', hours: 1950 },
    { month: 'Mar', hours: 2200 },
    { month: 'Apr', hours: 2150 },
    { month: 'May', hours: 2300 },
    { month: 'Jun', hours: 2400 },
  ];

  const COLORS = ['#1e3a5f', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Data Visualization Gallery</h1>
            <p className="text-slate-500 mt-1">Showcasing advanced analytics and reporting capabilities</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Workforce</p>
                  <h3 className="text-2xl font-bold text-slate-900">16 Workers</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Monthly Hours</p>
                  <h3 className="text-2xl font-bold text-slate-900">2,450 hrs</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Efficiency Rate</p>
                  <h3 className="text-2xl font-bold text-slate-900">92.4%</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart - Hours & Overtime */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Workload Distribution
              </CardTitle>
              <CardDescription>Comparison of regular hours vs overtime by worker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workerData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#1e3a5f" name="Regular Hours" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="overtime" fill="#f59e0b" name="Overtime" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Area Chart - Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-green-600" />
                Operational Trend
              </CardTitle>
              <CardDescription>Total labor hours over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Team Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                Team Allocation
              </CardTitle>
              <CardDescription>Distribution of labor across different teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {teamDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart - Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Individual worker efficiency ratings (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={workerData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationDemo;
