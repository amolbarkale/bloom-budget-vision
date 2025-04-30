
import { useEffect } from 'react';
import MainNav from '../components/MainNav';
import ExpenseList from '../components/ExpenseList';
import { useBudget } from '../context/BudgetContext';
import { Card, CardContent } from '@/components/ui/card';

const History = () => {
  const { fetchExpenses, isLoading } = useBudget();

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="container py-6 pb-20 sm:pb-6">
        <h1 className="text-2xl font-bold mb-6">Expense History</h1>
        
        <Card>
          <CardContent className="p-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading expense history...
              </div>
            ) : (
              <ExpenseList />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
