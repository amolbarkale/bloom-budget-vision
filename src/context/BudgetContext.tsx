import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category:
    | "Food"
    | "Transport"
    | "Entertainment"
    | "Shopping"
    | "Health"
    | "Other";
  note?: string;
  date: string;
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
  addExpense: (expense: Omit<Expense, "id" | "userId">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateExpense: (
    id: string,
    data: Omit<Expense, "id" | "user_id">
  ) => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<SavingsGoal, "id" | "userId">) => Promise<void>;
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
  const { isAuthenticated, session } = useAuth();
  const userId = session?.user.id;

  const fetchExpenses = async () => {
    if (!userId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    setIsLoading(false);
    if (error) {
      toast.error("Failed to load expenses");
    } else {
      setExpenses(data || []);
    }
  };

  const addExpense = async (expense: Omit<Expense, "id" | "user_id">) => {
    if (!userId) return;
    setIsLoading(true);
    const { error } = await supabase
      .from("expenses")
      .insert([{ ...expense, user_id: userId }]);
    setIsLoading(false);
    if (error) {
      toast.error("Failed to add expense");
    } else {
      toast.success("Expense added successfully");
      await fetchExpenses();
    }
  };

  const updateExpense = async (
    id: string,
    expense: Omit<Expense, "id" | "user_id">
  ) => {
    if (!userId) return;
    setIsLoading(true);
    const { error } = await supabase
      .from("expenses")
      .update({ ...expense, user_id: userId })
      .eq("id", id);
    setIsLoading(false);

    if (error) {
      toast.error("Failed to update expense");
    } else {
      toast.success("Expense updated successfully");
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...expense } : e))
      );
    }
  };

  const deleteExpense = async (id: string) => {
    setIsLoading(true);
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    setIsLoading(false);
    if (error) {
      toast.error("Failed to delete expense");
    } else {
      toast.success("Expense deleted successfully");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const fetchGoals = async () => {
    if (!userId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("user_id", userId)
      .order("month", { ascending: false });
    setIsLoading(false);
    if (error) {
      toast.error("Failed to load savings goals");
    } else {
      setGoals(data || []);
    }
  };

  const addGoal = async (goal: Omit<SavingsGoal, "id" | "user_id">) => {
    if (!userId) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("savings_goals")
      .insert([{ ...goal, user_id: userId }]);

    setIsLoading(false);

    if (error) {
      toast.error("Failed to add goal");
    } else {
      toast.success("Savings goal added successfully");
      await fetchGoals();
    }
  };

  const updateGoal = async (id: string, data: Partial<SavingsGoal>) => {
    if (!userId) return;

    setIsLoading(true);

    const { error } = await supabase
      .from("savings_goals")
      .update(data)
      .eq("id", id);

    setIsLoading(false);

    if (error) {
      toast.error("Failed to update goal");
    } else {
      toast.success("Savings goal updated successfully");
      await fetchGoals();
    }
  };

  const deleteGoal = async (id: string) => {
    if (!userId) return;

    setIsLoading(true);

    const { error } = await supabase
      .from("savings_goals")
      .delete()
      .eq("id", id);

    setIsLoading(false);

    if (error) {
      toast.error("Failed to delete goal");
    } else {
      toast.success("Savings goal deleted successfully");
      await fetchGoals();
    }
  };

  const getCurrentMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const monthlyTotal = expenses
    .filter((expense) => expense.date.startsWith(getCurrentMonth()))
    .reduce((total, expense) => total + expense.amount, 0);

  const currentMonthGoal =
    goals.find((goal) => goal.month === getCurrentMonth()) || null;

  const getCategoryTotals = (expensesList: Expense[]): CategoryTotal[] => {
    const categoryTotals: { [key: string]: number } = {};

    expensesList.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
    }));
  };

  const getFilteredExpenses = (filters: any = {}): Expense[] => {
    let filtered = [...expenses];

    // Filter by category
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((expense) =>
        filters.categories.includes(expense.category)
      );
    }

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate >= new Date(filters.startDate) &&
          expenseDate <= new Date(filters.endDate)
        );
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
        getFilteredExpenses,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
