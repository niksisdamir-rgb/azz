import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Worker {
  name: string;
  position: string;
}

interface Shift {
  date: string;
  worker: string;
  position: string;
  hours: number;
  code: string;
  shift?: string;
  day: number;
}

interface PayrollState {
  selectedYear: number;
  selectedMonth: number;
  shiftData: Shift[];
  overtimeData: Record<string, number>;
  dataGenerated: boolean;
  
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setShiftData: (data: Shift[]) => void;
  setOvertimeData: (data: Record<string, number>) => void;
  setDataGenerated: (generated: boolean) => void;
}

export const usePayrollStore = create<PayrollState>()(
  persist(
    (set) => ({
      selectedYear: 2026,
      selectedMonth: 1,
      shiftData: [],
      overtimeData: {},
      dataGenerated: false,

      setYear: (selectedYear) => set({ selectedYear }),
      setMonth: (selectedMonth) => set({ selectedMonth }),
      setShiftData: (shiftData) => set({ shiftData }),
      setOvertimeData: (overtimeData) => set({ overtimeData }),
      setDataGenerated: (dataGenerated) => set({ dataGenerated }),
    }),
    {
      name: 'payroll-storage',
    }
  )
);
