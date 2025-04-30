
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { expenseService } from '../services/expenseService';
import { goalService } from '../services/goalService';

// Define interfaces based on the requirements
interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: "Food" | "Transport" | "Entertainment" | "Shopping" | "Health" | "Other";
  note?: string;
  date: string; // ISO format
}

interface SavingsGoal {
  id: string;
  userId: string;
  month: string; // e.g. "2025-05"
  targetAmount: number;
}

interface CategoryTotal {
  category: string;
  total: number;
}

interface BudgetContextType {
  expenses: Expense[];
  goals: SavingsGoal[];
  isLoading: boolean;
  fetchExpenses: (filters?: any) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'userId'>) => Promise<void>;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  monthlyTotal: number;
  currentMonthGoal: SavingsGoal | null;
  getCategoryTotals: (expenses: Expense[]) => CategoryTotal[];
  getFilteredExpenses: (filters: any) => Expense[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token, isAuthenticated } = useAuth();

  const fetchExpenses = async (filters?: any) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const data = await expenseService.getExpenses(filters);
      setExpenses(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      const newExpense = await expenseService.createExpense(expense);
      setExpenses(prev => [...prev, newExpense]);
      toast.success('Expense added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, expense: Partial<Expense>) => {
    try {
      setIsLoading(true);
      const updatedExpense = await expenseService.updateExpense(id, expense);
      setExpenses(prev => 
        prev.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp)
      );
      toast.success('Expense updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update expense');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setIsLoading(true);
      await expenseService.deleteExpense(id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success('Expense deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete expense');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch savings goals');
    } finally {
      setIsLoading(false);
    }
  };

  const addGoal = async (goal: Omit<SavingsGoal, 'id' | 'userId'>) => {
    try {
      setIsLoading(true);
      const newGoal = await goalService.createGoal(goal);
      setGoals(prev => [...prev, newGoal]);
      toast.success('Savings goal added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add savings goal');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = async (id: string, goal: Partial<SavingsGoal>) => {
    try {
      setIsLoading(true);
      const updatedGoal = await goalService.updateGoal(id, goal);
      setGoals(prev => 
        prev.map(g => g.id === id ? { ...g, ...updatedGoal } : g)
      );
      toast.success('Savings goal updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update savings goal');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setIsLoading(true);
      await goalService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Savings goal deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete savings goal');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the total expenses for the current month
  const getCurrentMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };
  
  const monthlyTotal = expenses
    .filter(expense => expense.date.startsWith(getCurrentMonth()))
    .reduce((total, expense) => total + expense.amount, 0);
  
  // Get the current month's savings goal
  const currentMonth = getCurrentMonth();
  const currentMonthGoal = goals.find(goal => goal.month === currentMonth) || null;

  // Get category totals for charts
  const getCategoryTotals = (expensesList: Expense[]): CategoryTotal[] => {
    const categoryTotals: { [key: string]: number } = {};
    
    expensesList.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total
    }));
  };

  // Filter expenses based on provided filters
  const getFilteredExpenses = (filters: any = {}): Expense[] => {
    let filtered = [...expenses];
    
    // Filter by category
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(expense => 
        filters.categories.includes(expense.category)
      );
    }
    
    // Filter by date range
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= new Date(filters.startDate) && 
               expenseDate <= new Date(filters.endDate);
      });
    }
    
    return filtered;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
      fetchGoals();
    }
  }, [isAuthenticated]);

  return (
    <BudgetContext.Provider
      value={{
        expenses,
        goals,
        isLoading,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchGoals,
        addGoal,
        updateGoal,
        deleteGoal,
        monthlyTotal,
        currentMonthGoal,
        getCategoryTotals,
        getFilteredExpenses
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
