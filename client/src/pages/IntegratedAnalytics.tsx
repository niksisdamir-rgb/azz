'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { usePayrollStore } from '@/hooks/usePayrollStore';

const IntegratedAnalytics = () => {
  const { shiftData, selectedYear, selectedMonth, overtimeData, dataGenerated } = usePayrollStore();

  const teams = {
    team1: ['Slaviša Jovičić', 'Mile Vucina', 'Dragan Raguž', 'Denis Marković'],
    team2: ['Bakir Behmen', 'Dražen Proleta', 'Danko Perić', 'Seldin Selman'],
    team3: ['Srđan Cvijović', 'Marko Radisic', 'Radivoje Gordić', 'Mirnel Koso'],
    regular: ['Firzet Selman', 'Srećko Kundačina', 'Aner Mrgan', 'Nikola Kovačević']
  };

  const analyticsData = useMemo(() => {
    if (!shiftData.length) return null;

    const workerStats: Record<string, { hours: number, overtime: number, name: string }> = {};
    const teamStats: Record<string, { value: number, name: string }> = {
      'Team 1': { value: 0, name: 'Team 1' },
      'Team 2': { value: 0, name: 'Team 2' },
      'Team 3': { value: 0, name: 'Team 3' },
      'Regular': { value: 0, name: 'Regular' }
    };

    shiftData.forEach(shift => {
      if (!workerStats[shift.worker]) {
        workerStats[shift.worker] = { hours: 0, overtime: 0, name: shift.worker.split(' ')[0] };
      }
      
      const otKey = `${shift.worker}-${shift.day}`;
      const overtime = overtimeData[otKey] || 0;
      
      workerStats[shift.worker].hours += shift.hours;
      workerStats[shift.worker].overtime += overtime;

      // Team attribution
      if (teams.team1.includes(shift.worker)) teamStats['Team 1'].value += shift.hours + overtime;
      else if (teams.team2.includes(shift.worker)) teamStats['Team 2'].value += shift.hours + overtime;
      else if (teams.team3.includes(shift.worker)) teamStats['Team 3'].value += shift.hours + overtime;
      else teamStats['Regular'].value += shift.hours + overtime;
    });

    const workers = Object.values(workerStats).sort((a, b) => (b.hours + b.overtime) - (a.hours + a.overtime));
    const totalHours = workers.reduce((sum, w) => sum + w.hours, 0);
    const totalOvertime = workers.reduce((sum, w) => sum + w.overtime, 0);

    return {
      workers,
      teams: Object.values(teamStats),
      totalHours,
      totalOvertime,
      workerCount: workers.length
    };
  }, [shiftData, overtimeData]);

  const COLORS = ['#1e3a5f', '#f59e0b', '#3b82f6', '#10b981'];

  if (!dataGenerated || !analyticsData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center p-12">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Data Available</h2>
          <p className="text-slate-500 mb-8">Please generate a payroll schedule first to view integrated analytics.</p>
          <Link href="/">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Go to Generator</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Integrated Payroll Analytics</h1>
            <p className="text-slate-500 mt-1">Real-time insights for {selectedMonth}/2026</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Generator</Button>
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
                  <p className="text-sm font-medium text-slate-500">Active Workers</p>
                  <h3 className="text-2xl font-bold text-slate-900">{analyticsData.workerCount}</h3>
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
                  <p className="text-sm font-medium text-slate-500">Total Hours</p>
                  <h3 className="text-2xl font-bold text-slate-900">{analyticsData.totalHours} hrs</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Overtime</p>
                  <h3 className="text-2xl font-bold text-slate-900">{analyticsData.totalOvertime} hrs</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart - Real Workload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Real-time Workload Distribution
              </CardTitle>
              <CardDescription>Actual hours and overtime from current schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.workers}>
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

          {/* Pie Chart - Real Team Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                Actual Team Allocation
              </CardTitle>
              <CardDescription>Labor distribution based on generated shifts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.teams}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.teams.map((entry, index) => (
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
        </div>
      </div>
    </div>
  );
};

export default IntegratedAnalytics;
