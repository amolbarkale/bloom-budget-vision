import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { useBudget } from "../context/BudgetContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SavingsGoalForm from "./SavingsGoalForm";
import { formatCurrency } from "@/helpers";

const SavingsGoalList = () => {
  const { goals, expenses, deleteGoal } = useBudget();
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const calculateSpentForMonth = (month) => {
    return expenses
      .filter((expense) => {
        const expenseMonth = format(parseISO(expense.date), "yyyy-MM");
        return expenseMonth === month;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const sortedGoals = [...goals].sort((a, b) => {
    return new Date(b.month).getTime() - new Date(a.month).getTime();
  });

  const confirmDelete = (goal) => {
    setSelectedGoal(goal);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedGoal) {
      await deleteGoal(selectedGoal.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedGoals.map((goal) => {
          const spentAmount = calculateSpentForMonth(goal.month);
          const savedAmount = goal.targetAmount - spentAmount;
          const progress = Math.min(
            100,
            Math.max(0, (savedAmount / goal.targetAmount) * 100)
          );

          return (
            <Card key={goal.id} className="animate-fade-in">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {format(new Date(goal.month + "-01"), "MMMM yyyy")}
                  </CardTitle>
                  <span className="font-semibold">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress:</span>
                  <span
                    className={
                      savedAmount >= 0
                        ? "text-budget-success"
                        : "text-budget-danger"
                    }
                  >
                    {formatCurrency(savedAmount)} saved
                  </span>
                </div>

                <Progress value={progress} className="h-2" />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {savedAmount >= 0
                      ? `${progress.toFixed(0)}% of goal`
                      : "Over budget"}
                  </span>
                  <span>{formatCurrency(spentAmount)} spent</span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(goal)}
                >
                  <Edit2 size={16} className="mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => confirmDelete(goal)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 size={16} className="mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Savings Goal</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <SavingsGoalForm
              goal={selectedGoal}
              onSubmit={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this savings goal?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavingsGoalList;
