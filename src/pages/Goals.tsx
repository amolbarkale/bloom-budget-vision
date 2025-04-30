
import { useEffect, useState } from 'react';
import MainNav from '../components/MainNav';
import SavingsGoalList from '../components/SavingsGoalList';
import SavingsGoalForm from '../components/SavingsGoalForm';
import { useBudget } from '../context/BudgetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Goals = () => {
  const { fetchGoals, isLoading, goals } = useBudget();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchGoals();
      setInitialLoaded(true);
    };
    
    loadData();
  }, [fetchGoals]);

  // Prepare UI rendering states to prevent shaking
  const showLoadingState = isLoading && !initialLoaded;
  const showGoalsList = !isLoading && goals.length > 0;
  const showEmptyState = !isLoading && initialLoaded && goals.length === 0;

  const handleSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="container py-6 pb-20 sm:pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Savings Goals</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>New Savings Goal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Savings Goal</DialogTitle>
              </DialogHeader>
              <SavingsGoalForm 
                onSubmit={handleSuccess} 
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardContent className="p-4">
            {showLoadingState ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading savings goals...
              </div>
            ) : showEmptyState ? (
              <div className="text-center py-8 text-muted-foreground">
                No savings goals yet. Add your first goal to start tracking your progress.
              </div>
            ) : showGoalsList ? (
              <SavingsGoalList />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Goals;
