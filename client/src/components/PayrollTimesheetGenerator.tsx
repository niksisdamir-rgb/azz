'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Users, Download, RefreshCw, Printer, ChevronDown, ChevronUp, MessageSquare, BarChart3, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePayrollStore } from '@/hooks/usePayrollStore';

/**
 * Professional Enterprise Design - Payroll Timesheet Generator
 * Color Scheme: Deep slate blue (#1e3a5f) + Warm amber (#f59e0b)
 * Typography: Poppins for headers, Inter for body
 * Layout: Sidebar + Main table with frozen columns
 */

const PayrollTimesheetGenerator = () => {
  const { 
    selectedYear, 
    selectedMonth, 
    shiftData, 
    overtimeData, 
    dataGenerated,
    setYear,
    setMonth,
    setShiftData,
    setOvertimeData,
    setDataGenerated
  } = usePayrollStore();

  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({ team1: true, team2: true, team3: true, regular: true });

  // Real workers organized by teams
  const teams = {
    team1: [
      { name: 'Slaviša Jovičić', position: 'operater na bazi' },
      { name: 'Mile Vucina', position: 'vozač - UTOVARIVAČ' },
      { name: 'Dragan Raguž', position: 'vozač - MIKSER' },
      { name: 'Denis Marković', position: 'vozač - MIKSER' }
    ],
    team2: [
      { name: 'Bakir Behmen', position: 'operater na bazi' },
      { name: 'Dražen Proleta', position: 'vozač - MIKSER' },
      { name: 'Danko Perić', position: 'vozač - MIKSER' },
      { name: 'Seldin Selman', position: 'vozač - UTOVARIVAČ' }
    ],
    team3: [
      { name: 'Srđan Cvijović', position: 'operater na bazi' },
      { name: 'Marko Radisic', position: 'vozač - UTOVARIVAČ' },
      { name: 'Radivoje Gordić', position: 'vozač - MIKSER' },
      { name: 'Mirnel Koso', position: 'vozač - MIKSER' }
    ],
    regular: [
      { name: 'Firzet Selman', position: 'pomoćni radnik' },
      { name: 'Srećko Kundačina', position: 'vagar' },
      { name: 'Aner Mrgan', position: 'vozač - MIKSER' },
      { name: 'Nikola Kovačević', position: 'vozač - MIKSER' }
    ]
  };

  const allWorkers = [...teams.team1, ...teams.team2, ...teams.team3, ...teams.regular];

  const monthNames = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
  const dayNames = ['Ned.', 'Pon.', 'Uto.', 'Sre.', 'Čet.', 'Pet.', 'Sub.'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

  const isWorkingDay = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    const startDate = new Date(2026, 0, 5);
    return date >= startDate;
  };

  const generateRealSchedule = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const newData: any[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      if (!isWorkingDay(selectedYear, selectedMonth, day)) {
        allWorkers.forEach(worker => {
          newData.push({
            date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            worker: worker.name,
            position: worker.position,
            hours: 0,
            code: '',
            day: day
          });
        });
        continue;
      }

      const date = new Date(selectedYear, selectedMonth - 1, day);
      const startDate = new Date(2026, 0, 5);
      const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const cycleDay = daysSinceStart % 15;

      let team1Shift, team2Shift, team3Shift;

      if (cycleDay < 5) {
        team1Shift = 'morning';
        team2Shift = 'night';
        team3Shift = 'free';
      } else if (cycleDay < 10) {
        team1Shift = 'night';
        team2Shift = 'free';
        team3Shift = 'morning';
      } else {
        team1Shift = 'free';
        team2Shift = 'morning';
        team3Shift = 'night';
      }

      const processTeam = (teamWorkers: typeof teams.team1, shift: string) => {
        teamWorkers.forEach(worker => {
          if (shift === 'morning') {
            newData.push({
              date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
              worker: worker.name,
              position: worker.position,
              hours: 12,
              code: '12',
              shift: 'I (07-19)',
              day: day
            });
          } else if (shift === 'night') {
            newData.push({
              date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
              worker: worker.name,
              position: worker.position,
              hours: 12,
              code: '12',
              shift: 'II (19-07)',
              day: day
            });
          } else {
            newData.push({
              date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
              worker: worker.name,
              position: worker.position,
              hours: 0,
              code: 'S',
              shift: '',
              day: day
            });
          }
        });
      };

      processTeam(teams.team1, team1Shift);
      processTeam(teams.team2, team2Shift);
      processTeam(teams.team3, team3Shift);

      const dayOfWeek = date.getDay();
      const weekNumber = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      const saturdayWork = isSaturday && weekNumber % 2 === 0;

      teams.regular.forEach(worker => {
        if (isSunday) {
          newData.push({
            date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            worker: worker.name,
            position: worker.position,
            hours: 0,
            code: 'S',
            shift: '',
            day: day
          });
        } else if (isSaturday && !saturdayWork) {
          newData.push({
            date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            worker: worker.name,
            position: worker.position,
            hours: 0,
            code: 'S',
            shift: '',
            day: day
          });
        } else {
          newData.push({
            date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            worker: worker.name,
            position: worker.position,
            hours: 10,
            code: '10',
            shift: '(07-17)',
            day: day
          });
        }
      });
    }

    setShiftData([...newData]);
    setOvertimeData({});
    setDataGenerated(true);
    toast.success('Schedule generated successfully');
  };

  const handleOvertimeChange = (workerName: string, day: number, value: string) => {
    const key = `${workerName}-${day}`;
    setOvertimeData({
      ...overtimeData,
      [key]: value === '' ? 0 : parseFloat(value) || 0
    });
  };

  const getOvertime = (workerName: string, day: number) => {
    const key = `${workerName}-${day}`;
    return overtimeData[key] || 0;
  };

  const pivotData = useMemo(() => {
    if (!shiftData.length) return null;

    const workers = allWorkers;
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const result: Record<string, any> = {};

    workers.forEach(worker => {
      result[worker.name] = {
        position: worker.position,
        days: {},
        total: 0,
        totalOvertime: 0
      };

      for (let day = 1; day <= daysInMonth; day++) {
        result[worker.name].days[day] = { hours: 0, code: '', shift: '', overtime: 0 };
      }
    });

    shiftData.forEach(shift => {
      const worker = shift.worker;
      const day = shift.day;
      const overtime = getOvertime(worker, day);
      result[worker].days[day] = {
        hours: shift.hours,
        code: shift.code,
        shift: shift.shift || '',
        overtime: overtime
      };
      result[worker].total += shift.hours;
      result[worker].totalOvertime += overtime;
    });

    return { workers, data: result as Record<string, any>, daysInMonth };
  }, [shiftData, selectedYear, selectedMonth, overtimeData]);

  const handlePrint = () => {
    window.print();
  };

  const exportToCSV = () => {
    if (!pivotData) {
      toast.error('Please generate schedule first');
      return;
    }

    let csv = `Payroll Timesheet - ${monthNames[selectedMonth - 1]} ${selectedYear}\n\n`;
    csv += 'Worker,Position,';

    for (let day = 1; day <= pivotData.daysInMonth; day++) {
      csv += `Day ${day},`;
    }
    csv += 'Total Hours,Total Overtime\n';

    pivotData.workers.forEach(worker => {
      const workerData = pivotData.data[worker.name];
      csv += `"${worker.name}","${worker.position}",`;

      for (let day = 1; day <= pivotData.daysInMonth; day++) {
        const dayData = workerData.days[day];
        csv += `"${dayData.hours}h",`;
      }

      csv += `${workerData.total},${workerData.totalOvertime}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `payroll_${selectedYear}_${selectedMonth}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('CSV exported successfully');
  };

  const toggleTeam = (team: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [team]: !prev[team]
    }));
  };

  const chartData = useMemo(() => {
    if (!pivotData) return [];
    return pivotData.workers.map(worker => ({
      name: worker.name.split(' ')[0], // Use first name for chart
      fullName: worker.name,
      hours: pivotData.data[worker.name].total,
      overtime: pivotData.data[worker.name].totalOvertime
    })).sort((a, b) => b.hours - a.hours);
  }, [pivotData]);

  const getShiftColor = (code: string) => {
    if (code === '12') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (code === '10') return 'bg-green-50 text-green-700 border-green-200';
    if (code === 'S') return 'bg-gray-50 text-gray-600 border-gray-200';
    return 'bg-slate-50 text-slate-400 border-slate-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with background image */}
      <div className="relative bg-cover bg-center h-48 flex items-end" style={{ backgroundImage: 'url(/images/dashboard-header.png)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/60"></div>
        <div className="relative container py-8 text-white">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Poppins' }}>Payroll Timesheet Generator</h1>
          <p className="text-slate-200 mt-2">Manage worker shifts and calculate monthly hours</p>
          <div className="mt-4 flex gap-3">
            <Link href="/socket">
              <Button variant="secondary" size="sm" className="bg-amber-500 hover:bg-amber-600 text-white border-none">
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Socket Demo
              </Button>
            </Link>
            <Link href="/viz">
              <Button variant="secondary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                <BarChart3 className="w-4 h-4 mr-2" />
                Data Visualization Demo
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="secondary" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Integrated Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Controls Section */}
        <Card className="mb-6 border-slate-200 shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
                <Select value={selectedYear.toString()} onValueChange={(val) => setYear(parseInt(val))}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2025, 2026, 2027].map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
                <Select value={selectedMonth.toString()} onValueChange={(val) => setMonth(parseInt(val))}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, idx) => (
                      <SelectItem key={idx} value={(idx + 1).toString()}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={generateRealSchedule} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handlePrint} variant="outline" className="flex-1 border-slate-300" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={exportToCSV} variant="outline" className="flex-1 border-slate-300" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Display */}
        {!dataGenerated ? (
          <Card className="border-slate-200 shadow-sm">
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">Select month and year, then click Generate to create the schedule</p>
            </div>
          </Card>
        ) : pivotData && (pivotData as any).data ? (
          <div className="space-y-4">
            {/* Summary Stats & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border-slate-200 shadow-sm h-full">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-amber-500" />
                        Hours Distribution by Worker
                      </h3>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                          />
                          <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index < 3 ? '#1e3a5f' : '#3b82f6'} />
                            ))}
                          </Bar>
                          <Bar dataKey="overtime" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <div className="p-4">
                  <p className="text-slate-600 text-sm font-medium">Total Workers</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{pivotData.workers.length}</p>
                </div>
              </Card>
              <Card className="border-slate-200 shadow-sm">
                <div className="p-4">
                  <p className="text-slate-600 text-sm font-medium">Days in Month</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{pivotData.daysInMonth}</p>
                </div>
              </Card>
              <Card className="border-slate-200 shadow-sm">
                <div className="p-4">
                  <p className="text-slate-600 text-sm font-medium">Total Hours</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {pivotData.workers.reduce((sum, w) => sum + pivotData.data[w.name].total, 0)}
                  </p>
                </div>
              </Card>
              </div>
            </div>

            {/* Teams Section */}
            <div className="space-y-4">
              {Object.entries(teams).map(([teamKey, teamWorkers]) => (
                <Card key={teamKey} className="border-slate-200 shadow-sm overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 cursor-pointer flex items-center justify-between"
                    onClick={() => toggleTeam(teamKey)}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-amber-400" />
                      <h3 className="text-white font-semibold" style={{ fontFamily: 'Poppins' }}>
                        {teamKey === 'team1' ? 'Team 1' : teamKey === 'team2' ? 'Team 2' : teamKey === 'team3' ? 'Team 3' : 'Regular Staff'}
                      </h3>
                      <span className="text-slate-300 text-sm">({teamWorkers.length} workers)</span>
                    </div>
                    {expandedTeams[teamKey] ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
                  </div>

                  {expandedTeams[teamKey] && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200">
                            <th className="px-4 py-3 text-left font-semibold text-slate-700 sticky left-0 bg-slate-100 z-10 w-32">Worker</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700 w-24">Position</th>
                            {Array.from({ length: pivotData.daysInMonth }).map((_, day) => (
                              <th key={day + 1} className="px-2 py-3 text-center font-semibold text-slate-700 min-w-12 bg-slate-50">
                                <div className="text-xs">{day + 1}</div>
                                <div className="text-xs text-slate-500">{dayNames[(new Date(selectedYear, selectedMonth - 1, day + 1).getDay())]}</div>
                              </th>
                            ))}
                            <th className="px-4 py-3 text-center font-semibold text-slate-700 w-16">Total</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-700 w-16">OT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamWorkers.map((worker, idx) => {
                            const workerData = pivotData.data[worker.name];
                            return (
                              <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900 sticky left-0 bg-white z-10 hover:bg-slate-50">{worker.name}</td>
                                <td className="px-4 py-3 text-slate-600 text-xs">{worker.position}</td>
                                {Array.from({ length: pivotData.daysInMonth }).map((_, day) => {
                                  const dayData = workerData.days[day + 1];
                                  return (
                                    <td key={day + 1} className="px-2 py-3 text-center">
                                      <div className="space-y-1">
                                        {dayData.hours > 0 && (
                                          <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getShiftColor(dayData.code)}`}>
                                            {dayData.code}h
                                          </div>
                                        )}
                                        {dayData.code === 'S' && (
                                          <div className="inline-block px-2 py-1 rounded text-xs font-medium border bg-gray-50 text-gray-600 border-gray-200">
                                            S
                                          </div>
                                        )}
                                        <div className="mt-1">
                                          <Input
                                            type="number"
                                            className="h-6 w-12 text-[10px] p-1 text-center border-slate-200 focus:border-amber-400"
                                            placeholder="OT"
                                            value={dayData.overtime || ''}
                                            onChange={(e) => handleOvertimeChange(worker.name, day + 1, e.target.value)}
                                          />
                                        </div>
                                      </div>
                                    </td>
                                  );
                                })}
                                <td className="px-4 py-3 text-center font-semibold text-slate-900">{workerData.total}</td>
                                <td className="px-4 py-3 text-center font-semibold text-amber-600">{workerData.totalOvertime}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PayrollTimesheetGenerator;
